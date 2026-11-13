import { format } from "date-fns";
import { flightBookingManagePath } from "../../shared/bookingFlowRoutes";
import { localDate } from "../results/offerFacts";
import { fareRows } from "../results/fareRows";
import { formatMoney } from "../currency";
import type { CancellationPreview, FlightBooking, FlightOffer, Money, Segment, TravelerType } from "../types";

// My bookings and Manage (mock: Manage): status badges, list rows and the
// facts the manage page shows, all derived from the booking.

export type BadgeTone = "blue" | "green" | "amber" | "red" | "grey";
export interface StatusBadge {
  text: string;
  tone: BadgeTone;
}

/** Mock: "Booked · ticket being issued" (blue), "Ticketed" (green). */
export const statusBadge = (booking: FlightBooking): StatusBadge => {
  const refunded = booking.refund?.status === "COMPLETED";
  switch (booking.status) {
    case "HELD":
      return booking.payment?.status === "PENDING" ? { text: "Confirming payment", tone: "blue" } : { text: "Waiting for payment", tone: "amber" };
    case "PAID":
    case "TICKETING":
      return { text: "Booked · ticket being issued", tone: "blue" };
    case "TICKETED":
      return booking.scheduleChanges.length > 0 ? { text: "Ticketed · schedule changed", tone: "amber" } : { text: "Ticketed", tone: "green" };
    case "HOLD_EXPIRED":
      return { text: "Seats released", tone: "grey" };
    case "FAILED":
      if (booking.failure?.stage !== "AFTER_PAYMENT") return { text: "Not booked", tone: "red" };
      return refunded ? { text: "Not booked · refunded", tone: "grey" } : { text: "Not booked · refund in progress", tone: "red" };
    case "CANCELLATION_REQUESTED":
      return { text: "Cancellation requested", tone: "amber" };
    case "CANCELLED":
      if (!booking.refund) return { text: "Cancelled", tone: "grey" };
      return refunded ? { text: "Cancelled · refunded", tone: "grey" } : { text: "Cancelled · refund in progress", tone: "grey" };
  }
};

/**
 * Paid: before the ticket is issued it's a full refund; once ticketed the
 * server's cancellation preview says void (full refund) or airline refund.
 */
export const canCancel = (booking: FlightBooking) => ["PAID", "TICKETING", "TICKETED"].includes(booking.status);

const lastArrival = (offer: FlightOffer) => {
  const it = offer.itineraries[offer.itineraries.length - 1];
  return it.segments[it.segments.length - 1].to.atLocal;
};

/**
 * The status word the shared My bookings tabs understand
 * (`features/shared/bookingStatus`): confirmed, completed, cancelled, failed.
 */
export const listStatus = (booking: FlightBooking, now = Date.now()) => {
  switch (booking.status) {
    case "HELD":
    case "PAID":
    case "TICKETING":
      return "confirmed";
    case "TICKETED":
      return localDate(lastArrival(booking.offer)).getTime() < now ? "completed" : "confirmed";
    case "HOLD_EXPIRED":
      return "expired";
    case "FAILED":
      // Paid then not booked: a cancellation with a refund, not a payment failure
      return booking.failure?.stage === "AFTER_PAYMENT" ? "cancelled" : "failed";
    case "CANCELLATION_REQUESTED":
    case "CANCELLED":
      return "cancelled";
  }
};

/** "Lagos ⇄ London", "Lagos → London", or "Lagos → London → Lagos" for multi-city. */
export const routeName = (offer: FlightOffer) => {
  const its = offer.itineraries;
  const from = its[0].segments[0].from.city;
  const firstTo = its[0].segments[its[0].segments.length - 1].to.city;
  if (its.length === 1) return `${from} → ${firstTo}`;
  if (its.length === 2 && its[1].segments[its[1].segments.length - 1].to.city === from) return `${from} ⇄ ${firstTo}`;
  return [from, ...its.map((it) => it.segments[it.segments.length - 1].to.city)].join(" → ");
};

/** Leaving to landing back, as the mock's Manage header: "15 – 29 Dec 2026", "28 Dec 2026 – 3 Jan 2027", "15 Dec 2026". */
export const tripDates = (offer: FlightOffer) => {
  const first = localDate(offer.itineraries[0].segments[0].from.atLocal);
  const last = localDate(lastArrival(offer));
  if (first.toDateString() === last.toDateString()) return format(first, "d MMM yyyy");
  if (first.getFullYear() !== last.getFullYear()) return `${format(first, "d MMM yyyy")} – ${format(last, "d MMM yyyy")}`;
  if (first.getMonth() !== last.getMonth()) return `${format(first, "d MMM")} – ${format(last, "d MMM yyyy")}`;
  return `${format(first, "d")} – ${format(last, "d MMM yyyy")}`;
};

