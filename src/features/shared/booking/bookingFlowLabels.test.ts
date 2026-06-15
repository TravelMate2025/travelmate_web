import { describe, expect, it } from "vitest";
import {
  bookingConfirmationLabel,
  bookingManagementLabel,
  bookingReviewLabel,
  continueToPaymentLabel,
  guestDetailsLabel,
  partnerPricingSourceCopy,
  pricingSourceLabel,
  stayDetailsLabel,
  stayFlowTypeLabel,
  stayResultsLabel,
  staySearchLabel,
  stayRequiresRoomSelection,
  stayTypeDisplayLabel,
  transferReviewLabel,
} from "./bookingFlowLabels";

describe("bookingFlowLabels", () => {
  it("labels the two stay types", () => {
    expect(stayFlowTypeLabel("unit_level")).toBe("Unit stay");
    expect(stayFlowTypeLabel("room_level")).toBe("Room stay");
    expect(stayRequiresRoomSelection("unit_level")).toBe(false);
    expect(stayRequiresRoomSelection("room_level")).toBe(true);
  });

  it("keeps OTA labels consistent", () => {
    expect(bookingReviewLabel()).toBe("Booking review");
    expect(bookingConfirmationLabel()).toBe("Booking confirmation");
    expect(bookingManagementLabel()).toBe("Booking management");
    expect(continueToPaymentLabel()).toBe("Continue to payment");
    expect(guestDetailsLabel()).toBe("Guest details");
    expect(pricingSourceLabel()).toBe("Pricing source");
    expect(partnerPricingSourceCopy()).toBe(
      "Loaded from the partner pricing endpoint before checkout."
    );
    expect(transferReviewLabel()).toBe("Transfer review");
    expect(staySearchLabel()).toBe("Stay search");
    expect(stayResultsLabel()).toBe("Stay results");
    expect(stayDetailsLabel()).toBe("Stay details");
    expect(stayTypeDisplayLabel("room_level")).toBe("Room stay");
    expect(stayTypeDisplayLabel("unit_level")).toBe("Unit stay");
    expect(stayTypeDisplayLabel(undefined)).toBe("Stay");
  });
});
