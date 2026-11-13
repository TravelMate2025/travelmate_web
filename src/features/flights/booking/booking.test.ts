import { describe, expect, it } from "vitest";
import searchesFixture from "../mocks/fixtures/searches.json";
import type { FlightBooking, FlightOffer } from "../types";
import { bookingCalendar } from "./calendar";
import { bookingSteps, refundSteps, shouldPoll, statusView } from "./bookingStatus";

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
      refund: { status: "PROCESSING", amount: { amount: "787.70", currency: "USD" }, startedAt: "2026-11-13T10:01:00Z", completedAt: null },
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