const TYPE_WORDS: [TravelerType, string, string][] = [
  ["ADULT", "adult", "adults"],
  ["CHILD", "child", "children"],
  ["SEATED_INFANT", "infant in own seat", "infants in own seats"],
  ["HELD_INFANT", "infant on lap", "infants on lap"],
];

/** "1 adult", "2 adults, 1 child" */
export const travellersText = (booking: FlightBooking) =>
  TYPE_WORDS.map(([type, one, many]) => {
    const n = booking.travelers.filter((t) => t.type === type).length;
    return n === 0 ? "" : `${n} ${n === 1 ? one : many}`;
  })
    .filter(Boolean)
    .join(", ");

/** What the customer actually paid (in the currency they paid in), else the price. */
export const paidAmount = (booking: FlightBooking): Money => booking.payment?.amount ?? booking.total;

export interface FlightBookingRow {
  id: string;
  reference: string;
  status: string;
  name: string;
  date: string;
  date_to: string;
  amount: number;
  currency: string;
  badge: StatusBadge;
  detailsPath: string;
  /** Manage with the cancel section open; null when it can't be cancelled from the list. */
  cancelPath: string | null;
}

/** One row of My bookings. */
export const toBookingRow = (booking: FlightBooking, now = Date.now()): FlightBookingRow => {
  const paid = paidAmount(booking);
  return {
    id: booking.id,
    reference: booking.reference,
    status: listStatus(booking, now),
    name: routeName(booking.offer),
    date: booking.offer.itineraries[0].segments[0].from.atLocal,
    date_to: lastArrival(booking.offer),
    amount: Number(paid.amount),
    currency: paid.currency,
    badge: statusBadge(booking),
    detailsPath: flightBookingManagePath(booking.id),
    cancelPath: canCancel(booking) ? flightBookingManagePath(booking.id, { cancel: true }) : null,
  };
};

export interface FareLine {
  label: string;
  value: string;
}

/** Mock (Manage, "Your fare"): Refunds, Changes, Checked bags, Cabin bag. */
export const fareLines = (offer: FlightOffer): FareLine[] => {
  const rows = fareRows(offer);
  const state = (prefix: string) => rows.find((r) => r.text.startsWith(prefix))?.state;
  const refunds = state("Refunds");
  const changes = state("Changes");
  const { checked, cabin } = offer.baggage;
  // The weight may only be in the amenity text, which fareRows already reads ("1 checked bag, 23 kg")
  const kgIn = (prefix: RegExp) => rows.find((r) => prefix.test(r.text))?.text.match(/(\d+) kg/)?.[1];
  // "1 × 23 kg" (mock) when the airline gives the weight, else "1 bag" / "2 bags"
  const bags = (quantity: number, kg: number | string | null | undefined) => (kg ? `${quantity} × ${kg} kg` : `${quantity} ${quantity === 1 ? "bag" : "bags"}`);
  return [
    { label: "Refunds", value: refunds === "No" ? "Not refundable" : refunds === "For a fee" ? "For a fee" : refunds === "Free" ? "Free" : "Refundable" },
    { label: "Changes", value: changes === "No" ? "Not allowed" : changes === "Free" ? "Free" : "For a fee" },
    { label: "Checked bags", value: checked?.quantity ? bags(checked.quantity, checked.weightKg ?? kgIn(/^\d+ checked bag/)) : "None" },
    ...(cabin?.quantity ? [{ label: "Cabin bag", value: bags(cabin.quantity, cabin.weightKg ?? kgIn(/^Cabin bag/)) }] : []),
  ];
};

export interface CancelCopy {
  intro: string;
  lines: FareLine[];
  refundLabel: string;
  refundValue: string;
  steps: string[];
  cta: string;
}

/**
 * The cancel section's words and figures from the server's preview (mock:
 * Manage "Before ticket issued" / "After ticket issued"). VOID reads like the
 * full refund: the ticket is voided, nothing is kept.
 */
