import { Link } from "react-router-dom";
import { format } from "date-fns";
import { flightsLandingPath } from "../../../shared/bookingFlowRoutes";
import { cabinLabel, passengersSummary } from "../../search/searchDraft";
import type { FlightSearchCriteria } from "../../types";

const shortDate = (value: string) => {
  const [y, m, d] = value.split("-").map(Number);
  return format(new Date(y, m - 1, d), "EEE d MMM");
};

const datesLine = (criteria: FlightSearchCriteria) =>
  criteria.tripType === "RETURN"
    ? `${shortDate(criteria.legs[0].date)} – ${shortDate(criteria.legs[1].date)}`
    : criteria.legs.map((l) => shortDate(l.date)).join(" · ");

interface ResultsSummaryProps {
  title: string;
  criteria: FlightSearchCriteria;
}

export const ResultsSummary = ({ title, criteria }: ResultsSummaryProps) => (
  <div className="flex flex-wrap items-end justify-between gap-3">
    <div className="min-w-0">
      <h1 className="text-2xl font-bold text-[#181818]">{title}</h1>
      <p className="text-sm text-[#4E4F52]">
        {datesLine(criteria)} · {passengersSummary(criteria.passengers)} · {cabinLabel(criteria.cabin)}
        {criteria.nonStop ? " · Direct only" : ""}
      </p>
    </div>
    <Link to={flightsLandingPath()} className="text-sm font-bold text-[#023E8A] hover:underline">
      Change search
    </Link>
  </div>
);
