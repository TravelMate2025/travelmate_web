import { bagsText } from "../../booking/bags";
import { formatMoney } from "../../currency";
import { cabinLabel, passengersSummary } from "../../search/searchDraft";
import type { FlightBooking, PassengerCounts, PayableAmount } from "../../types";

// Mock (Pay aside, "Price summary"): flights, extra bags, total, "price locked"
// and the reservation reference.
const LINE = "flex justify-between gap-3 text-[0.9375rem]";

const countsOf = (booking: FlightBooking): PassengerCounts => ({
  adults: booking.travelers.filter((t) => t.type === "ADULT").length,
  children: booking.travelers.filter((t) => t.type === "CHILD").length,
  heldInfants: booking.travelers.filter((t) => t.type === "HELD_INFANT").length,
  seatedInfants: booking.travelers.filter((t) => t.type === "SEATED_INFANT").length,
});

export const PriceSummary = ({ booking, payable }: { booking: FlightBooking; payable: PayableAmount }) => {
  const segment = booking.offer.itineraries[0].segments[0];
  const brand = segment.brandedFare ?? cabinLabel(segment.cabin);
  return (
    <aside aria-label="Price summary" className="flex flex-[1_1_18.75rem] flex-col gap-2.5 self-start rounded-2xl border border-[#DEDFE1] bg-white p-5">
      <h2 className="mb-1 text-[1.0625rem] font-bold text-[#181818]">Price summary</h2>
      <div className={LINE}>
        <span>
          Flights · {passengersSummary(countsOf(booking))} · {brand}
        </span>
        <span>{formatMoney(payable.flights, payable.currency)}</span>
      </div>
      <div className={LINE}>
        <span>Extra bags{booking.bags.length > 0 ? ` · ${bagsText(booking.bags, booking.offer)}` : ""}</span>
        <span>{formatMoney(payable.bags, payable.currency)}</span>
      </div>
      <div className={`${LINE} mt-1 border-0 border-t border-t-[#EBECED] pt-2.5 text-xl font-extrabold`}>
        <span>Total</span>
        <span>{formatMoney(payable.total, payable.currency)}</span>
      </div>
      <div className="rounded-[0.625rem] bg-[#EAF6EF] px-3 py-2.5 text-sm text-[#145A33]">
        <strong>Price locked</strong> while your seats are held.
      </div>
      {booking.pnr && (
        <div className="text-[0.8125rem] text-[#4E4F52]">
          Reservation: <strong className="text-[#181818]">{booking.pnr}</strong> (held, not yet ticketed)
        </div>
      )}
    </aside>
  );
};
