import { Link } from "react-router-dom";
import { flightsLandingPath } from "../../../shared/bookingFlowRoutes";
import type { FlightError } from "../../slice";
import type { FlightSearchResult } from "../../types";

const CARD = "rounded-2xl border border-gray-200 bg-white p-6";

interface ResultsStatusProps {
  status: "idle" | "loading" | "succeeded" | "failed";
  result: FlightSearchResult | null;
  error: FlightError | null;
  onRetry: () => void;
}

// W1: search states only. Phase W2 replaces the "found" state with the offer list.
export const ResultsStatus = ({ status, result, error, onRetry }: ResultsStatusProps) => {
  if (status === "loading" || status === "idle") {
    return (
      <div className={CARD} role="status" aria-live="polite">
        <p className="font-semibold text-[#181818]">Searching flights…</p>
        <p className="text-sm text-[#4E4F52]">We're checking airlines for the best prices.</p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className={CARD} role="alert">
        <p className="font-semibold text-[#181818]">We couldn't search flights</p>
        <p className="text-sm text-[#4E4F52]">{error?.message ?? "Something went wrong. Please try again."}</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 h-11 cursor-pointer rounded-xl bg-[#023E8A] px-5 font-semibold text-white"
        >
          Try again
        </button>
      </div>
    );
  }

  const count = result?.offers.length ?? 0;
  if (count === 0) {
    return (
      <div className={CARD} role="status">
        <p className="font-semibold text-[#181818]">No flights found</p>
        <p className="text-sm text-[#4E4F52]">
          Try different dates, a nearby airport, or allow flights with stops.
        </p>
        <Link to={flightsLandingPath()} className="mt-4 inline-block text-sm font-bold text-[#023E8A] hover:underline">
          Change search
        </Link>
      </div>
    );
  }

  return (
    <div className={CARD} role="status">
      <p className="font-semibold text-[#181818]">
        {count} {count === 1 ? "flight" : "flights"} found
      </p>
      <p className="text-sm text-[#4E4F52]">Flight cards, sorting and filters arrive in the next phase.</p>
    </div>
  );
};
