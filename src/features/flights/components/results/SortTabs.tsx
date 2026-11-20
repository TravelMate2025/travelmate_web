import { formatMoney } from "../../currency";
import { formatDuration, totalMinutes, type SortMode } from "../../results/offerFacts";
import type { FlightOffer } from "../../types";

// Mock: three tabs in one bordered box; the selected tab has a 3px blue underline.
const LABELS: Record<SortMode, string> = { BEST: "Best", CHEAPEST: "Cheapest", FASTEST: "Fastest" };

interface SortTabsProps {
  tabs: { mode: SortMode; top: FlightOffer | null }[];
  value: SortMode;
  onChange: (mode: SortMode) => void;
}

export const SortTabs = ({ tabs, value, onChange }: SortTabsProps) => (
  <div role="tablist" aria-label="Sort results" className="grid grid-cols-3 overflow-hidden rounded-2xl border border-[#DEDFE1] bg-white">
    {tabs.map(({ mode, top }, index) => {
      const selected = mode === value;
      return (
        <button
          key={mode}
          type="button"
          role="tab"
          aria-selected={selected}
          onClick={() => onChange(mode)}
          className={`cursor-pointer border-0 border-b-3 bg-white px-4 py-3.5 text-left ${selected ? "border-b-[#023E8A]" : "border-b-transparent"} ${
            index > 0 ? "border-l border-l-[#DEDFE1]" : ""
          }`}
        >
          <span className={`block text-[0.9375rem] ${selected ? "font-extrabold text-[#023E8A]" : "font-bold text-[#181818]"}`}>{LABELS[mode]}</span>
          <span className="block text-sm text-[#4E4F52]">
            {top ? `${formatMoney(top.price.amount, top.price.currency)} · ${formatDuration(totalMinutes(top))} total` : "No flights"}
          </span>
        </button>
      );
    })}
  </div>
);
