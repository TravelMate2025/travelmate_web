import { describe, expect, it } from "vitest";
import searchesFixture from "../mocks/fixtures/searches.json";
import type { FlightBooking, FlightOffer } from "../types";
import { bookingCalendar } from "./calendar";
import { bookingSteps, refundSteps, shouldPoll, statusView } from "./bookingStatus";
import { itineraryLines } from "./itineraryPdf";
import { canCancel, cancelCopy, fareLines, routeName, statusBadge, toBookingRow, travellersText, tripDates } from "./manage";

const offer = (searchesFixture as unknown as Record<string, { offers: FlightOffer[] }>).return_los_lon.offers[0];
const booking = (patch: Partial<FlightBooking> = {}): FlightBooking => ({
  id: "bk-1",
  reference: "TM-FL-ABC123",
  pnr: "YVR755",
  status: "TICKETING",
  offer,
  travelers: [{ travelerId: "1", type: "ADULT", firstName: "ADAEZE", lastName: "OKAFOR", ticketNumber: null }],
  contact: { email: "adaeze@example.com", phoneCountryCode: "+234", phoneNumber: "8012345678" },
  bags: [],
  total: { amount: "787.70", currency: "USD" },
  payable: [],
  priceChange: null,
  holdExpiresAt: null,
  payment: { status: "PAID", paidAt: "2026-11-13T10:00:00Z", amount: { amount: "787.70", currency: "USD" } },
  failure: null,
  refund: null,
  scheduleChanges: [],
  createdAt: "2026-11-13T09:58:00Z",
  ...patch,
});

describe("booking status", () => {
  it("follows the mock's four steps while the ticket is issued", () => {
    expect(statusView(booking())).toBe("issuing");
    expect(bookingSteps(booking()).map((s) => `${s.state}: ${s.title}`)).toEqual([
      "done: Payment received",
      "done: Booked with the airline",
      "now: Issuing your ticket",
      "next: E-ticket sent to your email",
    ]);
    expect(bookingSteps(booking())[1].detail).toBe("Your seats are confirmed on all 4 flights.");
    expect(shouldPoll(booking())).toBe(true);
  });

  it("is all done once ticketed, and stops asking", () => {
    const ticketed = booking({ status: "TICKETED" });
    expect(statusView(ticketed)).toBe("ticketed");
    expect(bookingSteps(ticketed).every((s) => s.state === "done")).toBe(true);
    expect(bookingSteps(ticketed)[3].detail).toBe("Sent to adaeze@example.com.");
    expect(shouldPoll(ticketed)).toBe(false);
  });

  it("waits for the payment webhook after returning from Flutterwave", () => {
    const pending = booking({ status: "HELD", payment: { status: "PENDING", paidAt: null, amount: { amount: "787.70", currency: "USD" } } });
    expect(statusView(pending)).toBe("confirming-payment");
    expect(shouldPoll(pending)).toBe(true);
    expect(statusView(booking({ status: "HELD", payment: null }))).toBe("unpaid");
  });

  it("tracks the automatic refund when the booking fails after payment", () => {
    const failed = booking({
      status: "FAILED",
      failure: { stage: "AFTER_PAYMENT", reason: "Not confirmed" },
      refund: { status: "PROCESSING", amount: { amount: "787.70", currency: "USD" }, airlineConfirmed: null, startedAt: "2026-11-13T10:01:00Z", completedAt: null },
    });
    expect(statusView(failed)).toBe("failed-after-payment");
    expect(refundSteps(failed).map((s) => s.state)).toEqual(["done", "now", "next"]);
    expect(shouldPoll(failed)).toBe(true);
    const refunded = { ...failed, refund: { ...failed.refund!, status: "COMPLETED" as const, completedAt: "2026-11-15T10:00:00Z" } };
    expect(refundSteps(refunded).map((s) => s.state)).toEqual(["done", "done", "done"]);
    expect(shouldPoll(refunded)).toBe(false);
  });
});

