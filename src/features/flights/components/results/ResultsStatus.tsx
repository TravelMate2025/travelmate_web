import { Link } from "react-router-dom";
import { flightsLandingPath } from "../../../shared/bookingFlowRoutes";
import type { FlightError } from "../../slice";
import type { FlightSearchResult } from "../../types";

const CARD = "rounded-2xl border border-[#DEDFE1] bg-white p-6";

/** Placeholder cards while the search runs (same shape as the offer cards). */
const SkeletonCard = () => (
  <div aria-hidden className="flex animate-pulse flex-wrap gap-5 rounded-2xl border border-[#DEDFE1] bg-white p-5">
    <div className="flex flex-[999_1_30rem] flex-col gap-3.5">
      <div className="flex items-center gap-2.5">
        <span className="h-9 w-9 rounded-[0.625rem] bg-[#E8EEF7]" />
        <span className="h-4 w-40 rounded bg-gray-200" />
      </div>
      <span className="h-12 rounded bg-gray-100" />
      <span className="h-12 rounded bg-gray-100" />
    </div>
    <div className="flex flex-[1_1_11.25rem] flex-col items-end gap-3 border-0 border-l border-l-[#EBECED] pl-5">
      <span className="h-7 w-28 rounded bg-gray-200" />
      <span className="h-11.5 w-full rounded-xl bg-[#E8EEF7]" />
    </div>
  </div>
);

interface ResultsStatusProps {
  status: "idle" | "loading" | "succeeded" | "failed";
  result: FlightSearchResult | null;
  error: FlightError | null;
  onRetry: () => void;
}

/** Searching, failed and empty states. Returns null when there are offers to show. */
export const ResultsStatus = ({ status, result, error, onRetry }: ResultsStatusProps) => {
  if (status === "loading" || status === "idle") {
    return (
      <div className="flex flex-col gap-4" role="status" aria-live="polite">
        <p className="text-sm font-semibold text-[#4E4F52]">Searching flights…</p>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className={CARD} role="alert">
        <p className="font-semibold text-[#181818]">We couldn't search flights</p>
        <p className="text-sm text-[#4E4F52]">{error?.message ?? "Something went wrong. Please try again."}</p>
        <button type="button" onClick={onRetry} className="mt-4 min-h-11 cursor-pointer rounded-xl bg-[#023E8A] px-5 font-semibold text-white">
          Try again
        </button>
      </div>
    );
  }

  if (!result || result.offers.length === 0) {
    return (
      <div className={CARD} role="status">
        <p className="font-semibold text-[#181818]">No flights found</p>
        <p className="text-sm text-[#4E4F52]">Try different dates, a nearby airport, or allow flights with stops.</p>
        <Link to={flightsLandingPath()} className="mt-4 inline-block text-sm font-bold text-[#023E8A] hover:underline">
          Change search
        </Link>
      </div>
    );
  }

  return null;
};
