import type { CabinClass, CurrencyCode, FlexibleDays, FlightSearchCriteria, PassengerCounts, Place, TripType } from "../types";

// What the search form edits. Places are kept whole (for their names); the
// criteria sent to the API only carry codes.
export interface DraftLeg {
  origin: Place | null;
  destination: Place | null;
  /** YYYY-MM-DD */
  date: string | null;
  flexibleDays: FlexibleDays;
}

export interface SearchDraft {
  tripType: TripType;
  /** RETURN and ONE_WAY use legs[0]; MULTI_CITY uses 2 to 6 legs. */
  legs: DraftLeg[];
  /** RETURN only. */
  returnDate: string | null;
  returnFlexibleDays: FlexibleDays;
  passengers: PassengerCounts;
  cabin: CabinClass;
  nonStop: boolean;
  includeNearbyAirports: boolean;
}

export const FLEXIBLE_DAY_OPTIONS: { value: FlexibleDays; label: string }[] = [
  { value: 0, label: "Exact date" },
  { value: 1, label: "± 1 day" },
  { value: 2, label: "± 2 days" },
  { value: 3, label: "± 3 days" },
];

export const MAX_MULTI_CITY_LEGS = 6;
export const MIN_MULTI_CITY_LEGS = 2;
/** Amadeus counts every traveller with a seat; infants on a lap don't take one. */
export const MAX_SEATED_TRAVELLERS = 9;

export const CABINS: { value: CabinClass; label: string }[] = [
  { value: "ECONOMY", label: "Economy" },
  { value: "PREMIUM_ECONOMY", label: "Premium Economy" },
  { value: "BUSINESS", label: "Business" },
  { value: "FIRST", label: "First" },
];

export const cabinLabel = (cabin: CabinClass) => CABINS.find((c) => c.value === cabin)?.label ?? cabin;

export const emptyLeg = (): DraftLeg => ({ origin: null, destination: null, date: null, flexibleDays: 0 });

export const initialDraft = (): SearchDraft => ({
  tripType: "RETURN",
  legs: [emptyLeg()],
  returnDate: null,
  returnFlexibleDays: 0,
  passengers: { adults: 1, children: 0, heldInfants: 0, seatedInfants: 0 },
  cabin: "ECONOMY",
  nonStop: false,
  includeNearbyAirports: false,
});

/** Switching trip type keeps what the user typed wherever it still makes sense. */
export const withTripType = (draft: SearchDraft, tripType: TripType): SearchDraft => {
  if (tripType === draft.tripType) return draft;
  if (tripType === "MULTI_CITY") {
    const first = draft.legs[0] ?? emptyLeg();
    // A second leg continuing from where the first one lands
    const second: DraftLeg = { origin: first.destination, destination: null, date: draft.returnDate, flexibleDays: draft.returnFlexibleDays };
    return { ...draft, tripType, legs: draft.legs.length >= 2 ? draft.legs : [first, second], returnDate: null };
  }
  return {
    ...draft,
    tripType,
    legs: [draft.legs[0] ?? emptyLeg()],
    returnDate: tripType === "RETURN" ? draft.returnDate : null,
    returnFlexibleDays: tripType === "RETURN" ? draft.returnFlexibleDays : 0,
  };
};

export const toCriteria = (draft: SearchDraft, currency: CurrencyCode): FlightSearchCriteria => {
  const code = (place: Place | null) => place?.code ?? "";
  const first = draft.legs[0];
  const legs =
    draft.tripType === "RETURN"
      ? [
          { origin: code(first.origin), destination: code(first.destination), date: first.date ?? "", flexibleDays: first.flexibleDays },
          {
            origin: code(first.destination),
            destination: code(first.origin),
            date: draft.returnDate ?? "",
            flexibleDays: draft.returnFlexibleDays,
          },
        ]
      : (draft.tripType === "ONE_WAY" ? [first] : draft.legs).map((leg) => ({
          origin: code(leg.origin),
          destination: code(leg.destination),
          date: leg.date ?? "",
          flexibleDays: leg.flexibleDays,
        }));
  return {
    tripType: draft.tripType,
    legs,
    passengers: draft.passengers,
    cabin: draft.cabin,
    nonStop: draft.nonStop,
    includeNearbyAirports: draft.includeNearbyAirports,
    currency,
  };
};

/** Rebuilds a draft from criteria (URL, last search); `place` turns codes back into places. */
export const fromCriteria = (criteria: FlightSearchCriteria, place: (code: string) => Place | null): SearchDraft => {
  const toLeg = (leg: FlightSearchCriteria["legs"][number]): DraftLeg => ({
    origin: place(leg.origin),
    destination: place(leg.destination),
    date: leg.date || null,
    flexibleDays: leg.flexibleDays ?? 0,
  });
  return {
    tripType: criteria.tripType,
    legs: criteria.tripType === "MULTI_CITY" ? criteria.legs.map(toLeg) : [toLeg(criteria.legs[0])],
    returnDate: criteria.tripType === "RETURN" ? criteria.legs[1]?.date || null : null,
    returnFlexibleDays: criteria.tripType === "RETURN" ? criteria.legs[1]?.flexibleDays ?? 0 : 0,
    passengers: criteria.passengers,
    cabin: criteria.cabin,
    nonStop: criteria.nonStop,
    includeNearbyAirports: criteria.includeNearbyAirports ?? false,
  };
};

// ---------------------------------------------------------------- passengers

export type PassengerKey = keyof PassengerCounts;

export const seatedTravellers = (p: PassengerCounts) => p.adults + p.children + p.seatedInfants;

/** Highest value each counter can reach given the others. */
export const passengerMax = (p: PassengerCounts, key: PassengerKey) => {
  const otherSeated = seatedTravellers(p) - (key === "heldInfants" ? 0 : p[key]);
  if (key === "heldInfants") return p.adults; // one lap per adult
  return MAX_SEATED_TRAVELLERS - otherSeated;
};

export const passengerMin = (key: PassengerKey) => (key === "adults" ? 1 : 0);

/** Applies a +1/-1 and keeps the rules: lap infants never outnumber adults. */
export const stepPassengers = (p: PassengerCounts, key: PassengerKey, delta: 1 | -1): PassengerCounts => {
  const next = p[key] + delta;
  if (next < passengerMin(key) || next > passengerMax(p, key)) return p;
  const updated = { ...p, [key]: next };
  if (updated.heldInfants > updated.adults) updated.heldInfants = updated.adults;
  return updated;
};

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

export const passengersSummary = (p: PassengerCounts) => {
  const total = p.adults + p.children + p.heldInfants + p.seatedInfants;
  if (p.children + p.heldInfants + p.seatedInfants === 0) return plural(p.adults, "adult", "adults");
  return plural(total, "traveller", "travellers");
};
