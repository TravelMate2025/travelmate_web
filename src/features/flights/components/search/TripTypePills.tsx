import type { TripType } from "../../types";

// Mock (.tm-seg): 44px tall, 18px side padding, 14px semibold, selected = brand blue.
const TRIP_TYPES: { value: TripType; label: string }[] = [
  { value: "RETURN", label: "Return" },
  { value: "ONE_WAY", label: "One-way" },
  { value: "MULTI_CITY", label: "Multi-city" },
];

const pillClass = (selected: boolean) =>
  `min-h-11 cursor-pointer rounded-full px-4.5 text-sm font-semibold ${selected ? "bg-[#023E8A] text-white" : "bg-transparent text-[#4E4F52]"}`;

export const TripTypePills = ({ value, onChange }: { value: TripType; onChange: (tripType: TripType) => void }) => (
  <div role="radiogroup" aria-label="Trip type" className="flex flex-wrap gap-1.5 self-start rounded-full bg-[#F4F6FA] p-1">
    {TRIP_TYPES.map((t) => (
      <button
        key={t.value}
        type="button"
        role="radio"
        aria-checked={value === t.value}
        onClick={() => onChange(t.value)}
        className={pillClass(value === t.value)}
      >
        {t.label}
      </button>
    ))}
  </div>
);
