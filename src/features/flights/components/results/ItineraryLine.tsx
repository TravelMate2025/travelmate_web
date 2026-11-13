import { dayDifference, dayLabel, formatDuration, layoversOf, stopsOf, timeOf } from "../../results/offerFacts";
import type { Itinerary } from "../../types";

// Mock: departure | duration with a line and a stop dot | arrival (+1).
const stopsText = (itinerary: Itinerary) => {
  const stops = stopsOf(itinerary);
  if (stops === 0) return "Direct";
  const layovers = layoversOf(itinerary);
  const via = layovers.map((l) => l.airport).join(", ");
  const longest = layovers.reduce((max, l) => (l.long && l.minutes > max ? l.minutes : max), 0);
  return `${stops} ${stops === 1 ? "stop" : "stops"} · ${via}${longest ? ` (${formatDuration(longest)})` : ""}`;
};

interface ItineraryLineProps {
  itinerary: Itinerary;
  /** Multi-city cards number each flight (mock). */
  number?: number;
  /** Shorter place line for multi-city ("LOS · 15 Dec"). */
  compact?: boolean;
}

export const ItineraryLine = ({ itinerary, number, compact = false }: ItineraryLineProps) => {
  const first = itinerary.segments[0];
  const last = itinerary.segments[itinerary.segments.length - 1];
  const plus = dayDifference(first.from.atLocal, last.to.atLocal);
  const day = (at: string) => (compact ? dayLabel(at).slice(4) : dayLabel(at));
  const big = compact ? "text-lg" : "text-xl";

  return (
    <div
      className={`grid items-center ${
        number ? "grid-cols-[1.625rem_4.375rem_minmax(0,1fr)_5.625rem] gap-2.5" : "grid-cols-[4.75rem_minmax(0,1fr)_6rem] gap-3"
      }`}
    >
      {number && <span className="text-xs font-extrabold text-[#023E8A]">{number}</span>}
      <div>
        <div className={`${big} font-extrabold text-[#181818]`}>{timeOf(first.from.atLocal)}</div>
        <div className="text-[0.8125rem] text-[#4E4F52]">
          {first.from.iata} · {day(first.from.atLocal)}
        </div>
      </div>
      <div className="text-center">
        <div className="text-[0.8125rem] text-[#4E4F52]">{formatDuration(itinerary.durationMinutes)}</div>
        <div className="relative my-1.5 h-0.5 bg-[#CDCED1]">
          {stopsOf(itinerary) > 0 && (
            <span className="absolute -top-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full border-2 border-[#FF6F1E] bg-white" />
          )}
        </div>
        <div className="text-[0.8125rem] text-[#4E4F52]">{stopsText(itinerary)}</div>
      </div>
      <div className="text-right">
        <div className={`${big} font-extrabold text-[#181818]`}>
          {timeOf(last.to.atLocal)}
          {plus > 0 && <sup className="text-xs text-[#C2410C]">+{plus}</sup>}
        </div>
        <div className="text-[0.8125rem] text-[#4E4F52]">
          {last.to.iata} · {day(last.to.atLocal)}
        </div>
      </div>
    </div>
  );
};
