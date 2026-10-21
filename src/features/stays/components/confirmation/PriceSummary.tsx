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
  const guestCount = booking?.guest_count ?? booking?.guestCount;
  return (
    <section className="rounded-2xl border border-[#dfe7f0] bg-white p-5 shadow-[0_10px_30px_rgba(16,42,67,0.05)] sm:p-6">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#023E8A]">Payment</p><h2 className="mt-1 text-xl font-semibold text-[#18202b]">Price summary</h2>
      <div className="mt-5 space-y-4">
          <div className="flex items-start justify-between gap-4 rounded-xl bg-[#f6f9fd] p-4">
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-[#18202b]">
                {numberOfRooms} {numberOfRooms === 1 ? "Room" : "Rooms"} *{" "}
                {nights} Nights
              </p>
              <p className="text-sm text-[#687382]">
                {priceLabel}{formattedPerNight} per night
              </p>
              {guestCount != null && <p className="text-xs text-[#8994a3]">{guestCount} guest{guestCount === 1 ? "" : "s"}</p>}
            </div>
            <p className="font-semibold text-[#18202b]">{priceLabel}{formattedTotal}</p>
          </div>
          <p className="flex justify-between border-t border-[#e7edf5] pt-4 text-base font-semibold text-[#18202b]">
            <span>Total paid</span><span className="text-lg text-[#023E8A]">
              {priceLabel}{formattedTotal}
            </span>
          </p>
      </div>
    </section>
  );
};

export default PriceSummary;