describe("calendar", () => {
  it("adds one event per flight at local airport times", () => {
    const ics = bookingCalendar(booking(), new Date("2026-11-13T10:00:00Z"));
    expect(ics.match(/BEGIN:VEVENT/g)).toHaveLength(4);
    expect(ics).toContain("DTSTART:20261215T190500");
    expect(ics).toContain("SUMMARY:Flight AT556 LOS → CMN");
    expect(ics).toContain("Airline reference: YVR755");
    expect(ics.startsWith("BEGIN:VCALENDAR")).toBe(true);
  });
});

describe("my bookings and manage", () => {
  it("names the trip like the mock's Manage header", () => {
    expect(routeName(offer)).toBe("Lagos ⇄ London");
    expect(tripDates(offer)).toBe("15 – 29 Dec 2026");
    expect(travellersText(booking())).toBe("1 adult");
    expect(
      travellersText(
        booking({
          travelers: [
            { travelerId: "1", type: "ADULT", firstName: "A", lastName: "B", ticketNumber: null },
            { travelerId: "2", type: "ADULT", firstName: "C", lastName: "B", ticketNumber: null },
            { travelerId: "3", type: "HELD_INFANT", firstName: "D", lastName: "B", ticketNumber: null },
          ],
        })
      )
    ).toBe("2 adults, 1 infant on lap");
  });

  it("badges each state, and only paid bookings can be cancelled", () => {
    expect(statusBadge(booking())).toEqual({ text: "Booked · ticket being issued", tone: "blue" });
    expect(statusBadge(booking({ status: "TICKETED" }))).toEqual({ text: "Ticketed", tone: "green" });
    expect(statusBadge(booking({ status: "CANCELLED", refund: { status: "PROCESSING", amount: { amount: "787.70", currency: "USD" }, airlineConfirmed: null, startedAt: "", completedAt: null } })).text).toBe(
      "Cancelled · refund in progress"
    );
    expect(statusBadge(booking({ status: "HOLD_EXPIRED", payment: null })).text).toBe("Seats released");
    expect(canCancel(booking())).toBe(true);
    expect(canCancel(booking({ status: "TICKETED" }))).toBe(true);
    expect(canCancel(booking({ status: "CANCELLED" }))).toBe(false);
  });

  it("files bookings under the shared My bookings tabs", () => {
    const now = Date.parse("2026-11-13T12:00:00Z");
    const row = toBookingRow(booking(), now);
    expect(row).toMatchObject({ status: "confirmed", name: "Lagos ⇄ London", amount: 787.7, currency: "USD", detailsPath: "/flights/bookings/bk-1" });
    expect(row.cancelPath).toBe("/flights/bookings/bk-1?cancel=1");
    expect(toBookingRow(booking({ status: "TICKETED" }), Date.parse("2027-01-15T00:00:00Z")).status).toBe("completed");
    expect(toBookingRow(booking({ status: "CANCELLED" }), now).cancelPath).toBeNull();
    expect(toBookingRow(booking({ status: "FAILED", failure: { stage: "AFTER_PAYMENT", reason: "" } }), now).status).toBe("cancelled");
    expect(toBookingRow(booking({ status: "HOLD_EXPIRED" }), now).status).toBe("expired");
  });

  it("summarises the fare like the mock's aside", () => {
    expect(fareLines(offer)).toEqual([
      { label: "Refunds", value: "Not refundable" },
      { label: "Changes", value: "For a fee" },
      // The recorded fare gives quantities but no weights
      { label: "Checked bags", value: "1 bag" },
      { label: "Cabin bag", value: "1 bag" },
    ]);
    const weighed = { ...offer, baggage: { checked: { quantity: 1, weightKg: 23 }, cabin: { quantity: 1, weightKg: 10 } } };
    expect(fareLines(weighed).slice(2).map((l) => l.value)).toEqual(["1 × 23 kg", "1 × 10 kg"]);
  });

  it("puts references, tickets and every flight in the itinerary PDF", () => {
    const lines = itineraryLines(booking({ status: "TICKETED", travelers: [{ travelerId: "1", type: "ADULT", firstName: "ADAEZE", lastName: "OKAFOR", ticketNumber: "147-2400000000" }] })).map((l) => l.text);
    expect(lines).toContain("TravelMate booking: TM-FL-ABC123");
    expect(lines).toContain("Airline reference (Royal Air Maroc): YVR755");
    expect(lines).toContain("Adaeze Okafor · E-ticket 147-2400000000");
    expect(lines.filter((l) => /^AT\d+ · /.test(l))).toHaveLength(4);
  });
});

