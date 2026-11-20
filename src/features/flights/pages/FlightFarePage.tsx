import { Link } from "react-router-dom";
import Footer from "../../../components/2Footer";
import { usePageMeta } from "../../../hooks/usePageMeta";
import Navbar from "../../../pages/homePage/Navbar";
import { flightStepTitle } from "../../shared/booking/bookingFlowLabels";
import { BookingSteps } from "../components/BookingSteps";
import { FareCard } from "../components/fare/FareCard";
import { buildFareCards, offerSummary } from "../components/fare/fareCards";
import { FareSummaryBar } from "../components/fare/FareSummaryBar";
import { FareUnavailable } from "../components/fare/FareUnavailable";
import { PriceChangedDialog } from "../components/fare/PriceChangedDialog";
import { PriceConfirmed } from "../components/fare/PriceConfirmed";
import { SelectedFlight } from "../components/fare/SelectedFlight";
import { useFarePage } from "../hooks/useFarePage";
import { passengersSummary } from "../search/searchDraft";
import { SELLING_CURRENCIES, type CurrencyCode } from "../types";

// /flights/fare?offer=… (mock: Fares, PriceChanged). Step 2 of the booking.
const FlightFarePage = () => {
  usePageMeta({
    title: "Choose your fare | TravelMate",
    description: "Compare what each fare includes and confirm your price with the airline.",
  });
  const page = useFarePage();
  const { offer, result } = page;
  const loading = page.status === "loading" || page.status === "idle";
  const cards = offer ? buildFareCards(page.options, offer, page.isChosen) : [];
  const chosen = cards.find((c) => c.selected) ?? cards[0];
  const travellersLabel = page.passengers ? passengersSummary(page.passengers) : "1 adult";
  const trip = offer && offer.itineraries.length === 2 ? "round trip" : offer && offer.itineraries.length > 2 ? "whole trip" : "one-way";
  const several = cards.length > 1;

  return (
    <div className="min-h-screen bg-[#F4F6FA] text-[#181818]">
      <Navbar />
      <main className="mx-auto flex max-w-[77.5rem] flex-col gap-5 px-6 pb-16 pt-28">
        <Link to={page.resultsPath} className="inline-flex min-h-11 items-center self-start text-[0.9375rem] font-semibold text-[#023E8A]">
          ← Back to results
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <BookingSteps current="fare" backTo={{ flight: page.resultsPath }} />
          <select
            aria-label="Currency"
            value={page.currency}
            onChange={(event) => page.setCurrency(event.target.value as CurrencyCode)}
            className="min-h-11 cursor-pointer rounded-full border border-[#CDCED1] bg-white px-3.5 text-sm font-semibold"
          >
            {SELLING_CURRENCIES.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>

        {page.status === "failed" ? (
          <FareUnavailable error={page.error} onSeeOtherFlights={page.seeOtherFlights} onRetry={page.retry} />
        ) : !offer ? (
          <div role="status" aria-live="polite" className="flex flex-col gap-4">
            <p className="text-sm font-semibold text-[#4E4F52]">Checking your price with the airline…</p>
            <div aria-hidden className="h-36 animate-pulse rounded-2xl border border-[#DEDFE1] bg-white" />
            <div aria-hidden className="grid grid-cols-[repeat(auto-fit,minmax(17.5rem,1fr))] gap-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-96 animate-pulse rounded-2xl border border-[#DEDFE1] bg-white" />
              ))}
            </div>
          </div>
        ) : (
          <>
            <SelectedFlight offer={offer} />
            <PriceConfirmed change={result?.priceChange ?? null} />
            <h1 className="mt-1 text-[1.75rem] font-bold tracking-tight">{flightStepTitle("fare")}</h1>
            <p className="text-[0.9375rem] text-[#4E4F52]">
              {several ? "Same flights, different flexibility. " : ""}
              Prices are per adult, {trip}.
            </p>
            <div role="radiogroup" aria-label="Fare options" className="grid grid-cols-[repeat(auto-fit,minmax(17.5rem,1fr))] gap-4">
              {page.options === null
                ? [0, 1, 2].map((i) => <div key={i} aria-hidden className="h-96 animate-pulse rounded-2xl border border-[#DEDFE1] bg-white" />)
                : cards.map((card) => (
                    <FareCard
                      key={card.key}
                      name={card.name}
                      tagline={card.tagline}
                      price={card.price}
                      difference={card.difference}
                      rows={card.rows}
                      selected={card.selected}
                      badge={card.badge}
                      disabled={loading}
                      onSelect={() => card.option && page.chooseFare(card.option)}
                    />
                  ))}
            </div>
            {chosen && (
              <FareSummaryBar
                fareName={chosen.name}
                travellersLabel={travellersLabel}
                total={{ amount: offer.price.amount, currency: offer.price.currency }}
                rows={chosen.rows}
                rules={result?.fareRules ?? []}
                onContinue={page.continueToTravellers}
                busy={loading}
              />
            )}
            {result?.priceChange && (
              <PriceChangedDialog
                open={page.priceRose}
                change={result.priceChange}
                summary={`${offerSummary(offer)} · ${travellersLabel}`}
                airline={offer.validatingAirline.name}
                onContinue={page.acceptNewPrice}
                onSeeOtherFlights={page.seeOtherFlights}
              />
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

// Default export for React.lazy in App.tsx
export default FlightFarePage;
