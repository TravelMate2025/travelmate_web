import { useRef, type KeyboardEvent } from "react";
import LuggageOutlinedIcon from "@mui/icons-material/LuggageOutlined";
import { chosenIn, type BagGroup } from "../../booking/bags";
import { formatMoney } from "../../currency";
import type { CurrencyCode, Money } from "../../types";
import { CARD, TITLE } from "../pay/ReviewCards";

// Pieces of the Extras step (mock: Extras).
const HINT = "text-[0.8125rem] text-[#4E4F52]";
const LINE = "flex justify-between gap-3 text-[0.9375rem]";

/** Mock: blue note, 14px corners, "Already included in Eco Essential: …". */
export const IncludedBags = ({ brand, text }: { brand: string; text: string }) => (
  <div className="flex items-start gap-3 rounded-[0.875rem] bg-[#E8EEF7] px-4 py-3.5">
    <LuggageOutlinedIcon aria-hidden className="text-[#023E8A]" />
    <div className="text-[0.9375rem] text-[#012A5D]">
      <strong>Already included in {brand}:</strong> {text}
    </div>
  </div>
);

interface BagGroupCardProps {
  group: BagGroup;
  chosenIds: string[];
  onChoose: (id: string | null) => void;
}

/** Mock: one card per direction; options as radio tiles (min 200px, 110px tall). Arrow keys move the choice. */
export const BagGroupCard = ({ group, chosenIds, onChoose }: BagGroupCardProps) => {
  const chosen = chosenIn(group, chosenIds);
  const tiles = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: KeyboardEvent, index: number) => {
    const step = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (index + step + group.choices.length) % group.choices.length;
    onChoose(group.choices[next].id);
    tiles.current[next]?.focus();
  };
  const titleId = `bags-${group.key.replace(/[^a-z0-9]/gi, "-")}`;
  return (
    <section aria-labelledby={titleId} className={CARD}>
      <div>
        <h2 id={titleId} className={`${TITLE} mb-1`}>
          {group.title}
        </h2>
        <div className={HINT}>{group.subtitle}</div>
      </div>
      <div role="radiogroup" aria-label={`${group.title} extra bags`} className="grid grid-cols-[repeat(auto-fit,minmax(12.5rem,1fr))] gap-3">
        {group.choices.map((choice, index) => {
          const on = choice.id === chosen;
          return (
            <button
              key={choice.id ?? "none"}
              ref={(el) => {
                tiles.current[index] = el;
              }}
              type="button"
              role="radio"
              aria-checked={on}
              tabIndex={on ? 0 : -1}
              onClick={() => onChoose(choice.id)}
              onKeyDown={(e) => onKey(e, index)}
              className={`min-h-27.5 cursor-pointer rounded-[0.875rem] p-4 text-left text-[#181818] ${
                on ? "border-2 border-solid border-[#023E8A] bg-[#E8EEF7]" : "border border-solid border-[#CDCED1] bg-white"
              }`}
            >
              <div className="text-base font-extrabold">{choice.label}</div>
              <div className={`${HINT} mb-2 mt-1`}>{choice.detail}</div>
              <div className="text-lg font-extrabold">{choice.price}</div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

interface SummaryProps {
  passengers: string;
  flights: string;
  extras: Money;
  total: string;
  currency: CurrencyCode;
}

/** Mock: aside "Price summary" with flights, extra bags, total. */
export const ExtrasSummary = ({ passengers, flights, extras, total, currency }: SummaryProps) => (
  <aside aria-label="Price summary" className="flex flex-[1_1_18.75rem] flex-col gap-2.5 self-start rounded-2xl border border-[#DEDFE1] bg-white p-5">
    <h2 className="mb-1 text-[1.0625rem] font-bold text-[#181818]">Price summary</h2>
    <div className={LINE}>
      <span>Flights · {passengers}</span>
      <span>{formatMoney(flights, currency)}</span>
    </div>
    <div className={LINE}>
      <span>Extra bags</span>
      <span>{formatMoney(extras.amount, currency)}</span>
    </div>
    <div aria-live="polite" className={`${LINE} mt-1 border-0 border-t border-solid border-t-[#EBECED] pt-2.5 text-xl font-extrabold`}>
      <span>Total</span>
      <span>{formatMoney(total, currency)}</span>
    </div>
    <p className={HINT}>Bag prices are set by the airline and confirmed again before you pay.</p>
  </aside>
);