describe("cancelling after the ticket is issued", () => {
  const usd = (amount: string) => ({ amount, currency: "USD" as const });

  it("words the full refund, the void and the airline refund like the mock", () => {
    const full = cancelCopy({ kind: "FULL_REFUND", paid: usd("787.70"), deduction: usd("0.00"), refund: usd("787.70"), requiresAirlineConfirmation: false });
    expect([full.refundLabel, full.refundValue, full.cta]).toEqual(["You get back", "$787.70", "Cancel and get full refund"]);

    const voided = cancelCopy({ kind: "VOID", paid: usd("787.70"), deduction: usd("0.00"), refund: usd("787.70"), requiresAirlineConfirmation: false });
    expect(voided.intro).toMatch(/void it/);
    expect(voided.steps[0]).toBe("We void your ticket with the airline straight away.");

    // The recorded Eco Essential fare: base $182.00 kept, taxes $605.70 may come back
    const airline = cancelCopy({ kind: "AIRLINE_REFUND", paid: usd("787.70"), deduction: usd("182.00"), refund: usd("605.70"), requiresAirlineConfirmation: true });
    expect(airline.lines).toEqual([
      { label: "You paid", value: "$787.70" },
      { label: "Not refundable (fare)", value: "$182.00" },
    ]);
    expect([airline.refundLabel, airline.refundValue, airline.cta]).toEqual(["Estimated refund (taxes)", "$605.70", "Request cancellation"]);

    const refundable = cancelCopy({ kind: "AIRLINE_REFUND", paid: usd("945.20"), deduction: null, refund: null, requiresAirlineConfirmation: true });
    expect(refundable.lines[1]).toEqual({ label: "Airline fee", value: "To be confirmed" });
    expect(refundable.refundValue).toBe("To be confirmed");
  });

  it("follows the airline's confirmation, then the refund", () => {
    const waiting = booking({
      status: "CANCELLATION_REQUESTED",
      refund: { status: "PENDING", amount: usd("605.70"), airlineConfirmed: false, startedAt: "2026-11-13T11:00:00Z", completedAt: null },
    });
    expect(refundSteps(waiting).map((s) => `${s.state}: ${s.title}`)).toEqual([
      "done: Cancellation sent to the airline",
      "now: Airline confirms the refundable amount",
      "next: Processing with Flutterwave",
      "next: Refund completed",
    ]);
    expect(shouldPoll(waiting)).toBe(true);
    expect(statusBadge(waiting).text).toBe("Cancellation requested");

    const confirmed = booking({ status: "CANCELLED", refund: { ...waiting.refund!, status: "PROCESSING", airlineConfirmed: true } });
    expect(refundSteps(confirmed).map((s) => s.state)).toEqual(["done", "done", "now", "next"]);
    const settled = booking({ status: "CANCELLED", refund: { ...waiting.refund!, status: "COMPLETED", airlineConfirmed: true, completedAt: "2026-11-14T00:00:00Z" } });
    expect(shouldPoll(settled)).toBe(false);
    expect(statusBadge(settled).text).toBe("Cancelled · refunded");
  });
});
