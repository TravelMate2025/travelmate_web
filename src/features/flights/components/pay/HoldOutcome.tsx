import { Link } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import { bookingFlowRoutes } from "../../../shared/bookingFlowRoutes";
import { formatMoney } from "../../currency";
import type { FlightOffer } from "../../types";
import { offerSummary, tripLine } from "../fare/fareCards";

// Mock HoldExpired ("Your seats were released") and BookingFailed before
// payment ("These seats are no longer available"): a centred 640px column.
const PRIMARY = "flex min-h-13 items-center justify-center rounded-xl bg-[#023E8A] font-extrabold text-white no-underline";
const SECONDARY = "flex min-h-13 items-center justify-center rounded-xl border-2 border-[#023E8A] font-bold text-[#023E8A] no-underline";

const fareLine = (offer: FlightOffer, travellers: string) => {
  const [, airline, fare] = offerSummary(offer).split(" · ");
  return `${airline} · ${fare} · ${travellers}`;
};

interface HoldOutcomeProps {
  kind: "expired" | "unavailable";
  offer: FlightOffer | null;
  travellers: string;
  /** Price before the hold ended (expired only). */
  wasPrice: string | null;
  checkAgainTo: string;
  otherFlightsTo: string;
}

export const HoldOutcome = ({ kind, offer, travellers, wasPrice, checkAgainTo, otherFlightsTo }: HoldOutcomeProps) => {
  const expired = kind === "expired";
  const airline = offer?.validatingAirline.name ?? "the airline";
  return (
    <main className="mx-auto flex w-full max-w-[40rem] flex-col gap-5 px-6 pb-16 pt-14">
      <span
        className={`inline-flex h-15 w-15 items-center justify-center self-center rounded-full ${expired ? "bg-[#E8EEF7] text-[#023E8A]" : "bg-[#FDECEA] text-[#B42318]"}`}
      >
        {expired ? <TimerOutlinedIcon aria-hidden /> : <ErrorOutlineIcon aria-hidden />}
      </span>
      <h1 className="text-center text-[1.75rem] font-bold text-[#181818]">
        {expired ? "Your seats were released" : "These seats are no longer available"}
      </h1>
      <p className="text-center text-[#4E4F52]">
        {expired
          ? `The time to pay ran out, so we cancelled the reservation with ${airline}. You haven't been charged.`
          : "The airline sold the last seats at this price while you were booking. You haven't been charged."}
      </p>
      {offer && (
        <section className="flex flex-col gap-1.5 rounded-2xl border border-[#DEDFE1] bg-white p-5">
          <div className="font-extrabold text-[#181818]">{tripLine(offer)}</div>
          <div className="text-sm text-[#4E4F52]">
            {fareLine(offer, travellers)}
            {expired && wasPrice ? ` · was ${formatMoney(wasPrice, offer.price.currency)}` : ""}
          </div>
          {expired && <div className="text-sm text-[#4E4F52]">Your traveller details are saved, so booking again is quick.</div>}
        </section>
      )}
      {expired ? (
        <>
          <Link to={checkAgainTo} className={PRIMARY}>
            Check this flight again
          </Link>
          <Link to={otherFlightsTo} className={SECONDARY}>
            See other flights
          </Link>
          <p className="text-center text-[0.8125rem] text-[#4E4F52]">Prices and seats are rechecked live. The fare may have changed.</p>
        </>
      ) : (
        <>
          <Link to={otherFlightsTo} className={PRIMARY}>
            Find another flight
          </Link>
          <Link to={bookingFlowRoutes.supportChat} className={SECONDARY}>
            Contact support
          </Link>
        </>
      )}
    </main>
  );
};
