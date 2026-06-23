import { Checkbox, Divider, FormControlLabel } from "@mui/material";
import { ArrowRight } from "lucide-react";
import { DeskProps } from "../Page";
import type { CarTransferOption } from "../../types/booking";
import { getPaymentProviderLabel, getPaymentRedirectCopy } from "../../../shared/bookingFlowLabels";

type PaymentMethodProps = {
  car: CarTransferOption;
} & DeskProps;

const getCurrencySymbol = (code?: string) => {
  if (code === "NGN") return "₦";
  if (code === "USD") return "$";
  if (code === "GBP") return "£";
  if (code === "EUR") return "€";
  return code ? `${code} ` : "";
};

const fmt = (n: number) =>
  n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const PaymentMethod = ({
  car,
  formData,
  handleCheckboxChange,
  quotePricing,
}: PaymentMethodProps) => {
  const rawBase = car?.price?.totalAmount ?? 0;
  const rawTotal = car?.price?.totalAmountWithFee ?? rawBase;

  const base = quotePricing?.base ?? rawBase;
  const tax = quotePricing?.tax ?? 0;
  const fees = quotePricing?.fees ?? 0;
  const total =
    quotePricing?.base != null || quotePricing?.tax != null || quotePricing?.fees != null
      ? base + tax + fees
      : (quotePricing?.total ?? rawTotal);
  const symbol = getCurrencySymbol(quotePricing?.currency ?? car?.price?.currencyId);

  return (
    <div className="lg:px-6 px-4 mt-12">
      {/* Payment redirect box */}
      <div className="border-[#CDCED1] lg:border rounded-lg p-5">
        <div className="flex items-center gap-1 mb-4">
          <div className="lg:w-24 w-16 h-6 lg:h-10 bg-[#FAFAFA] rounded-lg p-2 border border-[#CDCED1] flex items-center justify-center">
            <span className="text-[11px] font-semibold text-[#4E4F52]">
              {getPaymentProviderLabel()}
            </span>
          </div>
          <p className="font-bold text-lg">{getPaymentProviderLabel()}</p>
        </div>
        <div className="flex flex-col justify-center items-center gap-4 bg-[#FAFAFA] rounded-lg lg:p-26 p-12">
          <ArrowRight className="font-bold lg:w-12 lg:h-12 h-8 w-8" />
          <p className="text-[#4E4F52]">{getPaymentRedirectCopy()}</p>
        </div>
      </div>

      {/* Price breakdown */}
      <p className="font-bold text-lg lg:text-xl text-[#181818] py-3">
        Price summary
      </p>
      <div className="border-[#CDCED1] lg:border rounded-lg p-5 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <p className="text-sm text-[#4E4F52]">Transfer fare</p>
          <p className="text-sm text-[#181818]">{symbol}{fmt(base)}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-[#4E4F52]">Taxes</p>
          <p className="text-sm text-[#181818]">{symbol}{fmt(tax)}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-[#4E4F52]">Service fees</p>
          <p className="text-sm text-[#181818]">{symbol}{fmt(fees)}</p>
        </div>
        <Divider />
        <div className="flex justify-between items-center">
          <p className="font-semibold text-[#181818]">Total</p>
          <p className="font-bold text-[#181818]">{symbol}{fmt(total)}</p>
        </div>
      </div>

      <Divider sx={{ marginTop: "8px", marginBottom: "8px" }} className="lg:hidden" />

      <div className="px-6 mt-5">
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.agreement}
              onChange={handleCheckboxChange}
            />
          }
          label={
            <p className="text-[11px]">
              I agree to the{" "}
              <span className="text-[#023E8A]">
                booking conditions, TravelMate terms and conditions, and Privacy Policy.
              </span>
            </p>
          }
        />
      </div>
    </div>
  );
};

export default PaymentMethod;
