import React from "react";
import type { QuotePricing } from "../../types";

interface PriceSummaryProps {
  roomType?: string;
  pricing?: QuotePricing | null;
  nights?: number;
  numberOfRooms?: number;
  currency?: string;
}

const PriceSummary: React.FC<PriceSummaryProps> = ({
  pricing,
  nights,
  numberOfRooms,
  roomType,
  currency,
}) => {
  const formatAmount = (value?: number) =>
    value != null
      ? `${currency ?? pricing?.currency ?? ""} ${value.toLocaleString()}`
      : "--";

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2 ml-3">Price Summary</h2>
      <div className="bg-white px-4 py-2 sm:p-6 w-full h-50 border-t border-b md:border md:rounded-lg border-gray-300">
        <div className="space-y-3">
          <p className="flex justify-between gap-4">
            <span className="font-medium">{roomType ?? "Price"}</span>
            <span>{formatAmount(pricing?.base)}</span>
          </p>
          <p className="text-gray-500 text-sm">
            {numberOfRooms ?? 1} {(numberOfRooms ?? 1) === 1 ? "Room" : "Rooms"} * {nights ?? 1}{" "}
            Night{(nights ?? 1) === 1 ? "" : "s"}
          </p>

          <p className="flex justify-between text-sm text-gray-500">
            <span>Taxes & Fees</span>
            <span>{formatAmount((pricing?.tax ?? 0) + (pricing?.fees ?? 0))}</span>
          </p>

          <p className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span className="text-[#023E8A]">{formatAmount(pricing?.total)}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PriceSummary;
