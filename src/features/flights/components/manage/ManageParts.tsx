import { Link } from "react-router-dom";
import { format } from "date-fns";
import { bookingFlowRoutes } from "../../../shared/bookingFlowRoutes";
import { bagsText } from "../../booking/bags";
import { refundSteps } from "../../booking/bookingStatus";
import { cancelCopy, fareLines } from "../../booking/manage";
import { formatMoney } from "../../currency";
import type { FlightsState } from "../../slice";
import { dayDifference, localDate, timeOf } from "../../results/offerFacts";
import { cabinLabel } from "../../search/searchDraft";
import { titleCase } from "../../travellers/names";
import type { BagOption, FlightBooking, FlightOffer } from "../../types";
import { CARD, TITLE } from "../pay/ReviewCards";
import { ProgressList } from "../status/StatusParts";

// Pieces of the Manage page (mock: Manage).
const HINT = "text-[0.8125rem] text-[#4E4F52]";
const LINE = "flex justify-between gap-3 text-[0.9375rem]";
const ACTION =
  "inline-flex min-h-11 cursor-pointer items-center rounded-[0.625rem] border border-[#CDCED1] bg-white px-4 text-[0.9375rem] font-semibold text-[#023E8A] no-underline disabled:cursor-wait disabled:opacity-60";

const directionLabel = (count: number, index: number) => (count === 2 ? (index === 0 ? "Outbound" : "Return") : count === 1 ? "Outbound" : `Flight ${index + 1}`);

const segmentState = (booking: FlightBooking) =>
  ["CANCELLED", "CANCELLATION_REQUESTED", "HOLD_EXPIRED", "FAILED"].includes(booking.status) ? "cancelled" : "confirmed";

interface ItineraryProps {
  booking: FlightBooking;
  downloading: boolean;
  onDownload: () => void;
  /** Shown when the booking can be cancelled and the cancel section is closed. */
  onCancel: (() => void) | null;
}

