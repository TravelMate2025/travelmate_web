import { Link } from "react-router-dom";
import { format } from "date-fns";
import { flightMultiCityPath, flightsLandingPath } from "../../../shared/bookingFlowRoutes";
import { cabinLabel, passengersSummary } from "../../search/searchDraft";
import { SELLING_CURRENCIES, type CurrencyCode, type FlightSearchCriteria, type Place } from "../../types";
import { localDate } from "../../results/offerFacts";

// Mock (Results header): a pill with the route, dates, travellers and
// "Edit search", next to the currency.
const placeName = (code: string, places: Record<string, Place>) => {
  const place = places[code];
  return place ? `${place.city} (${code})` : code;
};

const shortDate = (date: string) => format(localDate(`${date}T00:00:00`), "d MMM");

interface ResultsSearchBarProps {
  criteria: FlightSearchCriteria;
  places: Record<string, Place>;
  currency: CurrencyCode;
  onCurrencyChange: (currency: CurrencyCode) => void;
}

export const ResultsSearchBar = ({ criteria, places, currency, onCurrencyChange }: ResultsSearchBarProps) => {
  const [first, second] = criteria.legs;
  const route =
    criteria.tripType === "RETURN"
      ? `${placeName(first.origin, places)} ⇄ ${placeName(first.destination, places)}`
      : [first.origin, ...criteria.legs.map((l) => l.destination)].map((c) => placeName(c, places)).join(" → ");
  const dates =
    criteria.tripType === "RETURN" && second
      ? `${shortDate(first.date)} – ${shortDate(second.date)}`
      : criteria.legs.map((l) => shortDate(l.date)).join(" · ");
  const editTo =
    criteria.tripType === "MULTI_CITY"
      ? flightMultiCityPath()
      : flightsLandingPath({ from: first.origin, to: first.destination });

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Link
        to={editTo}
        className="flex min-h-12 min-w-0 flex-[1_1_26.25rem] flex-wrap items-center gap-x-3 gap-y-1 rounded-full border border-[#CDCED1] bg-white px-4.5 py-1.5 text-[#181818] no-underline"
      >
        <strong>{route}</strong>
        <span className="text-sm text-[#4E4F52]">
          {dates} · {passengersSummary(criteria.passengers)} · {cabinLabel(criteria.cabin)}
        </span>
        <span className="ml-auto text-sm font-bold text-[#023E8A]">Edit search</span>
      </Link>
      <select
        aria-label="Currency"
        value={currency}
        onChange={(event) => onCurrencyChange(event.target.value as CurrencyCode)}
        className="min-h-11 cursor-pointer rounded-full border border-[#CDCED1] bg-white px-3.5 text-sm font-semibold text-[#181818]"
      >
        {SELLING_CURRENCIES.map((code) => (
          <option key={code} value={code}>
            {code}
          </option>
        ))}
      </select>
    </div>
  );
};
