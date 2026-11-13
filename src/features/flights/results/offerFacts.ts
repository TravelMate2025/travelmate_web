import { format } from "date-fns";
import type { FlightOffer, FlightSearchCriteria, Itinerary, Place } from "../types";

// What the results page needs to know about an offer, derived once from the
// v2 contract. Pure functions, so sorting, filters and card notes are testable.

const MINUTE = 60_000;

/** "2026-12-15T19:05:00" -> Date in local wall-clock terms (no timezone maths). */
export const localDate = (atLocal: string) => {
  const [d, t = "00:00:00"] = atLocal.split("T");
  const [y, m, day] = d.split("-").map(Number);
  const [h, min] = t.split(":").map(Number);
  return new Date(y, m - 1, day, h, min);
};

export const formatDuration = (minutes: number) => `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, "0")}m`;
export const timeOf = (atLocal: string) => atLocal.slice(11, 16);
export const dayLabel = (atLocal: string) => format(localDate(atLocal), "EEE d MMM");

/** Calendar days between two local dates (for "+1" on arrival times). */
export const dayDifference = (fromLocal: string, toLocal: string) =>
  Math.round(
    (Date.UTC(...ymd(toLocal)) - Date.UTC(...ymd(fromLocal))) / (24 * 60 * MINUTE)
  );
const ymd = (atLocal: string): [number, number, number] => {
  const [y, m, d] = atLocal.slice(0, 10).split("-").map(Number);
  return [y, m - 1, d];
};

export interface Layover {
  city: string;
  airport: string;
  /** Different arrival and departure airports (e.g. land LHR, leave LGW). */
  nextAirport: string | null;
  minutes: number;
  /** Spans the night (part of it between midnight and 05:00) and lasts 6h or more. */
  overnight: boolean;
  /** 6 hours or more. */
  long: boolean;
}

export const layoversOf = (itinerary: Itinerary): Layover[] =>
  itinerary.segments.slice(1).map((segment, i) => {
    const previous = itinerary.segments[i];
    const arrive = localDate(previous.to.atLocal);
    const leave = localDate(segment.from.atLocal);
    const minutes = Math.round((leave.getTime() - arrive.getTime()) / MINUTE);
    return {
      city: previous.to.city,
      airport: previous.to.iata,
      nextAirport: segment.from.iata !== previous.to.iata ? segment.from.iata : null,
      minutes,
      overnight: minutes >= 6 * 60 && overlapsNight(arrive, leave),
      long: minutes >= 6 * 60,
    };
  });

/** True when [arrive, leave] overlaps 00:00–05:00 on any day. */
const overlapsNight = (arrive: Date, leave: Date) => {
  const day = new Date(arrive.getFullYear(), arrive.getMonth(), arrive.getDate());
  while (day < leave) {
    const nightEnd = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 5);
    if (day < leave && nightEnd > arrive) return true;
    day.setDate(day.getDate() + 1);
  }
  return false;
};

export const stopsOf = (itinerary: Itinerary) =>
  itinerary.segments.length - 1 + itinerary.segments.reduce((n, s) => n + s.stops, 0);

export const totalMinutes = (offer: FlightOffer) => offer.itineraries.reduce((n, it) => n + it.durationMinutes, 0);
export const maxStops = (offer: FlightOffer) => Math.max(...offer.itineraries.map(stopsOf));
export const priceOf = (offer: FlightOffer) => Number(offer.price.amount);

/** Price for one adult (what the cards show); the total when there's no adult line. */
export const perAdultAmount = (offer: FlightOffer) =>
  offer.price.perTraveler.find((t) => t.type === "ADULT")?.amount ?? offer.price.amount;

export const travellerCount = (offer: FlightOffer) => offer.price.perTraveler.reduce((n, t) => n + t.count, 0);

export const firstDeparture = (offer: FlightOffer) => offer.itineraries[0].segments[0].from;
export const lastArrival = (itinerary: Itinerary) => itinerary.segments[itinerary.segments.length - 1].to;

