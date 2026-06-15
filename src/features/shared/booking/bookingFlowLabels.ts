export type StayFlowType = "unit_level" | "room_level";

export const stayFlowTypeLabel = (flowType: StayFlowType) =>
  flowType === "unit_level" ? "Unit stay" : "Room stay";

export const stayRequiresRoomSelection = (flowType: StayFlowType) =>
  flowType === "room_level";

export const bookingReviewLabel = () => "Booking review";
export const guestDetailsLabel = () => "Guest details";
export const bookingConfirmationLabel = () => "Booking confirmation";
export const bookingManagementLabel = () => "Booking management";
export const continueToPaymentLabel = () => "Continue to payment";
export const transferReviewLabel = () => "Transfer review";
export const staySearchLabel = () => "Stay search";
export const stayResultsLabel = () => "Stay results";
export const stayDetailsLabel = () => "Stay details";
export const pricingSourceLabel = () => "Pricing source";
export const partnerPricingSourceCopy = () => "Loaded from the partner pricing endpoint before checkout.";

export const stayTypeDisplayLabel = (accommodationType?: string | null) => {
  const normalized = accommodationType?.toLowerCase().trim() ?? "";
  if (normalized.includes("room")) return "Room stay";
  if (
    normalized.includes("unit") ||
    normalized.includes("apartment") ||
    normalized.includes("villa") ||
    normalized.includes("home")
  ) {
    return "Unit stay";
  }
  return "Stay";
};

export const propertyTypeDisplayLabel = (propertyType?: string | null) => {
  const normalized = propertyType?.toLowerCase().trim() ?? "";
  const map: Record<string, string> = {
    apartment: "Apartment",
    hotel: "Hotel",
    guesthouse: "Guesthouse",
    villa: "Villa",
    hostel: "Hostel",
    resort: "Resort",
    motel: "Motel",
    bungalow: "Bungalow",
  };
  return map[normalized] ?? (propertyType ? propertyType.charAt(0).toUpperCase() + propertyType.slice(1) : null);
};
