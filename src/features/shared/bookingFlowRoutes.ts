export const bookingFlowRoutes = {
  staySearch: "/stay-search",
  stayResults: "/stay-results",
  stayDetail: "/stay-details",
  stayBookingReview: "/booking-review",
  stayGuestDetails: "/booking-guest-details",
  stayPayment: "/booking-payment",
  stayHoldSummary: "/stay-hold-summary",
  stayConfirmation: "/booking-confirmation",
  transferBookingReview: "/transfer-review",
  transferGuestDetails: "/transfer-guest-details",
  transferConfirmation: "/transfer-confirmation",
} as const;

export const legacyBookingFlowRoutes = {
  staySearch: "/stays-search-result",
  stayResults: "/stays-search-result",
  stayDetail: "/stays-detail",
  stayBookingReview: "/booking-progress",
  stayGuestDetails: "/booking-progress",
  stayPayment: "/booking-progress",
  stayConfirmation: "/booking/success",
  transferBookingReview: "/cars-searchResults",
  transferGuestDetails: "/cars-searchResults",
  transferConfirmation: "/car-confirmation",
} as const;
