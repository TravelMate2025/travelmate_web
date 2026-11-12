export const bookingFlowRoutes = {
  staySearch: "/stay-search",
  stayResults: "/stay-results",
  stayDetail: "/stay-details",
  stayBookingReview: "/booking-review",
  stayConfirmation: "/booking-confirmation",
  stayDownload: "/stays-paid/download",
  transferResults: "/cars-searchResults",
  transferDetail: "/transfer-details",
  transferBookingReview: "/transfer-review",
  transferGuestDetails: "/transfer-guest-details",
  // Payment providers redirect back to these, so their paths must not change
  transferPaymentSuccess: "/transfers/payment-success",
  transferPaymentFailure: "/transfers/payment-failure",
  transferDownload: "/car-paid/download",
  flightResults: "/flights/results",
  flightFare: "/flights/fare",
  flightTravellers: "/flights/travellers",
  flightExtras: "/flights/extras",
  flightReviewAndPay: "/flights/review",
  // Flutterwave redirects back here, so the path must not change
  flightPaymentReturn: "/flights/payment-return",
  flightBookingStatus: "/flights/bookings/:bookingId/status",
  flightBookingManage: "/flights/bookings/:bookingId",
} as const;

type QueryValue = string | number | boolean | null | undefined;

// Appends an encoded query string; null/undefined values are left out
export const withQuery = (path: string, params: Record<string, QueryValue>) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) query.set(key, String(value));
  });
  const queryString = query.toString();
  return queryString ? `${path}?${queryString}` : path;
};

export const stayDetailPath = (stayId: string | number, params: Record<string, QueryValue> = {}) =>
  withQuery(`${bookingFlowRoutes.stayDetail}/${encodeURIComponent(stayId)}`, params);

export const stayResultsPath = (params: Record<string, QueryValue>) =>
  withQuery(bookingFlowRoutes.stayResults, params);

export const transferResultsPath = (params: Record<string, QueryValue>) =>
  withQuery(bookingFlowRoutes.transferResults, params);

export const flightResultsPath = (params: Record<string, QueryValue>) =>
  withQuery(bookingFlowRoutes.flightResults, params);

// Offer tokens are opaque and may contain any character, so they travel as a query value
export const flightStepPath = (
  step: "flightFare" | "flightTravellers" | "flightExtras" | "flightReviewAndPay",
  offerToken: string
) => withQuery(bookingFlowRoutes[step], { offer: offerToken });

const withBookingId = (pattern: string, bookingId: string) =>
  pattern.replace(":bookingId", encodeURIComponent(bookingId));

export const flightBookingStatusPath = (bookingId: string) =>
  withBookingId(bookingFlowRoutes.flightBookingStatus, bookingId);

export const flightBookingManagePath = (bookingId: string) =>
  withBookingId(bookingFlowRoutes.flightBookingManage, bookingId);

// The download pages read the booking back from the `data` query param
export const stayDownloadPath = (booking: unknown) =>
  withQuery(bookingFlowRoutes.stayDownload, { data: JSON.stringify(booking) });

export const transferDownloadPath = (booking: unknown) =>
  withQuery(bookingFlowRoutes.transferDownload, { data: JSON.stringify(booking) });