export const cancelCopy = (preview: CancellationPreview): CancelCopy => {
  const money = (m: Money | null) => (m ? formatMoney(m.amount, m.currency) : "To be confirmed");
  const paid = { label: "You paid", value: money(preview.paid) };
  if (preview.kind === "FULL_REFUND" || preview.kind === "VOID") {
    const back = money(preview.refund ?? preview.paid);
    return {
      intro:
        preview.kind === "VOID"
          ? "Your ticket was issued recently, so the airline still lets us void it. Cancel now for a full refund."
          : "Your ticket hasn’t been issued yet, so you can cancel now for a full refund.",
      lines: [paid, { label: "Cancellation fee", value: money(preview.deduction ?? { amount: "0", currency: preview.paid.currency }) }],
      refundLabel: "You get back",
      refundValue: back,
      steps: [
        preview.kind === "VOID" ? "We void your ticket with the airline straight away." : "We cancel your seats with the airline straight away.",
        `We refund ${back} to your original payment method.`,
        "Refunds usually reach you within a few working days.",
      ],
      cta: "Cancel and get full refund",
    };
  }
  const nonRefundable = preview.deduction !== null;
  return {
    intro: nonRefundable
      ? "Your ticket is issued and this fare is not refundable. Some taxes may still be refunded. We check the exact amount with the airline before refunding."
      : "Your ticket is issued. The airline confirms the exact refund, after any fee, before we refund you.",
    lines: [paid, { label: nonRefundable ? "Not refundable (fare)" : "Airline fee", value: money(preview.deduction) }],
    refundLabel: nonRefundable ? "Estimated refund (taxes)" : "Estimated refund",
    refundValue: money(preview.refund),
    steps: [
      "We send your cancellation to the airline.",
      "The airline confirms the refundable amount. This can take several days.",
      "We refund the confirmed amount to your original payment method and email you.",
    ],
    cta: "Request cancellation",
  };
};

export interface ScheduleAlert {
  key: string;
  /** "Schedule change on your return" */
  title: string;
  text: string;
}

const clock = (atLocal: string) => atLocal.slice(11, 16);
const dayOf = (atLocal: string) => atLocal.slice(0, 10);

/**
 * Mock (Manage, alert): "The airline changed flight AT557 Casablanca → Lagos to
 * depart at …. Your seat is still confirmed. If the new time doesn't work,
 * contact us about alternatives."
 */
export const scheduleAlerts = (booking: FlightBooking): ScheduleAlert[] => {
  const count = booking.offer.itineraries.length;
  return booking.scheduleChanges.flatMap((change) => {
    const index = booking.offer.itineraries.findIndex((it) => it.segments.some((s) => s.id === change.segmentId));
    if (index < 0) return [];
    const segment = booking.offer.itineraries[index].segments.find((s) => s.id === change.segmentId)!;
    const where = count === 2 ? (index === 0 ? "outbound" : "return") : count === 1 ? "flight" : `flight ${index + 1}`;
    const departDay = dayOf(change.newDepartureLocal) === dayOf(change.previousDepartureLocal) ? "" : ` on ${format(localDate(change.newDepartureLocal), "EEE d MMM")}`;
    const arriveDay = dayOf(change.newArrivalLocal) === dayOf(change.newDepartureLocal) ? "" : ` on ${format(localDate(change.newArrivalLocal), "EEE d MMM")}`;
    return [
      {
        key: `${change.segmentId}-${change.detectedAt}`,
        title: `Schedule change on your ${where}`,
        text:
          `The airline changed flight ${segment.marketing.code}${segment.marketing.number} ${segment.from.city} → ${segment.to.city} ` +
          `to depart at ${clock(change.newDepartureLocal)}${departDay} (was ${clock(change.previousDepartureLocal)}), ` +
          `landing at ${clock(change.newArrivalLocal)}${arriveDay}. ` +
          "Your seat is still confirmed. If the new time doesn't work, contact us about alternatives.",
      },
    ];
  });
};

/** Segment ids the airline has re-timed (the itinerary marks them). */
export const changedSegmentIds = (booking: FlightBooking) => new Set(booking.scheduleChanges.map((c) => c.segmentId));

/** A segment's departure and arrival with any schedule change applied. */
export const segmentTimes = (booking: FlightBooking, segment: Segment) => {
  const change = [...booking.scheduleChanges].reverse().find((c) => c.segmentId === segment.id);
  return { departLocal: change?.newDepartureLocal ?? segment.from.atLocal, arriveLocal: change?.newArrivalLocal ?? segment.to.atLocal };
};
