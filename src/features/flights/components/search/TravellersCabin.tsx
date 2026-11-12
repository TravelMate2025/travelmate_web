import {
  CABINS,
  cabinLabel,
  passengerMax,
  passengerMin,
  passengersSummary,
  stepPassengers,
  type PassengerKey,
} from "../../search/searchDraft";
import type { CabinClass, PassengerCounts } from "../../types";
import { CELL_CLASS, CELL_HINT_CLASS, CELL_LABEL_CLASS, CELL_VALUE_CLASS, ERROR_TEXT_CLASS } from "./fieldStyles";

// Mock (web Main): the search card shows a summary box ("Edit below"); the
// counters and cabin live in a panel under the card and apply immediately.
export const TRAVELLERS_PANEL_ID = "flight-travellers-panel";

const ROWS: { key: PassengerKey; label: string; hint: string }[] = [
  { key: "adults", label: "Adults", hint: "12 years and over" },
  { key: "children", label: "Children", hint: "2 to 11 years, own seat" },
  { key: "heldInfants", label: "Infants on lap", hint: "Under 2, sits with an adult" },
  { key: "seatedInfants", label: "Infants in own seat", hint: "Under 2, with a car seat" },
];

const stepperClass = (disabled: boolean) =>
  `flex h-9 w-9 items-center justify-center rounded-full border text-lg font-semibold ${
    disabled ? "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400" : "cursor-pointer border-[#CDCED1] bg-white text-[#023E8A]"
  }`;

const cabinClass = (selected: boolean) =>
  `min-h-11 cursor-pointer rounded-full px-4 text-sm ${
    selected ? "border-2 border-[#023E8A] bg-[#E8EEF7] font-bold text-[#023E8A]" : "border border-[#CDCED1] bg-white font-semibold text-[#181818]"
  }`;

interface CellProps {
  id: string;
  passengers: PassengerCounts;
  cabin: CabinClass;
  error?: string;
}

export const TravellersCabinCell = ({ id, passengers, cabin, error }: CellProps) => {
  const errorId = `${id}-error`;
  const goToPanel = () => {
    const panel = document.getElementById(TRAVELLERS_PANEL_ID);
    panel?.scrollIntoView({ behavior: "smooth", block: "center" });
    panel?.querySelector<HTMLButtonElement>("button:not(:disabled)")?.focus({ preventScroll: true });
  };

  return (
    <div className={`${CELL_CLASS} basis-52`}>
      <label htmlFor={id} className={CELL_LABEL_CLASS}>
        Travellers and cabin
      </label>
      <button
        id={id}
        type="button"
        onClick={goToPanel}
        aria-controls={TRAVELLERS_PANEL_ID}
        aria-describedby={error ? errorId : undefined}
        className={`cursor-pointer bg-transparent p-0 text-left ${CELL_VALUE_CLASS}`}
      >
        {passengersSummary(passengers)} · {cabinLabel(cabin)}
      </button>
      {error ? (
        <span id={errorId} className={ERROR_TEXT_CLASS}>
          {error}
        </span>
      ) : (
        <span className={CELL_HINT_CLASS}>Edit below</span>
      )}
    </div>
  );
};

interface PanelProps {
  passengers: PassengerCounts;
  cabin: CabinClass;
  onChange: (passengers: PassengerCounts, cabin: CabinClass) => void;
}

export const TravellersCabinPanel = ({ passengers, cabin, onChange }: PanelProps) => {
  const showLapNote = passengers.heldInfants > 0 && passengers.heldInfants >= passengers.adults;

  return (
    <section
      id={TRAVELLERS_PANEL_ID}
      aria-labelledby="flight-pax-title"
      className="flex-1 basis-96 scroll-mt-32 rounded-2xl border border-[#DEDFE1] bg-white p-6"
    >
      <h2 id="flight-pax-title" className="text-lg font-bold text-[#181818]">
        Travellers and cabin
      </h2>
      <p className="mb-4 mt-1 text-sm text-[#4E4F52]">Up to 9 travellers. Each infant travels with one adult.</p>
      <div className="flex flex-col gap-3.5">
        {ROWS.map((row) => {
          const value = passengers[row.key];
          const minusOff = value <= passengerMin(row.key);
          const plusOff = value >= passengerMax(passengers, row.key);
          return (
            <div key={row.key} className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-[#181818]">{row.label}</p>
                <p className="text-sm text-[#4E4F52]">{row.hint}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label={`Fewer ${row.label.toLowerCase()}`}
                  disabled={minusOff}
                  onClick={() => onChange(stepPassengers(passengers, row.key, -1), cabin)}
                  className={stepperClass(minusOff)}
                >
                  −
                </button>
                <span className="min-w-4 text-center font-bold" aria-live="polite">
                  {value}
                </span>
                <button
                  type="button"
                  aria-label={`More ${row.label.toLowerCase()}`}
                  disabled={plusOff}
                  onClick={() => onChange(stepPassengers(passengers, row.key, 1), cabin)}
                  className={stepperClass(plusOff)}
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {showLapNote && <p className="mt-3 text-sm text-[#9A3412]">Each infant on a lap needs their own adult. Add an adult first.</p>}
      <div role="radiogroup" aria-label="Cabin" className="mt-5 flex flex-wrap gap-2">
        {CABINS.map((c) => (
          <button
            key={c.value}
            type="button"
            role="radio"
            aria-checked={cabin === c.value}
            onClick={() => onChange(passengers, c.value)}
            className={cabinClass(cabin === c.value)}
          >
            {c.label}
          </button>
        ))}
      </div>
    </section>
  );
};
