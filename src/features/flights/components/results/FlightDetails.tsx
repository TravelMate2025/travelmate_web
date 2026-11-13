import { localDate, formatDuration, layoversOf, timeOf } from "../../results/offerFacts";
import { cabinLabel } from "../../search/searchDraft";
import type { FlightOffer, SegmentEndpoint } from "../../types";
import { format } from "date-fns";

// Mock: expanded card shows each direction's flights (grey boxes) and stops
// (dashed orange line), side by side on wide screens.
const FLIGHT_BOX = "rounded-[0.625rem] bg-[#F4F6FA] px-3 py-2.5";
const STOP_BOX = "ml-2 border-0 border-l-3 border-dashed border-l-[#FF6F1E] py-0.5 pl-3";

/** "London Stansted (STN)", "Casablanca (CMN)" */
const placeLine = (end: SegmentEndpoint) => {
  const name = end.airportName.startsWith(end.city) ? end.airportName : /\b(International|Airport)\b/.test(end.airportName) ? end.city : `${end.city} ${end.airportName}`;
  return `${name} (${end.iata})`;
};

const titleFor = (offer: FlightOffer, index: number) => {
  const count = offer.itineraries.length;
  const label = count === 2 ? (index === 0 ? "Outbound" : "Return") : count === 1 ? "Outbound" : `Flight ${index + 1}`;
  const itinerary = offer.itineraries[index];
  const date = format(localDate(itinerary.segments[0].from.atLocal), "EEE d MMM");
  return `${label} · ${date} · ${formatDuration(itinerary.durationMinutes)}`.toUpperCase();
};

export const FlightDetails = ({ offer }: { offer: FlightOffer }) => (
  <div className="grid basis-full grid-cols-[repeat(auto-fit,minmax(18.75rem,1fr))] gap-4 border-0 border-t border-t-[#EBECED] pt-4">
    {offer.itineraries.map((itinerary, index) => {
      const layovers = layoversOf(itinerary);
      return (
        <div key={index} className="flex flex-col gap-2.5">
          <div className="text-[0.8125rem] font-bold text-[#4E4F52]">{titleFor(offer, index)}</div>
          {itinerary.segments.map((segment, i) => {
            const layover = i > 0 ? layovers[i - 1] : null;
            const operatedBy = segment.operating ? ` · Operated by ${segment.operating.name}` : "";
            return (
              <div key={segment.id} className="flex flex-col gap-2.5">
                {layover && (
                  <div className={STOP_BOX}>
                    <div className="text-[0.9375rem] font-bold text-[#181818]">
                      {layover.nextAirport
                        ? `Change airports in ${layover.city} · ${layover.airport} → ${layover.nextAirport} · ${formatDuration(layover.minutes)}`
                        : `${layover.overnight ? "Overnight stop" : "Stop"} in ${layover.city} · ${formatDuration(layover.minutes)}`}
                    </div>
                    <div className="text-[0.8125rem] text-[#4E4F52]">
                      {layover.nextAirport
                        ? "Allow time to travel between airports and check in again."
                        : layover.overnight
                          ? "Check transit visa and hotel rules before booking."
                          : "Change planes."}
                    </div>
                  </div>
                )}
                <div className={FLIGHT_BOX}>
                  <div className="text-[0.9375rem] font-bold text-[#181818]">
                    {timeOf(segment.from.atLocal)} {placeLine(segment.from)} → {timeOf(segment.to.atLocal)} {placeLine(segment.to)}
                  </div>
                  <div className="text-[0.8125rem] text-[#4E4F52]">
                    {[
                      `${segment.marketing.code}${segment.marketing.number}`,
                      segment.marketing.name,
                      segment.aircraft,
                      formatDuration(segment.durationMinutes),
                      cabinLabel(segment.cabin),
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                    {operatedBy}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    })}
  </div>
);
