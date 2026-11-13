import Dialog from "@mui/material/Dialog";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { formatMoney } from "../../currency";
import type { PriceChange } from "../../types";

// Mock (PriceChanged): modal, 560px wide, 20px corners, 28px padding.
interface PriceChangedDialogProps {
  open: boolean;
  change: PriceChange;
  summary: string;
  airline: string;
  onContinue: () => void;
  onSeeOtherFlights: () => void;
}

export const PriceChangedDialog = ({ open, change, summary, airline, onContinue, onSeeOtherFlights }: PriceChangedDialogProps) => {
  const difference = (Number(change.current.amount) - Number(change.previous.amount)).toFixed(2);
  return (
    <Dialog
      open={open}
      aria-labelledby="price-changed-title"
      slotProps={{ paper: { className: "!m-4 !w-full !max-w-[35rem] !rounded-[1.25rem] !shadow-[0_24px_64px_rgba(1,42,93,0.35)]" } }}
    >
      <div className="flex flex-col gap-4.5 p-7 text-[#181818]">
        <span className="inline-flex h-13 w-13 items-center justify-center rounded-full bg-[#FFF1E8] text-[#9A3412]">
          <TrendingUpIcon aria-hidden />
        </span>
        <div>
          <h2 id="price-changed-title" className="mb-2 text-2xl font-bold">
            The airline changed the price
          </h2>
          <p className="text-[0.9375rem] text-[#4E4F52]">
            Fares can change while you book. We checked with {airline} just now and this flight costs more than when you chose it. You
            haven't been charged.
          </p>
        </div>
        <div className="flex flex-col gap-2 rounded-[0.875rem] bg-[#F4F6FA] p-4">
          <div className="flex justify-between text-[0.9375rem] text-[#4E4F52]">
            <span>Price you saw</span>
            <span className="line-through">{formatMoney(change.previous.amount, change.previous.currency)}</span>
          </div>
          <div className="flex justify-between text-[1.1875rem] font-extrabold">
            <span>New price</span>
            <span>{formatMoney(change.current.amount, change.current.currency)}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-[#9A3412]">
            <span>Difference</span>
            <span>+{formatMoney(difference, change.current.currency)}</span>
          </div>
        </div>
        <div className="text-sm text-[#4E4F52]">{summary}</div>
        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onContinue}
            className="min-h-13 cursor-pointer rounded-xl bg-[#023E8A] font-extrabold text-white hover:bg-[#012A5D]"
          >
            Continue at the new price
          </button>
          <button
            type="button"
            onClick={onSeeOtherFlights}
            className="min-h-13 cursor-pointer rounded-xl border-2 border-[#023E8A] bg-white font-bold text-[#023E8A]"
          >
            See other flights
          </button>
        </div>
        <p className="text-[0.8125rem] text-[#4E4F52]">If the price goes down instead, we book at the lower price and tell you.</p>
      </div>
    </Dialog>
  );
};
