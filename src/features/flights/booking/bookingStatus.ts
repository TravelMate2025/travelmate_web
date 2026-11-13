import type { FlightBooking } from "../types";

// The booking status page (mock: Status, BookingFailed after payment): which
// screen to show and the progress steps, derived from the booking.

export type StatusView =
  | "confirming-payment" // back from Flutterwave, webhook not in yet
  | "issuing" // paid; booked with the airline; ticket on the way
  | "ticketed"
  | "failed-after-payment"
  | "unpaid" // still held, not paid: belongs on Review and pay
  | "expired"
  | "cancelled";

export const statusView = (booking: FlightBooking): StatusView => {
  switch (booking.status) {
    case "HELD":
      return booking.payment?.status === "PENDING" ? "confirming-payment" : "unpaid";
    case "PAID":
    case "TICKETING":
      return "issuing";
    case "TICKETED":
      return "ticketed";
    case "FAILED":
      return "failed-after-payment";
    case "HOLD_EXPIRED":
      return "expired";
    case "CANCELLATION_REQUESTED":
    case "CANCELLED":
      return "cancelled";
  }
};

/** Keep asking the server while something is still changing. */
export const shouldPoll = (booking: FlightBooking | null) =>
  !booking ||
  ["PAID", "TICKETING"].includes(booking.status) ||
  (booking.status === "HELD" && booking.payment?.status === "PENDING") ||
  // A refund on its way (failed after payment, or cancelled): follow it until it settles
  (["FAILED", "CANCELLATION_REQUESTED", "CANCELLED"].includes(booking.status) &&
    booking.refund !== null &&
    booking.refund.status !== "COMPLETED" &&
    booking.refund.status !== "FAILED");

export type StepState = "done" | "now" | "next";
export interface ProgressStep {
  title: string;
  detail: string;
  state: StepState;
}

const flightCount = (booking: FlightBooking) => booking.offer.itineraries.reduce((n, it) => n + it.segments.length, 0);

/** Mock: Payment received → Booked with the airline → Issuing your ticket → E-ticket sent. */
export const bookingSteps = (booking: FlightBooking): ProgressStep[] => {
  const view = statusView(booking);
  const paid = view === "issuing" || view === "ticketed";
  const ticketed = view === "ticketed";
  const flights = flightCount(booking);
  return [
    paid
      ? { title: "Payment received", detail: "Flutterwave confirmed your payment.", state: "done" }
      : { title: "Confirming your payment", detail: "This usually takes a few seconds.", state: "now" },
    paid
      ? {
          title: "Booked with the airline",
          detail: `Your seats are confirmed on ${flights === 1 ? "your flight" : `all ${flights} flights`}.`,
          state: "done",
        }
      : { title: "Booked with the airline", detail: "Your seats are held while payment is confirmed.", state: "next" },
    ticketed
      ? { title: "Ticket issued", detail: "Your e-ticket number is below.", state: "done" }
      : {
          title: "Issuing your ticket",
          detail: "Usually takes a few minutes. You can leave this page; we’ll email you.",
          state: paid ? "now" : "next",
        },
    ticketed
      ? { title: "E-ticket sent", detail: `Sent to ${booking.contact.email}.`, state: "done" }
      : { title: "E-ticket sent to your email", detail: "After the ticket is issued.", state: "next" },
  ];
};

/**
 * Mock (BookingFailed after payment, Manage): Refund started → Processing with
 * Flutterwave → Refund completed. Cancelling a ticket outside the void window
 * adds the airline step (mock Manage "After ticket issued").
 */
export const refundSteps = (booking: FlightBooking): ProgressStep[] => {
  const refund = booking.refund;
  const status = refund?.status ?? "PENDING";
  const completed = status === "COMPLETED";
  const processing: ProgressStep = {
    title: "Processing with Flutterwave",
    detail: "Back to your original payment method.",
    state: completed ? "done" : status === "PROCESSING" ? "now" : "next",
  };
  const done: ProgressStep = {
    title: "Refund completed",
    detail: completed ? "The money is on its way back to you." : "Usually within a few working days, depending on your bank.",
    state: completed ? "done" : "next",
  };
  if (refund?.airlineConfirmed != null) {
    const confirmed = refund.airlineConfirmed;
    return [
      { title: "Cancellation sent to the airline", detail: "We’ve asked the airline to cancel your ticket.", state: "done" },
      {
        title: confirmed ? "Airline confirmed the refund" : "Airline confirms the refundable amount",
        detail: confirmed ? "We refund the confirmed amount and email you." : "This can take several days. We’ll email you.",
        state: confirmed ? "done" : "now",
      },
      processing,
      done,
    ];
  }
  return [
    {
      title: "Refund started",
      detail: booking.status === "FAILED" ? "Automatically, the moment the booking failed." : "When you cancelled.",
      state: "done",
    },
    processing,
    done,
  ];
};
