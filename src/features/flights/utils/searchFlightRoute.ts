import { NavigateFunction } from "react-router-dom";
import { Airport } from "../types";

// Re-runs a fresh one-way flight search for a given route, from just IATA
// codes -- no full Airport lookup needed. Mirrors the exact same approach
// already shipped natively (FlightsPersonalizedCard/FlightsPopularRoutes,
// which build a minimal SearchLocation client-side rather than resolving a
// full airport record). Flights have no stable "resume this exact offer"
// view since prices/availability change, so this always runs a real fresh
// search rather than attempting to replay a stale one.
function minimalAirport(iataCode: string, cityLabel: string): Airport {
  return {
    id: null,
    name: cityLabel,
    iataCode,
    cityName: cityLabel,
    countryCode: "",
    countryName: null,
    geoCode: { latitude: 0, longitude: 0 },
    displayName: `${cityLabel} (${iataCode})`,
    type: "AIRPORT",
    priority: 0,
  };
}

export function searchFlightRoute(
  navigate: NavigateFunction,
  params: {
    originCode: string;
    originCity: string;
    destinationCode: string;
    destinationCity: string;
    /** Reuse a real stored date if it's still in the future; otherwise a fresh default is used. */
    preferredDate?: string | null;
  }
) {
  const from = minimalAirport(params.originCode, params.originCity);
  const to = minimalAirport(params.destinationCode, params.destinationCity);

  const preferred = params.preferredDate ? new Date(params.preferredDate) : null;
  const date =
    preferred && !Number.isNaN(preferred.getTime()) && preferred.getTime() > Date.now()
      ? preferred
      : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

  const searchData = {
    from,
    to,
    formattedDate: date.toISOString().slice(0, 10),
    date,
    flightClass: "Economy",
    passengers: { adults: 1, children: 0, infants: 0 },
    tripType: "one-way",
    country: "NGN",
    flights: [{ from, to, date: date.toISOString() }],
  };

  sessionStorage.setItem("trip", JSON.stringify(searchData));
  sessionStorage.setItem("tripType", "one-way");
  navigate("/flight/departure", { state: searchData });
}
