import { formatMoney } from "../../currency";
import type { FareRow } from "../../results/fareRows";
import type { Money } from "../../types";

// Mock (Fares card): 16px corners, 20px padding, 16px gaps; selected = 2px
// blue border and soft shadow. Name 20px, price 30px, rows 15px with a coloured
// state (Included / For a fee / No / Free), 48px select button.
const TONE: Record<FareRow["tone"], string> = {
  yes: "text-[#1F7A47]",
  fee: "text-[#9A3412]",
  no: "text-[#4E4F52]",
};

interface FareCardProps {
  name: string;
  tagline: string;
  price: Money;
  /** "included" for the base fare, "+$52.50" for the others. */
  difference: string;
  rows: FareRow[];
  selected: boolean;
  badge: string | null;
  onSelect: () => void;
  disabled?: boolean;
}

export const FareCard = ({ name, tagline, price, difference, rows, selected, badge, onSelect, disabled }: FareCardProps) => (
  <div
    className={`flex flex-col gap-4 rounded-2xl bg-white p-5 ${
      selected ? "border-2 border-[#023E8A] shadow-[0_8px_24px_rgba(1,42,93,0.12)]" : "border border-[#DEDFE1]"
    }`}
  >
    <div className="flex items-start justify-between gap-2">
      <div>
        <div className="text-xl font-extrabold text-[#181818]">{name}</div>
        <div className="text-sm text-[#4E4F52]">{tagline}</div>
      </div>
      {badge && <span className="rounded-full bg-[#FF6F1E] px-2.5 py-1 text-xs font-extrabold text-[#181818]">{badge}</span>}
    </div>
    <div>
      <span className="text-[1.875rem] font-extrabold text-[#181818]">{formatMoney(price.amount, price.currency)}</span>
      <span className="ml-1.5 text-sm text-[#4E4F52]">{difference}</span>
    </div>
    <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
      {rows.map((row) => (
        <li key={row.text} className="flex items-start gap-2.5 text-[0.9375rem] leading-snug text-[#181818]">
          <span className={`min-w-[4.375rem] font-bold ${TONE[row.tone]}`}>{row.state}</span>
          <span>{row.text}</span>
        </li>
      ))}
    </ul>
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={selected ? `${name}, selected` : `Select ${name}`}
      onClick={onSelect}
      disabled={disabled}
      className={`mt-auto min-h-12 cursor-pointer rounded-xl text-[0.9375rem] font-bold disabled:cursor-wait disabled:opacity-60 ${
        selected ? "border-0 bg-[#023E8A] text-white" : "border-2 border-[#023E8A] bg-white text-[#023E8A]"
      }`}
    >
      {selected ? "Selected" : `Select ${name}`}
    </button>
  </div>
);
