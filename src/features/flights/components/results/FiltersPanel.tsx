import { formatMoney } from "../../currency";
import { TIMES_OF_DAY, type ResultFilters, type StopsFilter, type TimeOfDay } from "../../results/offerFacts";
import type { CurrencyCode } from "../../types";

// Mock (Results aside): white card, 16px corners, 20px padding, 22px between
// groups; rows 40px tall at 15px with the "from" price on the right.
const ROW = "flex min-h-10 cursor-pointer items-center justify-between gap-2.5 text-[0.9375rem] text-[#181818]";
const CHECK = "h-4.5 w-4.5 accent-[#023E8A]";
const LEGEND = "mb-2 font-bold text-[#181818]";
const STOP_LABELS: Record<StopsFilter, string> = { 0: "Direct", 1: "1 stop", 2: "2+ stops" };

const toggle = <T,>(list: T[], value: T) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

const timeClass = (selected: boolean) =>
  `min-h-11 cursor-pointer rounded-[0.625rem] text-[0.8125rem] ${
    selected ? "border-2 border-[#023E8A] bg-[#E8EEF7] font-bold text-[#023E8A]" : "border border-[#CDCED1] bg-white font-semibold text-[#181818]"
  }`;

interface FiltersPanelProps {
  filters: ResultFilters;
  onChange: (patch: Partial<ResultFilters>) => void;
  onReset: () => void;
  facets: { stops: { value: StopsFilter; from: number | null }[]; airlines: { code: string; name: string; from: number }[] };
  currency: CurrencyCode;
  /** Searched destination city with several airports, e.g. "London"; null hides the option. */
  multiAirportCity: string | null;
  isReturn: boolean;
}

export const FiltersPanel = ({ filters, onChange, onReset, facets, currency, multiAirportCity, isReturn }: FiltersPanelProps) => {
  const from = (amount: number | null) =>
    amount === null ? <span className="text-[#67696D]">none</span> : <span className="text-[#4E4F52]">from {formatMoney(String(amount), currency)}</span>;

  return (
    <aside aria-label="Filters" className="flex flex-col gap-5.5 rounded-2xl border border-[#DEDFE1] bg-white p-5">
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-bold text-[#181818]">Filters</h2>
        <button type="button" onClick={onReset} className="min-h-11 cursor-pointer bg-transparent text-sm font-bold text-[#023E8A]">
          Reset
        </button>
      </div>

      <fieldset className="m-0 border-0 p-0">
        <legend className={LEGEND}>Stops</legend>
        {facets.stops.map((s) => (
          <label key={s.value} className={ROW}>
            <span className="inline-flex items-center gap-2.5">
              <input
                type="checkbox"
                className={CHECK}
                checked={filters.stops.includes(s.value)}
                disabled={s.from === null}
                onChange={() => onChange({ stops: toggle(filters.stops, s.value) })}
              />
              {STOP_LABELS[s.value]}
            </span>
            {from(s.from)}
          </label>
        ))}
      </fieldset>

      <fieldset className="m-0 border-0 p-0">
        <legend className={LEGEND}>Airlines</legend>
        {facets.airlines.map((a) => (
          <label key={a.code} className={ROW}>
            <span className="inline-flex items-center gap-2.5">
              <input
                type="checkbox"
                className={CHECK}
                checked={!filters.excludedAirlines.includes(a.code)}
                onChange={() => onChange({ excludedAirlines: toggle(filters.excludedAirlines, a.code) })}
              />
              {a.name}
            </span>
            {from(a.from)}
          </label>
        ))}
      </fieldset>

      <fieldset className="m-0 border-0 p-0">
        <legend className={LEGEND}>What's included</legend>
        {(
          [
            ["twoBags", "2 checked bags"],
            ["freeChanges", "Free changes"],
            ["refundable", "Refundable"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className={ROW}>
            <span className="inline-flex items-center gap-2.5">
              <input type="checkbox" className={CHECK} checked={filters[key]} onChange={(e) => onChange({ [key]: e.target.checked })} />
              {label}
            </span>
          </label>
        ))}
      </fieldset>

      <fieldset className="m-0 border-0 p-0">
        <legend className={LEGEND}>Outbound departure</legend>
        <div className="grid grid-cols-2 gap-2">
          {TIMES_OF_DAY.map((t) => {
            const selected = filters.departureTimes.includes(t.value);
            return (
              <button
                key={t.value}
                type="button"
                aria-pressed={selected}
                onClick={() => onChange({ departureTimes: toggle<TimeOfDay>(filters.departureTimes, t.value) })}
                className={timeClass(selected)}
              >
                {t.label}
                <br />
                <span className={selected ? "font-medium" : "font-normal text-[#4E4F52]"}>{t.range}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {isReturn && multiAirportCity && (
        <fieldset className="m-0 border-0 p-0">
          <legend className={LEGEND}>{multiAirportCity} airport</legend>
          <label className={ROW}>
            <span className="inline-flex items-center gap-2.5">
              <input
                type="checkbox"
                className={CHECK}
                checked={filters.sameAirportBothWays}
                onChange={(e) => onChange({ sameAirportBothWays: e.target.checked })}
              />
              Same airport both ways
            </span>
          </label>
        </fieldset>
      )}
    </aside>
  );
};
