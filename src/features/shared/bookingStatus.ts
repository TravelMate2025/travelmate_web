export type BookingLifecycleStatus =
  | "confirmed"
  | "completed"
  | "cancelled"
  | "payment_failed";

const CONFIRMED_STATUSES = new Set(["confirmed", "ongoing", "pending"]);
const COMPLETED_STATUSES = new Set(["completed"]);
const CANCELLED_STATUSES = new Set(["cancelled"]);
const PAYMENT_FAILED_STATUSES = new Set(["payment_failed", "failed", "expired"]);

const toDisplayLabel = (status: BookingLifecycleStatus) => {
  switch (status) {
    case "payment_failed":
      return "Payment failed";
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
};

export function getBookingLifecycleStatus(
  rawStatus?: string | null,
  _serviceDate?: string | null,
): BookingLifecycleStatus {
  const normalized = String(rawStatus ?? "").trim().toLowerCase();

  if (CANCELLED_STATUSES.has(normalized)) {
    return "cancelled";
  }
  if (PAYMENT_FAILED_STATUSES.has(normalized)) {
    return "payment_failed";
  }
  if (COMPLETED_STATUSES.has(normalized)) {
    return "completed";
  }

  if (CONFIRMED_STATUSES.has(normalized)) {
    return "confirmed";
  }

  return "confirmed";
}

export function getBookingLifecycleLabel(
  rawStatus?: string | null,
  serviceDate?: string | null,
) {
  return toDisplayLabel(getBookingLifecycleStatus(rawStatus, serviceDate));
}

export function isBookingCancelable(
  rawStatus?: string | null,
  serviceDate?: string | null,
) {
  return getBookingLifecycleStatus(rawStatus, serviceDate) === "confirmed";
}

export function isBookingReviewable(
  rawStatus?: string | null,
  serviceDate?: string | null,
) {
  return getBookingLifecycleStatus(rawStatus, serviceDate) === "completed";
}
