import type { FlightSearchCriteria, Place } from "../types";

// Last few searches on this device (kept on logout, like the other verticals'
// recent searches). Places are stored whole so chips can show city names.
export interface RecentFlightSearch {
  criteria: FlightSearchCriteria;
  places: Record<string, Place>;
  searchedAt: string;
}

const KEY = "tm.flights.recentSearches";
const MAX = 5;

const sameSearch = (a: FlightSearchCriteria, b: FlightSearchCriteria) =>
  a.tripType === b.tripType && a.legs.map((l) => `${l.origin}${l.destination}${l.date}`).join() === b.legs.map((l) => `${l.origin}${l.destination}${l.date}`).join();

export const loadRecentSearches = (): RecentFlightSearch[] => {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(parsed) ? (parsed as RecentFlightSearch[]) : [];
  } catch {
    return [];
  }
};

export const saveRecentSearch = (criteria: FlightSearchCriteria, places: Place[]): RecentFlightSearch[] => {
  const entry: RecentFlightSearch = {
    criteria,
    places: Object.fromEntries(places.map((p) => [p.code, p])),
    searchedAt: new Date().toISOString(),
  };
  const next = [entry, ...loadRecentSearches().filter((r) => !sameSearch(r.criteria, criteria))].slice(0, MAX);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage blocked: recent searches are a convenience only
  }
  return next;
};

/** "Lagos → London" / "Lagos ⇄ London" / "Lagos → London → Dubai → Lagos" */
export const routeTitle = (criteria: FlightSearchCriteria, places: Record<string, Place>) => {
  const city = (code: string) => places[code]?.city ?? code;
  if (criteria.tripType === "RETURN") return `${city(criteria.legs[0].origin)} ⇄ ${city(criteria.legs[0].destination)}`;
  return [criteria.legs[0].origin, ...criteria.legs.map((l) => l.destination)].map(city).join(" → ");
};
