import { PassengerCounts } from "../types/booking";
import { PriceRange } from "../types/booking";
import format from "date-fns/format";

export const formatPassengerCount = (counts: PassengerCounts): string => {
  const { adults, children, infant } = counts;
  const parts: string[] = [];

  if (adults > 0) parts.push(`${adults} adult${adults > 1 ? "s" : ""}`);
  if (children > 0) parts.push(`${children} child${children > 1 ? "ren" : ""}`);
  if (infant > 0) parts.push(`${infant} infant${infant > 1 ? "s" : ""}`);

  return parts.length > 0 ? parts.join(", ") : "Select Passengers";
};

export const formatPriceRange = (priceRange: PriceRange): string => {
  const { min, max } = priceRange;
  if (min === 0 && max === 0) {
    return "Select Price Range";
  }
  return `₦${new Intl.NumberFormat().format(min)} - ₦${new Intl.NumberFormat().format(max)}`;
};

export const formatDate = (date: Date): string => format(date, "dd MMM yyyy");
export const formatApiDate = (date: Date): string => format(date, "yyyy-MM-dd");

