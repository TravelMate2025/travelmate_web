import { describe, expect, it } from "vitest";
import type { NormalizedBooking } from "../../pages/Bookings";
import { formatBookingAmount, getBookingCurrency } from "./utils";

const booking = (overrides: Partial<NormalizedBooking> = {}): NormalizedBooking =>
  ({
    id: "1",
    type: "stay",
    reference: "BK-001",
    status: "ongoing",
    name: "Test Booking",
    date: "2026-07-07",
    date_to: "2026-07-08",
    amount: 15000,
    currency: "NGN",
    originalData: {},
    session_id: "session-1",
    ...overrides,
  }) as NormalizedBooking;

describe("booking tab currency helpers", () => {
  it("rejects placeholder currency codes", () => {
    const value = getBookingCurrency(
      booking({ currency: "N/A", originalData: { currency: "n/a" } }),
      "NGN",
    );

    expect(value).toBe("NGN");
  });

  it("formats booking amounts without throwing on placeholder currencies", () => {
    const formatted = formatBookingAmount(
      booking({ currency: "N/A", originalData: { currency: "N/A" } }),
      "NGN",
    );

    expect(formatted).toContain("15,000");
  });
});
