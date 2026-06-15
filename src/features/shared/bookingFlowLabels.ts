export const bookingFlowLabels = {
  search: "Search",
  detail: "Detail",
  pricing: "Pricing",
  quote: "Review quote",
  hold: "Hold booking",
  confirm: "Confirm booking",
  paymentIntent: "Payment",
  paymentRedirect: "Payment handoff",
  management: "Manage booking",
} as const;

export function getPaymentRedirectCopy() {
  return "You'll be redirected to complete your secure payment";
}

export function getPaymentProviderLabel() {
  return "Secure payment";
}

export function getConfirmationStatusCopy() {
  return "Booking confirmed";
}
