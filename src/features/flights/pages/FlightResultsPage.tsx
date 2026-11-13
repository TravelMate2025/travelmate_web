import { Link, Navigate, useLocation } from "react-router-dom";
import Footer from "../../../components/2Footer";
import { usePageMeta } from "../../../hooks/usePageMeta";
import Navbar from "../../../pages/homePage/Navbar";
import { bookingFlowRoutes, flightsLandingPath } from "../../shared/bookingFlowRoutes";
import { BookingSteps } from "../components/BookingSteps";
import { OfferResults } from "../components/results/OfferResults";
import { ResultsSearchBar } from "../components/results/ResultsSearchBar";
import { ResultsStatus } from "../components/results/ResultsStatus";
import { useFlightResults } from "../hooks/useFlightResults";

// /flights/results (mock: Results): search summary and currency, booking
// steps, then filters, sort tabs and offer cards.
const FlightResultsPage = () => {
  const { criteria, places, title, status, result, error, retry, changeCurrency } = useFlightResults();
  const { search } = useLocation();
  usePageMeta({
    title: title ? `${title} flights | TravelMate` : "Flight results | TravelMate",
    description: "Compare fares, bags and fare rules from full-service airlines, with prices including taxes and fees.",
  });

  // Multi-city searches and their results live on the multi-city page
  if (criteria?.tripType === "MULTI_CITY") {
    return <Navigate to={`${bookingFlowRoutes.flightMultiCity}${search}`} replace />;
  }

  const ready = status === "succeeded" && result && result.offers.length > 0;

  return (
    <div className="min-h-screen bg-[#F4F6FA] text-[#181818]">
      <Navbar />
      <main className="mx-auto flex max-w-[77.5rem] flex-col gap-5 px-6 pb-16 pt-28">
        {criteria ? (
          <>
            <ResultsSearchBar criteria={criteria} places={places} currency={criteria.currency} onCurrencyChange={changeCurrency} />
            <BookingSteps current="flight" />
            {ready ? (
              <OfferResults key={result.searchId} offers={result.offers} criteria={criteria} places={places} />
            ) : (
              <ResultsStatus status={status} result={result} error={error} onRetry={retry} />
            )}
          </>
        ) : (
          <div className="rounded-2xl border border-[#DEDFE1] bg-white p-6" role="alert">
            <p className="font-semibold text-[#181818]">This search link isn't complete</p>
            <p className="text-sm text-[#4E4F52]">Start a new flight search.</p>
            <Link to={flightsLandingPath()} className="mt-4 inline-block text-sm font-bold text-[#023E8A] hover:underline">
              Search flights
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

// Default export for React.lazy in App.tsx
export default FlightResultsPage;
