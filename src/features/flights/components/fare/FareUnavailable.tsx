import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import type { FlightError } from "../../slice";

// Mock (BookingFailed, before payment): "These seats are no longer available".
// Also covers an offer that's too old to price, and other errors (with retry).
interface FareUnavailableProps {
  error: FlightError | null;
  onSeeOtherFlights: () => void;
  onRetry: () => void;
}

export const FareUnavailable = ({ error, onSeeOtherFlights, onRetry }: FareUnavailableProps) => {
  const soldOut = error?.code === "OFFER_UNAVAILABLE";
  const expired = error?.code === "OFFER_EXPIRED" || error?.code === "SEARCH_EXPIRED";
  const title = soldOut
    ? "These seats are no longer available"
    : expired
      ? "This price has expired"
      : "We couldn't check this price";
  const body = soldOut
    ? "The airline sold the last seats at this price while you were booking. You haven't been charged."
    : expired
      ? "Fares change, so prices from a search only last a short time. Search again to see current prices."
      : (error?.message ?? "Something went wrong. Please try again.");

  return (
    <section role="alert" className="flex flex-col items-start gap-4 rounded-2xl border border-[#DEDFE1] bg-white p-7">
      <span className="inline-flex h-13 w-13 items-center justify-center rounded-full bg-[#FFF1E8] text-[#9A3412]">
        <ErrorOutlineIcon aria-hidden />
      </span>
      <div>
        <h1 className="mb-2 text-2xl font-bold text-[#181818]">{title}</h1>
        <p className="text-[0.9375rem] text-[#4E4F52]">{body}</p>
      </div>
      <div className="flex flex-wrap gap-2.5">
        <button type="button" onClick={onSeeOtherFlights} className="min-h-13 cursor-pointer rounded-xl bg-[#023E8A] px-6 font-extrabold text-white">
          {expired ? "Search again" : "See other flights"}
        </button>
        {!soldOut && !expired && (
          <button type="button" onClick={onRetry} className="min-h-13 cursor-pointer rounded-xl border-2 border-[#023E8A] bg-white px-6 font-bold text-[#023E8A]">
            Try again
          </button>
        )}
      </div>
    </section>
  );
};
