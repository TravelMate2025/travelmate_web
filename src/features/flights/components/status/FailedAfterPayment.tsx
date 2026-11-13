import { Link } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { bookingFlowRoutes } from "../../../shared/bookingFlowRoutes";
import { refundSteps } from "../../booking/bookingStatus";
import { formatMoney } from "../../currency";
import type { FlightBooking } from "../../types";
import { offerSummary, tripLine } from "../fare/fareCards";
import { ProgressList } from "./StatusParts";

// Mock (BookingFailed, after payment): paid, but the airline didn't confirm.
// The full refund starts automatically; this shows its progress.
export const FailedAfterPayment = ({ booking, findAnotherTo }: { booking: FlightBooking; findAnotherTo: string }) => {
  const [, airline, fare] = offerSummary(booking.offer).split(" · ");
  const refund = booking.refund?.amount ?? booking.payment?.amount ?? booking.total;
  return (
    <main className="mx-auto flex w-full max-w-[42.5rem] flex-col gap-5 px-6 pb-16 pt-14">
      <span className="inline-flex h-15 w-15 items-center justify-center self-center rounded-full bg-[#FDECEA] text-[#B42318]">
        <ErrorOutlineIcon aria-hidden />
      </span>
      <h1 className="text-center text-[1.75rem] font-bold text-[#181818]">We couldn’t complete your booking</h1>
      <p className="text-center text-[#4E4F52]">
        Your payment went through, but the airline didn’t confirm the booking. We’ve started a full refund. You don’t need to do anything.
      </p>
      <section aria-label="Refund" className="flex flex-col gap-3.5 rounded-2xl border border-[#DEDFE1] bg-white p-5.5">
        <div className="flex flex-wrap justify-between gap-3">
          <strong>Full refund</strong>
          <strong>{formatMoney(refund.amount, refund.currency)}</strong>
        </div>
        <ProgressList steps={refundSteps(booking)} label="Refund progress" compact />
        <div className="text-[0.8125rem] text-[#4E4F52]">Reference: {booking.reference} · We've emailed you the details.</div>
      </section>
      <section className="flex flex-col gap-1.5 rounded-2xl border border-[#DEDFE1] bg-white p-5">
        <div className="font-extrabold text-[#181818]">{tripLine(booking.offer)}</div>
        <div className="text-sm text-[#4E4F52]">
          {airline} · {fare} · {booking.travelers.length} {booking.travelers.length === 1 ? "traveller" : "travellers"}
        </div>
      </section>
      <Link to={findAnotherTo} className="flex min-h-13 items-center justify-center rounded-xl bg-[#023E8A] font-extrabold text-white no-underline">
        Find another flight
      </Link>
      <Link
        to={bookingFlowRoutes.supportChat}
        className="flex min-h-13 items-center justify-center rounded-xl border-2 border-[#023E8A] font-bold text-[#023E8A] no-underline"
      >
        Contact support
      </Link>
    </main>
  );
};
