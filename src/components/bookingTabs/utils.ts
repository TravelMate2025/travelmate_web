import type { NormalizedBooking } from "../../pages/Bookings";

const toText = (value: unknown, fallback = ""): string => {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return fallback;
};

const toNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
};

export const getBookingImage = (booking: NormalizedBooking) => {
  return booking.imageUrl ?? "";
};

export const getBookingName = (booking: NormalizedBooking, fallback: string) => {
  return booking.name || fallback;
};

export const getBookingDateText = (booking: NormalizedBooking) => {
  const start =
    booking.date ||
    toText(booking.originalData?.check_in) ||
    toText(booking.originalData?.pickup_date);
  const end =
    booking.date_to ||
    toText(booking.originalData?.check_out) ||
    toText(booking.originalData?.dropoff_date);

  if (!start) {
    return "Date N/A";
  }

  if (start && end) {
    return `${new Date(start).toDateString()} - ${new Date(end).toDateString()}`;
  }

  return new Date(start).toDateString();
};

export const getBookingAmount = (booking: NormalizedBooking) => {
  return booking.amount || toNumber(booking.originalData?.total_price) || toNumber(booking.originalData?.total_amount);
};

export const getBookingCurrency = (booking: NormalizedBooking, fallback: string) => {
  return booking.currency || toText(booking.originalData?.currency) || fallback;
};
