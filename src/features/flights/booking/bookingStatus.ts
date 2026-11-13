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
  (booking.status === "FAILED" && booking.refund !== null && booking.refund.status !== "COMPLETED");

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

/** Mock (BookingFailed after payment): Refund started → Processing with Flutterwave → Refund completed. */
export const refundSteps = (booking: FlightBooking): ProgressStep[] => {
  const status = booking.refund?.status ?? "PENDING";
  const completed = status === "COMPLETED";
  return [
    { title: "Refund started", detail: "Automatically, the moment the booking failed.", state: "done" },
    {
      title: "Processing with Flutterwave",
      detail: "Back to your original payment method.",
      state: completed ? "done" : status === "PROCESSING" ? "now" : "next",
    },
    {
      title: "Refund completed",
      detail: completed ? "The money is on its way back to you." : "Usually within a few working days, depending on your bank.",
      state: completed ? "done" : "next",
    },
  ];
};
