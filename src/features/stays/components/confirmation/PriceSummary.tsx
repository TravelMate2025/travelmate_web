import React from "react";
import { BookingDetailsVerifyData } from "../../types";

interface PriceSummaryProps {
  booking: BookingDetailsVerifyData| undefined;
}

const text = (value: unknown, fallback = "") => {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return fallback;
};

const parseAmount = (...values: unknown[]) => {
  for (const value of values) {
    const raw = text(value, "");
    if (!raw) continue;
    const cleaned = raw.replace(/[^0-9.-]/g, "");
    if (!cleaned) continue;
    const parsed = Number(cleaned);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return null;
};

const getNestedAmount = (snapshot: Record<string, unknown>, key: string) => {
  const value = snapshot[key];
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return record.total ?? record.base ?? record.amount ?? record.value;
  }
  return value;
};

const PriceSummary: React.FC<PriceSummaryProps> = ({ booking }) => {
  const snapshot = booking?.bookingSnapshot ?? booking?.booking_snapshot ?? {};
  const numberOfRooms = booking?.rooms_details?.length ?? booking?.roomsDetails?.length ?? 1;
  const checkIn = text(
    booking?.check_in ?? (snapshot as Record<string, unknown>).checkIn ?? (snapshot as Record<string, unknown>).check_in,
  );
  const checkOut = text(
    booking?.check_out ?? (snapshot as Record<string, unknown>).checkOut ?? (snapshot as Record<string, unknown>).check_out,
  );
  const nights =
    checkIn &&
    checkOut
      ? Math.max(
          1,
          Math.ceil(
            (new Date(checkOut).getTime() -
              new Date(checkIn).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 1;
  const totalPrice = parseAmount(
    booking?.total_price,
    booking?.totalPrice,
    booking?.total_amount,
    (snapshot as Record<string, unknown>).totalPrice,
    (snapshot as Record<string, unknown>).total_price,
    (snapshot as Record<string, unknown>).totalAmount,
    (snapshot as Record<string, unknown>).total_amount,
    getNestedAmount(snapshot as Record<string, unknown>, "price"),
  );
  const perNight = totalPrice != null ? totalPrice / nights : null;
  const formattedTotal = totalPrice != null ? totalPrice.toLocaleString() : "--";
  const formattedPerNight = perNight != null ? perNight.toFixed(2) : "--";
  const currency = text(booking?.currency ?? (snapshot as Record<string, unknown>).currency ?? "");
  const priceLabel = currency ? `${currency} ` : "";
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2 ">Price Summary</h2>
      <div className="bg-white py-2  w-full lg:border-t border-b md:border md:rounded-lg border-gray-300 md:p-3">
        <div className="space-y-3">
          <div className="flex justify-between">
            <div className="flex flex-col gap-1">
              <p className="">
                {numberOfRooms} {numberOfRooms === 1 ? "Room" : "Rooms"} *{" "}
                {nights} Nights
              </p>
              <p className="text-gray-500 text-sm">
                {priceLabel}{formattedPerNight} per night
              </p>
            </div>
            {priceLabel}{formattedTotal}
          </div>

          <p className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span className="text-[#023E8A]">
              {priceLabel}{formattedTotal}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PriceSummary;