/** Mock: directions, references, e-tickets, then Download itinerary / Contact support. */
export const ItineraryCard = ({ booking, downloading, onDownload, onCancel }: ItineraryProps) => {
  const count = booking.offer.itineraries.length;
  return (
    <section aria-labelledby="manage-it-h" className={CARD}>
      <h2 id="manage-it-h" className={TITLE}>
        Itinerary
      </h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(16.25rem,1fr))] gap-3.5">
        {booking.offer.itineraries.map((it, index) => {
          const first = it.segments[0];
          const last = it.segments[it.segments.length - 1];
          const plus = dayDifference(first.from.atLocal, last.to.atLocal);
          return (
            <div key={index} className="rounded-xl bg-[#F4F6FA] p-3.5">
              <div className={`${HINT} font-bold uppercase`}>
                {directionLabel(count, index)} · {format(localDate(first.from.atLocal), "EEE d MMM")}
              </div>
              <div className="font-extrabold text-[#181818]">
                {timeOf(first.from.atLocal)} {first.from.iata} → {timeOf(last.to.atLocal)}
                {plus > 0 ? `+${plus}` : ""} {last.to.iata}
              </div>
              <div className={HINT}>
                {it.segments.map((s) => `${s.marketing.code}${s.marketing.number}`).join(" · ")} · {segmentState(booking)}
              </div>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(12.5rem,1fr))] gap-3">
        <div>
          <div className={HINT}>TravelMate booking</div>
          <div className="font-bold">{booking.reference}</div>
        </div>
        <div>
          <div className={HINT}>Airline reference</div>
          <div className="font-bold">{booking.pnr ?? "Pending"}</div>
        </div>
        {booking.travelers.map((t) => (
          <div key={t.travelerId}>
            <div className={HINT}>
              E-ticket · {titleCase(t.firstName)} {titleCase(t.lastName)}
            </div>
            <div className="font-bold">{t.ticketNumber ?? "Pending"}</div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2.5">
        <button type="button" onClick={onDownload} disabled={downloading} className={ACTION}>
          {downloading ? "Preparing PDF…" : "Download itinerary (PDF)"}
        </button>
        <Link to={bookingFlowRoutes.supportChat} className={ACTION}>
          Contact support
        </Link>
        {onCancel && (
          <button type="button" onClick={onCancel} className={`${ACTION} text-[#B42318]`}>
            Cancel booking
          </button>
        )}
      </div>
    </section>
  );
};

interface CancelProps {
  booking: FlightBooking;
  preview: FlightsState["cancellationPreview"];
  reasons: readonly string[];
  reason: string;
  onReason: (reason: string) => void;
  cancelling: boolean;
  error: string | null;
  onConfirm: () => void;
  onKeep: () => void;
}

/** Mock (Manage, "Before ticket issued" / "After ticket issued"): the refund, what happens next, reason, confirm. */
export const CancelCard = ({ booking, preview, reasons, reason, onReason, cancelling, error, onConfirm, onKeep }: CancelProps) => {
  const copy = preview.result ? cancelCopy(preview.result) : null;
  const waitingIntro =
    booking.status === "TICKETED"
      ? "Your ticket is issued. We’re checking what the airline refunds."
      : "Your ticket hasn’t been issued yet, so you can cancel now for a full refund.";
  return (
    <section id="manage-cancel" aria-labelledby="manage-cx-h" className={`${CARD} border-2 border-[#023E8A]`}>
      <h2 id="manage-cx-h" className={TITLE}>
        Cancel this booking
      </h2>
      <p className="text-[0.9375rem] text-[#4E4F52]">{copy?.intro ?? waitingIntro}</p>
      {preview.status === "failed" ? (
        <p role="alert" className="text-[0.9375rem] text-[#B42318]">
          {preview.error?.message ?? "We couldn't work out the refund. Please try again."}
        </p>
      ) : !copy ? (
        <div role="status" aria-label="Working out your refund" className="h-31 animate-pulse rounded-xl bg-[#F4F6FA]" />
      ) : (
        <>
          <div className="flex flex-col gap-2 rounded-xl bg-[#F4F6FA] p-4">
            {copy.lines.map((line) => (
              <div key={line.label} className={LINE}>
                <span>{line.label}</span>
                <span>{line.value}</span>
              </div>
            ))}
            <div className={`${LINE} border-0 border-t border-solid border-t-[#DEDFE1] pt-2 text-[1.1875rem] font-extrabold`}>
              <span>{copy.refundLabel}</span>
              <span>{copy.refundValue}</span>
            </div>
          </div>
          <ol className="m-0 flex list-decimal flex-col gap-1.5 pl-5 text-[0.9375rem]">
            {copy.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </>
      )}
      <label className="flex flex-col gap-1.5 text-sm font-semibold">
        Reason (optional)
        <select
          value={reason}
          onChange={(e) => onReason(e.target.value)}
          className="min-h-11.5 rounded-[0.625rem] border border-[#CDCED1] bg-white px-3 text-[0.9375rem] font-medium"
        >
          {reasons.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </label>
      {error && (
        <p role="alert" className="text-[0.9375rem] text-[#B42318]">
          {error}
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onConfirm}
          disabled={!copy || cancelling}
          className="min-h-12.5 cursor-pointer rounded-xl border-0 bg-[#B42318] px-5.5 text-[0.9375rem] font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {cancelling ? "Cancelling…" : (copy?.cta ?? "Cancel booking")}
        </button>
        <button
          type="button"
          onClick={onKeep}
          disabled={cancelling}
          className="min-h-12.5 cursor-pointer rounded-xl border-2 border-solid border-[#023E8A] bg-white px-5.5 text-[0.9375rem] font-bold text-[#023E8A]"
        >
          Keep my booking
        </button>
      </div>
    </section>
  );
};

/** After cancelling, or when the airline didn't confirm after payment: the refund and its progress. */
export const RefundCard = ({ booking }: { booking: FlightBooking }) => {
  if (!booking.refund) {
    return (
      <section aria-label="Payment" className={CARD}>
        <p className="text-[0.9375rem]">You weren’t charged for this booking.</p>
      </section>
    );
  }
  const { amount } = booking.refund;
  return (
    <section aria-label="Refund" className={CARD}>
      <div className="flex flex-wrap justify-between gap-3">
        <h2 className={TITLE}>
          {booking.status === "FAILED" ? "Full refund" : booking.refund.airlineConfirmed === false ? "Estimated refund" : "Your refund"}
        </h2>
        <strong className="text-[1.1875rem]">{formatMoney(amount.amount, amount.currency)}</strong>
      </div>
      <ProgressList steps={refundSteps(booking)} label="Refund progress" compact />
    </section>
  );
};

/** Mock: aside "Your fare · Eco Essential" with refunds, changes and bags. */
export const FareAside = ({ offer, bags }: { offer: FlightOffer; bags: BagOption[] }) => {
  const segment = offer.itineraries[0].segments[0];
  return (
    <aside
      aria-label="Fare conditions"
      className="flex flex-[1_1_18.75rem] flex-col gap-2.5 rounded-2xl border border-[#DEDFE1] bg-white p-5"
    >
      <h2 className="mb-1 text-[1.0625rem] font-bold text-[#181818]">Your fare · {segment.brandedFare ?? cabinLabel(segment.cabin)}</h2>
      {fareLines(offer).map((line) => (
        <div key={line.label} className={LINE}>
          <span>{line.label}</span>
          <strong>{line.value}</strong>
        </div>
      ))}
      {bags.length > 0 && (
        <div className={LINE}>
          <span>Extra bags</span>
          <strong className="text-right">{bagsText(bags, offer)}</strong>
        </div>
      )}
      <p className={`${HINT} mt-1`}>
        To change dates or names, contact support. Changes are handled with the airline and may cost a fee plus any fare difference.
      </p>
    </aside>
  );
};
