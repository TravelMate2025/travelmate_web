import { formatMoney } from "../../currency";
import type { FareRow } from "../../results/fareRows";
import type { FareRuleText, Money } from "../../types";

// Mock (Fares, bottom): the selected fare and total, "Continue to traveller
// details", and "Full fare rules": a plain summary first, then the airline's
// own rules text.
interface FareSummaryBarProps {
  fareName: string;
  travellersLabel: string;
  total: Money;
  rows: FareRow[];
  rules: FareRuleText[];
  onContinue: () => void;
  busy: boolean;
}

const plain = (rows: FareRow[], prefix: string) => {
  const row = rows.find((r) => r.text.startsWith(prefix));
  if (!row) return null;
  if (row.state === "No") return "not allowed for this fare.";
  if (row.state === "Free") return `free${row.text.slice(prefix.length)}.`;
  return `allowed for a fee${row.text.slice(prefix.length)}${prefix === "Changes" ? ", plus any fare difference" : ""}.`;
};

export const FareSummaryBar = ({ fareName, travellersLabel, total, rows, rules, onContinue, busy }: FareSummaryBarProps) => {
  const changes = plain(rows, "Changes");
  const refunds = plain(rows, "Refunds");

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#DEDFE1] bg-white px-5 py-4.5">
      <div>
        <div className="text-sm text-[#4E4F52]">
          Selected: <strong className="text-[#181818]">{fareName}</strong> · {travellersLabel}
        </div>
        <div className="text-2xl font-extrabold text-[#181818]">
          {formatMoney(total.amount, total.currency)} <span className="text-sm font-medium text-[#4E4F52]">total</span>
        </div>
      </div>
      <button
        type="button"
        onClick={onContinue}
        disabled={busy}
        className="inline-flex min-h-13 cursor-pointer items-center rounded-xl bg-[#023E8A] px-8 text-base font-extrabold text-white hover:bg-[#012A5D] disabled:cursor-wait disabled:opacity-60"
      >
        Continue to traveller details
      </button>
      <details className="basis-full border-0 border-t border-t-[#EBECED] pt-1">
        <summary className="flex min-h-11 cursor-pointer items-center text-[0.9375rem] font-semibold text-[#023E8A]">
          Full fare rules · {fareName}
        </summary>
        <div className="flex flex-col gap-2.5 pb-1 pt-1.5 text-[0.9375rem] text-[#181818]">
          {changes && (
            <div>
              <strong>Changes:</strong> {changes}
            </div>
          )}
          {refunds && (
            <div>
              <strong>Refunds:</strong> {refunds}
            </div>
          )}
          {rules.map((rule) => (
            <div key={rule.category} className="flex flex-col gap-1">
              <div className="text-[0.8125rem] font-bold text-[#4E4F52]">{rule.title}</div>
              <div className="whitespace-pre-line rounded-[0.625rem] bg-[#F4F6FA] p-3 font-mono text-xs leading-normal text-[#4E4F52]">
                {rule.text}
              </div>
            </div>
          ))}
          {rules.length > 0 ? (
            <div className="text-[0.8125rem] text-[#4E4F52]">The airline's original rules text. The plain summary above is what to read first.</div>
          ) : (
            <div className="text-[0.8125rem] text-[#4E4F52]">The airline's full rules text isn't available for this fare.</div>
          )}
        </div>
      </details>
    </div>
  );
};
