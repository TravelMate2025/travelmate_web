import { format } from "date-fns";
import type { FlightSearchCriteria } from "../types";
import { cabinLabel, passengersSummary } from "./searchDraft";

const toDate = (value: string) => {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const shortDate = (value: string) => format(toDate(value), "EEE d MMM");

/** "15 – 28 Dec", "One-way · Tue 15 Dec", "3 flights · from Tue 15 Dec" */
export const datesSummary = (criteria: FlightSearchCriteria) => {
  const [first, second] = criteria.legs;
  if (criteria.tripType === "RETURN" && second) {
    const a = toDate(first.date);
    const b = toDate(second.date);
    return a.getMonth() === b.getMonth() ? `${format(a, "d")} – ${format(b, "d MMM")}` : `${format(a, "d MMM")} – ${format(b, "d MMM")}`;
  }
  if (criteria.tripType === "ONE_WAY") return `One-way · ${shortDate(first.date)}`;
  return `${criteria.legs.length} flights · from ${shortDate(first.date)}`;
};

/** "15 – 28 Dec · 1 adult · Economy" (the mock's recent-search line) */
export const searchSubtitle = (criteria: FlightSearchCriteria) =>
  `${datesSummary(criteria)} · ${passengersSummary(criteria.passengers)} · ${cabinLabel(criteria.cabin)}`;
