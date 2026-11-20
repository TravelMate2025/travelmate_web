import { useState } from "react";
import TuneIcon from "@mui/icons-material/Tune";
import { useResultsView } from "../../hooks/useResultsView";
import { useSelectOffer } from "../../hooks/useSelectOffer";
import type { FlightOffer, FlightSearchCriteria, Place } from "../../types";
import { FiltersPanel } from "./FiltersPanel";
import { OfferCard } from "./OfferCard";
import { SortTabs } from "./SortTabs";

// Return / one-way results (mock: Results): filters on the left, sort tabs,
// a one-line summary and the offer cards. On narrow screens the filters
// open from a button above the list.
interface OfferResultsProps {
  offers: FlightOffer[];
  criteria: FlightSearchCriteria;
  places: Record<string, Place>;
}

export const OfferResults = ({ offers, criteria, places }: OfferResultsProps) => {
  const view = useResultsView(offers, criteria, places);
  const select = useSelectOffer();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const destination = places[criteria.legs[0].destination];
  const multiAirportCity = destination?.type === "CITY" ? destination.city : null;
  const trip = criteria.tripType === "RETURN" ? "round trip" : "one-way";
  const summary =
    view.matching === view.total
      ? `${view.total} flights`
      : `${view.matching} of ${view.total} flights match your filters`;

  return (
    <div className="flex flex-wrap items-start gap-6">
      <div className={`${filtersOpen ? "block" : "hidden"} w-full lg:block lg:max-w-full lg:flex-[1_1_16.25rem]`}>
        <FiltersPanel
          filters={view.filters}
          onChange={view.updateFilters}
          onReset={view.resetFilters}
          facets={view.facets}
          currency={criteria.currency}
          multiAirportCity={multiAirportCity}
          isReturn={criteria.tripType === "RETURN"}
        />
      </div>

      <section aria-label="Flights" className="flex min-w-0 flex-[999_1_40rem] flex-col gap-4">
        <button
          type="button"
          aria-expanded={filtersOpen}
          onClick={() => setFiltersOpen((v) => !v)}
          className="inline-flex min-h-11 cursor-pointer items-center gap-2 self-start rounded-full border border-[#CDCED1] bg-white px-4 text-sm font-semibold text-[#181818] lg:hidden"
        >
          <TuneIcon fontSize="small" />
          {filtersOpen ? "Hide filters" : "Filters"}
          {view.activeFilters > 0 && ` (${view.activeFilters})`}
        </button>
        <SortTabs tabs={view.tabs} value={view.sort} onChange={view.setSort} />
        <p className="text-sm text-[#4E4F52]">
          {summary} · Prices are per adult, {trip}, including taxes and fees.
        </p>

        {view.matching === 0 ? (
          <div className="rounded-2xl border border-[#DEDFE1] bg-white p-6" role="status">
            <p className="font-semibold text-[#181818]">No flights match these filters</p>
            <button type="button" onClick={view.resetFilters} className="mt-3 cursor-pointer bg-transparent p-0 text-sm font-bold text-[#023E8A]">
              Reset filters
            </button>
          </div>
        ) : (
          view.visible.map((offer) => (
            <OfferCard key={offer.offerToken} offer={offer} noteContext={view.noteContext} onSelect={select} />
          ))
        )}

        {view.canShowMore && (
          <button
            type="button"
            onClick={view.showMore}
            className="min-h-11.5 cursor-pointer self-center rounded-xl border border-[#023E8A] bg-white px-6 font-bold text-[#023E8A]"
          >
            Show more flights
          </button>
        )}
      </section>
    </div>
  );
};
