import { Link } from "react-router-dom";
import Footer from "../../../components/2Footer";
import Navbar from "../../../pages/homePage/Navbar";
import { flightsLandingPath } from "../../shared/bookingFlowRoutes";
import { ResultsStatus } from "../components/results/ResultsStatus";
import { ResultsSummary } from "../components/results/ResultsSummary";
import { useFlightResults } from "../hooks/useFlightResults";

const FlightResultsPage = () => {
  const { criteria, title, status, result, error, retry } = useFlightResults();

  return (
    <div className="min-h-screen bg-[#F4F6FA]">
      <Navbar />
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pb-16 pt-28 sm:px-8">
        {criteria ? (
          <>
            <ResultsSummary title={title} criteria={criteria} />
            <ResultsStatus status={status} result={result} error={error} onRetry={retry} />
          </>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white p-6" role="alert">
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
