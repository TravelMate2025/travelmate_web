import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { formatMoney } from "../../currency";
import type { PriceChange } from "../../types";

// Mock (Fares): green "Price confirmed with the airline" banner. When the
// price went down, the same banner says so (mock: PriceChanged footnote).
export const PriceConfirmed = ({ change }: { change: PriceChange | null }) => {
  const dropped = change?.direction === "DOWN";
  return (
    <div role="status" className="flex items-start gap-3 rounded-[0.875rem] border border-[#B7E1C7] bg-[#EAF6EF] px-4 py-3.5">
      <CheckCircleOutlineIcon aria-hidden className="!h-5.5 !w-5.5 text-[#1F7A47]" />
      <div>
        <div className="font-bold text-[#145A33]">
          {dropped ? "Good news: the price went down" : "Price confirmed with the airline"}
        </div>
        <div className="text-sm text-[#145A33]">
          {dropped && change
            ? `It's now ${formatMoney(change.current.amount, change.current.currency)} (was ${formatMoney(change.previous.amount, change.previous.currency)}). You'll book at the lower price.`
            : "The fares below are live. If a price changes before you pay, we'll show you the new price and ask you to confirm."}
        </div>
      </div>
    </div>
  );
};