/** Amadeus caps bookable seats at 9: below that the number is real scarcity. */
export const seatsLabel = (seatsLeft: number | null) =>
  seatsLeft === null ? null : seatsLeft >= 9 ? "9+ seats" : `${seatsLeft} ${seatsLeft === 1 ? "seat" : "seats"} left at this price`;

export const checkedBags = (offer: FlightOffer) => offer.baggage.checked?.quantity ?? 0;

export const bagsLabel = (offer: FlightOffer) => {
  const bags = checkedBags(offer);
  const weight = offer.baggage.checked?.weightKg;
  if (bags === 0 && weight) return `${weight} kg checked bag`;
  if (bags === 0) return "No checked bag";
  return `${bags} checked ${bags === 1 ? "bag" : "bags"}`;
};

// ---------------------------------------------------------------- notes (orange chips on the card)

const DEADLINE_WARNING_DAYS = 21;

export interface NoteContext {
  today: string;
  fastestToken: string | null;
  /** Searched destination is a city with several airports (LON). */
  destinationIsCity: boolean;
}

export const offerNotes = (offer: FlightOffer, ctx: NoteContext): string[] => {
  const notes: string[] = [];
  const [out, back] = offer.itineraries;

  if (back && ctx.destinationIsCity) {
    const arriveAt = lastArrival(out);
    const leaveFrom = back.segments[0].from;
    // Mock wording: "return from" on a return trip, "leave from" between multi-city flights
    const verb = offer.itineraries.length === 2 && back.segments[back.segments.length - 1].to.city === out.segments[0].from.city ? "return" : "leave";
    if (arriveAt.iata !== leaveFrom.iata) notes.push(`Arrive ${arriveAt.airportName}, ${verb} from ${leaveFrom.airportName}`);
  }
  if (offer.offerToken === ctx.fastestToken) notes.push("Fastest");

  offer.itineraries.forEach((itinerary, i) => {
    const where = offer.itineraries.length === 2 ? (i === 0 ? "outbound" : "return") : `flight ${i + 1}`;
    layoversOf(itinerary).forEach((layover) => {
      if (layover.nextAirport) notes.push(`Change airports in ${layover.city} on ${where}`);
      else if (layover.overnight) notes.push(`Overnight stop in ${layover.city} on ${where}`);
      else if (layover.long) notes.push(`Long stop in ${layover.city} on ${where}`);
    });
  });

  if (offer.lastTicketingAt) {
    const daysLeft = dayDifference(`${ctx.today}T00:00:00`, `${offer.lastTicketingAt.slice(0, 10)}T00:00:00`);
    const departsOn = firstDeparture(offer).atLocal.slice(0, 10);
    if (daysLeft >= 0 && daysLeft <= DEADLINE_WARNING_DAYS && offer.lastTicketingAt.slice(0, 10) < departsOn) {
      notes.push(`Book by ${dayLabel(`${offer.lastTicketingAt.slice(0, 10)}T00:00:00`)}: airline ticketing deadline`);
    }
  }
  return notes;
};

// ---------------------------------------------------------------- sorting

export type SortMode = "BEST" | "CHEAPEST" | "FASTEST";

/** Best balances price and travel time: each scored against the cheapest and fastest offer. */
export const sortOffers = (offers: FlightOffer[], mode: SortMode): FlightOffer[] => {
  if (offers.length === 0) return offers;
  const cheapest = Math.min(...offers.map(priceOf));
  const fastest = Math.min(...offers.map(totalMinutes));
  const score = (o: FlightOffer) =>
    mode === "CHEAPEST" ? priceOf(o) : mode === "FASTEST" ? totalMinutes(o) : priceOf(o) / cheapest + totalMinutes(o) / fastest;
  const tieBreak = (o: FlightOffer) => (mode === "FASTEST" ? priceOf(o) : totalMinutes(o));
  return [...offers].sort((a, b) => score(a) - score(b) || tieBreak(a) - tieBreak(b));
};

