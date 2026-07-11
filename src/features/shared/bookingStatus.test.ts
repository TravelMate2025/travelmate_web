import { describe, expect, it } from "vitest";
import {
  getBookingLifecycleLabel,
  getBookingLifecycleStatus,
  isBookingCancelable,
  isBookingReviewable,
} from "./bookingStatus";

describe("bookingStatus", () => {
  it("normalizes backend booking states into the public contract", () => {
    expect(getBookingLifecycleStatus("confirmed")).toBe("confirmed");
    expect(getBookingLifecycleStatus("pending")).toBe("confirmed");
    expect(getBookingLifecycleStatus("ongoing")).toBe("confirmed");
    expect(getBookingLifecycleStatus("completed")).toBe("completed");
    expect(getBookingLifecycleStatus("cancelled")).toBe("cancelled");
    expect(getBookingLifecycleStatus("payment_failed")).toBe("payment_failed");
    expect(getBookingLifecycleStatus("failed")).toBe("payment_failed");
  });

  it("does not infer completion from the service date", () => {
    expect(getBookingLifecycleStatus("confirmed", "2000-01-01")).toBe("confirmed");
    expect(getBookingLifecycleStatus("pending", "2000-01-01")).toBe("confirmed");
  });

  it("exposes the public-facing status labels", () => {
    expect(getBookingLifecycleLabel("confirmed")).toBe("Confirmed");
    expect(getBookingLifecycleLabel("completed")).toBe("Completed");
    expect(getBookingLifecycleLabel("cancelled")).toBe("Cancelled");
    expect(getBookingLifecycleLabel("payment_failed")).toBe("Payment failed");
  });

  it("derives action eligibility from the lifecycle state", () => {
    expect(isBookingCancelable("confirmed")).toBe(true);
    expect(isBookingCancelable("completed")).toBe(false);
    expect(isBookingReviewable("completed")).toBe(true);
    expect(isBookingReviewable("confirmed")).toBe(false);
  });
});
