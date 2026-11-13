import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { formatMoney } from "../../currency";
import { SELLING_CURRENCIES, type CurrencyCode, type PayableAmount } from "../../types";
import { CARD } from "./ReviewCards";

// Mock (Pay, "Payment"): pay in USD / NGN / GBP (amounts from the server),
// the consent tick box, then the orange "Pay … securely" button.
interface PaymentCardProps {
  payable: PayableAmount[];
  currency: CurrencyCode;
  bookedCurrency: CurrencyCode;
  onCurrencyChange: (currency: CurrencyCode) => void;
  agreed: boolean;
  onAgreedChange: (agreed: boolean) => void;
  onPay: () => void;
  paying: boolean;
  error: string | null;
}

const optionClass = (selected: boolean) =>
  `min-h-16 cursor-pointer rounded-xl px-3.5 py-3 text-left text-[#181818] ${
    selected ? "border-2 border-[#023E8A] bg-[#E8EEF7]" : "border border-[#CDCED1] bg-white"
  }`;

export const PaymentCard = ({ payable, currency, bookedCurrency, onCurrencyChange, agreed, onAgreedChange, onPay, paying, error }: PaymentCardProps) => {
  const chosen = payable.find((p) => p.currency === currency);
  const label = chosen ? formatMoney(chosen.total, chosen.currency) : "";

  return (
    <section aria-labelledby="payment-h" className={CARD}>
      <h2 id="payment-h" className="text-[1.1875rem] font-bold text-[#181818]">
        Payment
      </h2>
      <div role="radiogroup" aria-label="Pay in" className="grid grid-cols-3 gap-2.5">
        {SELLING_CURRENCIES.map((code) => {
          const amount = payable.find((p) => p.currency === code);
          if (!amount) return null;
          return (
            <button
              key={code}
              type="button"
              role="radio"
              aria-checked={code === currency}
              onClick={() => onCurrencyChange(code)}
              className={optionClass(code === currency)}
            >
              <span className="block font-extrabold leading-snug">{code}</span>
              <span className="block text-[0.8125rem] leading-snug text-[#4E4F52]">{formatMoney(amount.total, amount.currency)}</span>
            </button>
          );
        })}
      </div>
      <p className="text-[0.8125rem] text-[#4E4F52]">
        {currency === bookedCurrency
          ? "You pay exactly this amount. Your bank may add its own fees for foreign-currency payments."
          : "Converted at today’s TravelMate rate, fixed for this booking. You pay exactly this amount."}
      </p>
      <label className="flex cursor-pointer items-start gap-2.5 text-[0.9375rem] text-[#181818]">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => onAgreedChange(e.target.checked)}
          className="mt-0.5 h-4.5 w-4.5 shrink-0 accent-[#023E8A]"
        />
        I've checked the traveller names match the passports and I accept the fare conditions and TravelMate's terms.
      </label>
      {error && (
        <p role="alert" className="text-sm font-semibold text-[#B42318]">
          {error}
        </p>
      )}
      <button
        type="button"
        onClick={onPay}
        disabled={!agreed || paying}
        className="flex min-h-14 cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-[#FF6F1E] text-[1.0625rem] font-extrabold text-[#181818] hover:bg-[#f2600b] disabled:cursor-not-allowed disabled:bg-[#FFD2B8] disabled:text-[#7C2D12]"
      >
        <LockOutlinedIcon aria-hidden fontSize="small" />
        {paying ? "Opening secure payment…" : `Pay ${label} securely`}
      </button>
      <p className="text-center text-[0.8125rem] text-[#4E4F52]">
        Card, bank transfer or USSD through Flutterwave. Your ticket is issued after payment.
      </p>
    </section>
  );
};