// ---------------------------------------------------------------- filters

export type StopsFilter = 0 | 1 | 2;
export type TimeOfDay = "MORNING" | "AFTERNOON" | "EVENING" | "NIGHT";

export const TIMES_OF_DAY: { value: TimeOfDay; label: string; range: string; from: number; to: number }[] = [
  { value: "MORNING", label: "Morning", range: "05–12", from: 5, to: 12 },
  { value: "AFTERNOON", label: "Afternoon", range: "12–18", from: 12, to: 18 },
  { value: "EVENING", label: "Evening", range: "18–24", from: 18, to: 24 },
  { value: "NIGHT", label: "Night", range: "00–05", from: 0, to: 5 },
];

export interface ResultFilters {
  /** Allowed stop counts (2 = two or more); empty = any. */
  stops: StopsFilter[];
  /** Excluded airline codes (all included by default). */
  excludedAirlines: string[];
  twoBags: boolean;
  freeChanges: boolean;
  refundable: boolean;
  /** Outbound departure windows; empty = any. */
  departureTimes: TimeOfDay[];
  sameAirportBothWays: boolean;
}

export const NO_FILTERS: ResultFilters = {
  stops: [],
  excludedAirlines: [],
  twoBags: false,
  freeChanges: false,
  refundable: false,
  departureTimes: [],
  sameAirportBothWays: false,
};

const stopsBucket = (offer: FlightOffer): StopsFilter => Math.min(maxStops(offer), 2) as StopsFilter;
const timeOfDay = (atLocal: string): TimeOfDay => {
  const hour = Number(atLocal.slice(11, 13));
  return TIMES_OF_DAY.find((t) => hour >= t.from && hour < t.to)?.value ?? "NIGHT";
};
const sameAirport = (offer: FlightOffer) => {
  const [out, back] = offer.itineraries;
  return !back || lastArrival(out).iata === back.segments[0].from.iata;
};

export const matchesFilters = (offer: FlightOffer, f: ResultFilters) =>
  (f.stops.length === 0 || f.stops.includes(stopsBucket(offer))) &&
  !f.excludedAirlines.includes(offer.validatingAirline.code) &&
  (!f.twoBags || checkedBags(offer) >= 2) &&
  (!f.freeChanges || (offer.fareConditions.changeable && !offer.fareConditions.changePenalty)) &&
  (!f.refundable || offer.fareConditions.refundable) &&
  (f.departureTimes.length === 0 || f.departureTimes.includes(timeOfDay(firstDeparture(offer).atLocal))) &&
  (!f.sameAirportBothWays || sameAirport(offer));

export const activeFilterCount = (f: ResultFilters) =>
  (f.stops.length ? 1 : 0) +
  (f.excludedAirlines.length ? 1 : 0) +
  [f.twoBags, f.freeChanges, f.refundable, f.sameAirportBothWays].filter(Boolean).length +
  (f.departureTimes.length ? 1 : 0);

/** "From" price per stops option and per airline, over all offers (so options never vanish). */
export const facetsOf = (offers: FlightOffer[]) => {
  const cheapestWhere = (keep: (o: FlightOffer) => boolean) => {
    const prices = offers.filter(keep).map(priceOf);
    return prices.length ? Math.min(...prices) : null;
  };
  const airlines = new Map<string, string>();
  offers.forEach((o) => airlines.set(o.validatingAirline.code, o.validatingAirline.name));
  return {
    stops: ([0, 1, 2] as StopsFilter[]).map((s) => ({ value: s, from: cheapestWhere((o) => stopsBucket(o) === s) })),
    airlines: [...airlines.entries()]
      .map(([code, name]) => ({ code, name, from: cheapestWhere((o) => o.validatingAirline.code === code) as number }))
      .sort((a, b) => a.from - b.from),
  };
};

export const destinationIsCity = (criteria: FlightSearchCriteria, places: Record<string, Place>) =>
  places[criteria.legs[0].destination]?.type === "CITY";
