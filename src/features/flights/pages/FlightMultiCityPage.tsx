import Footer from "../../../components/2Footer";
import { usePageMeta } from "../../../hooks/usePageMeta";
import Navbar from "../../../pages/homePage/Navbar";
import { MultiCityResults } from "../components/results/MultiCityResults";
import { ResultsStatus } from "../components/results/ResultsStatus";
import { MultiCitySearchForm } from "../components/search/MultiCitySearchForm";
import { useFlightCurrency } from "../hooks/useFlightCurrency";
import { useFlightResults } from "../hooks/useFlightResults";
import { SELLING_CURRENCIES, type CurrencyCode } from "../types";

// /flights/multi-city: multi-city search and its results on one page (mock:
// MultiCity). No hero; the form sits at the top, results underneath once the
// search is in the URL.
const FlightMultiCityPage = () => {
  usePageMeta({
    title: "Multi-city Flights | TravelMate",
    description: "Search up to six flights in one trip and pay one price for the whole journey with TravelMate.",
  });
  const { criteria, places, status, result, error, retry, changeCurrency } = useFlightResults();
  const { currency } = useFlightCurrency();
  const hasSearch = criteria?.tripType === "MULTI_CITY";

  return (
    <div className="min-h-screen bg-[#F4F6FA] text-[#181818]">
      <Navbar />
      <main className="mx-auto flex max-w-[77.5rem] flex-col gap-5 px-6 pb-16 pt-28">
        {/* The mock shows the currency in the page header */}
        <div className="flex justify-end">
          <select
            aria-label="Currency"
            value={currency}
            onChange={(event) => changeCurrency(event.target.value as CurrencyCode)}
            className="min-h-11 cursor-pointer rounded-full border border-[#CDCED1] bg-white px-3.5 text-sm font-semibold"
          >
            {SELLING_CURRENCIES.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>
        <MultiCitySearchForm />
        {hasSearch &&
          (status === "succeeded" && result && result.offers.length > 0 ? (
            <MultiCityResults key={result.searchId} offers={result.offers} criteria={criteria} places={places} />
          ) : (
            <ResultsStatus status={status} result={result} error={error} onRetry={retry} />
          ))}
      </main>
      <Footer />
    </div>
  );
};

// Default export for React.lazy in App.tsx
export default FlightMultiCityPage;
