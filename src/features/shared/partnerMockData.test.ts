import { describe, expect, it } from "vitest";
import {
  mockTransferBookingBySession,
  mockTransferCheckoutSession,
  mockTransferSearchResults,
} from "./partnerMockData";

describe("partnerMockData", () => {
  it("exposes transfer fixtures for airport taxi flows", () => {
    expect(mockTransferSearchResults()).toHaveLength(1);
    expect(mockTransferSearchResults()[0].vehicle.name).toBe("Toyota Hiace");
  });

  it("exposes transfer booking and checkout fixtures", () => {
    expect(mockTransferBookingBySession().data.bookings).toHaveLength(1);
    expect(mockTransferCheckoutSession().success).toBe(true);
  });
});
