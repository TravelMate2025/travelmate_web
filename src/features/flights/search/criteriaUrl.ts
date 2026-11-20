import { SELLING_CURRENCIES, type CabinClass, type CurrencyCode, type FlexibleDays, type FlightSearchCriteria, type TripType } from "../types";
import { CABINS, MAX_MULTI_CITY_LEGS } from "./searchDraft";

// Search criteria <-> results URL, so results can be shared and reloaded:
// /flights/results?trip=RETURN&legs=LOS.LON.2026-12-15.3_LON.LOS.2026-12-28&adults=1&cabin=ECONOMY&currency=USD
// (a 4th leg part is the ± days, left out when 0)

const TRIP_TYPES: TripType[] = ["RETURN", "ONE_WAY", "MULTI_CITY"];
const CODE = /^[A-Z]{3}$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

export const criteriaToQuery = (c: FlightSearchCriteria): Record<string, string | number | undefined> => ({
  trip: c.tripType,
  legs: c.legs.map((l) => [l.origin, l.destination, l.date, ...(l.flexibleDays ? [l.flexibleDays] : [])].join(".")).join("_"),
  adults: c.passengers.adults,
  children: c.passengers.children || undefined,
  lapInfants: c.passengers.heldInfants || undefined,
  seatInfants: c.passengers.seatedInfants || undefined,
  cabin: c.cabin,
  direct: c.nonStop ? 1 : undefined,
  nearby: c.includeNearbyAirports ? 1 : undefined,
  currency: c.currency,
});

const count = (params: URLSearchParams, key: string, fallback: number) => {
  const raw = params.get(key);
  if (raw === null) return fallback;
  const n = Number(raw);
  return Number.isInteger(n) && n >= 0 && n <= 9 ? n : null;
};

/** Null when the URL doesn't describe a usable search (edited by hand, truncated). */
export const criteriaFromQuery = (params: URLSearchParams, fallbackCurrency: CurrencyCode): FlightSearchCriteria | null => {
  const tripType = params.get("trip") as TripType | null;
  if (!tripType || !TRIP_TYPES.includes(tripType)) return null;

  const legs = (params.get("legs") ?? "").split("_").map((part) => {
    const [origin, destination, date, flex] = part.split(".");
    const flexibleDays = Number(flex ?? 0);
    return {
      origin: origin?.toUpperCase() ?? "",
      destination: destination?.toUpperCase() ?? "",
      date: date ?? "",
      flexibleDays: (Number.isInteger(flexibleDays) && flexibleDays >= 0 && flexibleDays <= 3 ? flexibleDays : -1) as FlexibleDays,
    };
  });
  if (legs.some((l) => !CODE.test(l.origin) || !CODE.test(l.destination) || !DATE.test(l.date) || l.flexibleDays < 0)) return null;
  const expectedLegs = tripType === "RETURN" ? legs.length === 2 : tripType === "ONE_WAY" ? legs.length === 1 : legs.length >= 2 && legs.length <= MAX_MULTI_CITY_LEGS;
  if (!expectedLegs) return null;

  const adults = count(params, "adults", 1);
  const children = count(params, "children", 0);
  const heldInfants = count(params, "lapInfants", 0);
  const seatedInfants = count(params, "seatInfants", 0);
  if (adults === null || children === null || heldInfants === null || seatedInfants === null || adults < 1) return null;

  const cabinParam = params.get("cabin") ?? "ECONOMY";
  const cabin = CABINS.some((c) => c.value === cabinParam) ? (cabinParam as CabinClass) : null;
  if (!cabin) return null;

  const currencyParam = params.get("currency");
  const currency = SELLING_CURRENCIES.includes(currencyParam as CurrencyCode) ? (currencyParam as CurrencyCode) : fallbackCurrency;

  return {
    tripType,
    legs,
    passengers: { adults, children, heldInfants, seatedInfants },
    cabin,
    nonStop: params.get("direct") === "1",
    includeNearbyAirports: params.get("nearby") === "1",
    currency,
  };
};
