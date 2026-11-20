import { dayDifference, formatDuration, layoversOf, localDate, stopsOf, timeOf } from "../../results/offerFacts";
import type { FlightOffer, Itinerary } from "../../types";
import { format } from "date-fns";

// Mock (Fares, "Selected flight"): airline and aircraft, one block per
// direction, and a "Flight details" disclosure with each flight and stop.
const directionLabel = (offer: FlightOffer, index: number) =>
  offer.itineraries.length === 2 ? (index === 0 ? "Outbound" : "Return") : offer.itineraries.length === 1 ? "Outbound" : `Flight ${index + 1}`;

const dateLabel = (itinerary: Itinerary) => format(localDate(itinerary.segments[0].from.atLocal), "EEE d MMM");

const stopSummary = (itinerary: Itinerary) => {
  const layovers = layoversOf(itinerary);
  if (stopsOf(itinerary) === 0) return "Direct";
  const overnight = layovers.find((l) => l.overnight);
  if (overnight) return `overnight stop in ${overnight.city}`;
  return layovers.length === 1 ? `1 stop in ${layovers[0].city}` : `${layovers.length} stops`;
};

export const SelectedFlight = ({ offer }: { offer: FlightOffer }) => {
  const aircraft = [...new Set(offer.itineraries.flatMap((it) => it.segments.map((s) => s.aircraft)).filter(Boolean))];

  return (
    <section aria-label="Selected flight" className="flex flex-wrap items-center gap-6 rounded-2xl border border-[#DEDFE1] bg-white p-5">
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden
          className="inline-flex h-10 w-10 items-center justify-center rounded-[0.625rem] bg-[#E8EEF7] font-extrabold text-[#023E8A]"
        >
          {offer.validatingAirline.code}
        </span>
        <div>
          <div className="font-extrabold text-[#181818]">{offer.validatingAirline.name}</div>
          {aircraft.length > 0 && <div className="text-sm text-[#4E4F52]">{aircraft.join(" · ")}</div>}
        </div>
      </div>

      {offer.itineraries.map((itinerary, index) => {
        const first = itinerary.segments[0];
        const last = itinerary.segments[itinerary.segments.length - 1];
        const plus = dayDifference(first.from.atLocal, last.to.atLocal);
        return (
          <div key={index} className="flex-[1_1_16.25rem]">
            <div className="text-[0.8125rem] font-semibold uppercase text-[#4E4F52]">
              {directionLabel(offer, index)} · {dateLabel(itinerary)}
            </div>
            <div className="font-bold text-[#181818]">
              {timeOf(first.from.atLocal)} {first.from.iata} → {timeOf(last.to.atLocal)}
              {plus > 0 ? `+${plus}` : ""} {last.to.iata}
            </div>
            <div className="text-sm text-[#4E4F52]">
              {formatDuration(itinerary.durationMinutes)} · {stopSummary(itinerary)}
            </div>
          </div>
        );
      })}

      <details className="basis-full border-0 border-t border-t-[#EBECED] pt-1">
        <summary className="flex min-h-11 cursor-pointer items-center text-[0.9375rem] font-semibold text-[#023E8A]">Flight details</summary>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(18.75rem,1fr))] gap-4 pb-1 pt-2">
          {offer.itineraries.map((itinerary, index) => {
            const layovers = layoversOf(itinerary);
            return (
              <div key={index} className="flex flex-col gap-2">
                <div className="text-[0.8125rem] font-bold uppercase text-[#4E4F52]">
                  {directionLabel(offer, index)} · {dateLabel(itinerary)} · {formatDuration(itinerary.durationMinutes)}
                </div>
                {itinerary.segments.map((segment, i) => (
                  <div key={segment.id} className="flex flex-col gap-2">
                    {i > 0 && (
                      <div className="ml-2 border-0 border-l-3 border-dashed border-l-[#FF6F1E] pl-3 text-sm text-[#181818]">
                        {layovers[i - 1].nextAirport
                          ? `Change airports in ${layovers[i - 1].city} · ${layovers[i - 1].airport} → ${layovers[i - 1].nextAirport}`
                          : `${layovers[i - 1].overnight ? "Overnight stop" : "Stop"} in ${layovers[i - 1].city}`}{" "}
                        · {formatDuration(layovers[i - 1].minutes)}
                      </div>
                    )}
                    <div className="rounded-[0.625rem] bg-[#F4F6FA] px-3 py-2.5">
                      <div className="font-bold text-[#181818]">
                        {timeOf(segment.from.atLocal)} {segment.from.iata} → {timeOf(segment.to.atLocal)} {segment.to.iata}
                      </div>
                      <div className="text-[0.8125rem] text-[#4E4F52]">
                        {[`${segment.marketing.code}${segment.marketing.number}`, segment.aircraft, formatDuration(segment.durationMinutes)]
                          .filter(Boolean)
                          .join(" · ")}
                        {segment.operating ? ` · Operated by ${segment.operating.name}` : ""}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </details>
    </section>
  );
};
