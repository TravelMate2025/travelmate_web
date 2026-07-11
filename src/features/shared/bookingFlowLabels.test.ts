import { describe, expect, it } from "vitest";
import {
  bookingFlowLabels,
  getPaymentProviderLabel,
  getPaymentRedirectCopy,
  getConfirmationStatusCopy,
} from "./bookingFlowLabels";

describe("bookingFlowLabels", () => {
  it("keeps the shared OTA naming consistent", () => {
    expect(bookingFlowLabels.search).toBe("Search");
    expect(bookingFlowLabels.detail).toBe("Detail");
    expect(bookingFlowLabels.pricing).toBe("Pricing");
    expect(bookingFlowLabels.quote).toBe("Review quote");
    expect(bookingFlowLabels.hold).toBe("Hold booking");
    expect(bookingFlowLabels.confirm).toBe("Confirm booking");
    expect(bookingFlowLabels.paymentRedirect).toBe("Payment handoff");
    expect(bookingFlowLabels.management).toBe("Manage booking");
  });

  it("uses provider-neutral payment copy", () => {
    expect(getPaymentProviderLabel()).toBe("Secure payment");
    expect(getPaymentRedirectCopy()).toBe("You'll be redirected to complete your secure payment");
    expect(getConfirmationStatusCopy()).toBe("Booking confirmed");
  });
});
