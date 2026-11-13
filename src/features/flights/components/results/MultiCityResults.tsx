import { useResultsView } from "../../hooks/useResultsView";
import { useSelectOffer } from "../../hooks/useSelectOffer";
import type { FlightOffer, FlightSearchCriteria, Place } from "../../types";
import { MultiCityOfferCard } from "./MultiCityOfferCard";

// Multi-city results under the form (mock: MultiCity): a heading with the
// count, "one price for the whole trip", then the cards, cheapest first.
interface MultiCityResultsProps {
  offers: FlightOffer[];
  criteria: FlightSearchCriteria;
  places: Record<string, Place>;
}

export const MultiCityResults = ({ offers, criteria, places }: MultiCityResultsProps) => {
  const view = useResultsView(offers, criteria, places, "CHEAPEST");
  const select = useSelectOffer();
  const flights = criteria.legs.length;

  return (
    <section aria-labelledby="multi-results-h" className="flex flex-col gap-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="multi-results-h" className="text-[1.375rem] font-bold text-[#181818]">
          {offers.length} {offers.length === 1 ? "option" : "options"} for your {flights} flights
        </h2>
        <span className="text-[0.8125rem] text-[#4E4F52]">One price for the whole trip, per adult, including taxes and fees.</span>
      </div>
      {/* Mock: cheapest first, no filters on this screen */}
      {view.visible.map((offer) => (
        <MultiCityOfferCard key={offer.offerToken} offer={offer} noteContext={view.noteContext} onSelect={select} />
      ))}
      {view.canShowMore && (
        <button
          type="button"
          onClick={view.showMore}
          className="min-h-11.5 cursor-pointer self-center rounded-xl border border-[#023E8A] bg-white px-6 font-bold text-[#023E8A]"
        >
          Show more options
        </button>
      )}
    </section>
  );
};
