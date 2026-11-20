import Footer from "../../../components/2Footer";
import { usePageMeta } from "../../../hooks/usePageMeta";
import Navbar from "../../../pages/homePage/Navbar";
import { flightStepTitle } from "../../shared/booking/bookingFlowLabels";
import { BookingSteps } from "../components/BookingSteps";
import { FareUnavailable } from "../components/fare/FareUnavailable";
import { offerSummary } from "../components/fare/fareCards";
import { PriceChangedDialog } from "../components/fare/PriceChangedDialog";
import { HoldOutcome } from "../components/pay/HoldOutcome";
import { HoldTimerBar } from "../components/pay/HoldTimerBar";
import { PaymentCard } from "../components/pay/PaymentCard";
import { PriceSummary } from "../components/pay/PriceSummary";
import { FareConditionsCard, ReviewFlightsCard, ReviewTravellersCard } from "../components/pay/ReviewCards";
import { useReviewPayPage } from "../hooks/useReviewPayPage";
import { passengersSummary } from "../search/searchDraft";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";

// /flights/review?offer=… (mock: Pay, HoldExpired, BookingFailed before payment).
// Final step; signed-in only (App.tsx).
const FlightReviewPayPage = () => {
  usePageMeta({
    title: "Review and pay | TravelMate",
    description: "Check your flights, travellers and fare conditions, then pay securely with Flutterwave.",
  });
  const page = useReviewPayPage();
  const priceCheckOffer = useSelector((state: RootState) => state.flights.priceCheck.result?.offer ?? null);
  const passengers = useSelector((state: RootState) => state.flights.criteria?.passengers ?? null);
  const { booking } = page;
  const travellersLabel = passengers ? passengersSummary(passengers) : `${booking?.travelers.length ?? 1} travellers`;
  const steps = (
    <BookingSteps current="pay" backTo={{ flight: page.resultsPath, fare: page.farePath, travellers: page.travellersPath }} />
  );

  return (
    <div className="min-h-screen bg-[#F4F6FA] text-[#181818]">
      <Navbar />
      <div className="pt-20">
        {page.view === "held" && booking && <HoldTimerBar secondsLeft={page.secondsLeft} />}

        {page.view === "expired" || page.view === "unavailable" ? (
          <HoldOutcome
            kind={page.view}
            offer={booking?.offer ?? priceCheckOffer}
            travellers={travellersLabel}
            wasPrice={booking?.total.amount ?? null}
            checkAgainTo={page.farePath}
            otherFlightsTo={page.resultsPath}
          />
        ) : (
          <div className="mx-auto flex max-w-[77.5rem] flex-col gap-5 px-6 pb-16 pt-6">
            {steps}
            {page.view === "error" ? (
              <FareUnavailable error={page.error} onSeeOtherFlights={page.releaseAndSeeOtherFlights} onRetry={page.retry} />
            ) : page.view === "holding" || !booking || !page.payable ? (
              <div role="status" aria-live="polite" className="flex flex-col gap-4">
                <p className="text-sm font-semibold text-[#4E4F52]">Holding your seats with the airline…</p>
                <div aria-hidden className="h-64 animate-pulse rounded-2xl border border-[#DEDFE1] bg-white" />
              </div>
            ) : (
              <div className="flex flex-wrap items-start gap-6">
                <main className="flex min-w-0 flex-[999_1_40rem] flex-col gap-4.5">
                  <h1 className="text-[1.75rem] font-bold">{flightStepTitle("pay")}</h1>
                  <ReviewFlightsCard offer={booking.offer} changeTo={page.resultsPath} />
                  <ReviewTravellersCard travelers={booking.travelers} contact={booking.contact} editTo={page.travellersPath} />
                  <FareConditionsCard offer={booking.offer} rules={page.fareRules} />
                  <PaymentCard
                    payable={booking.payable}
                    currency={page.payCurrency}
                    bookedCurrency={booking.total.currency}
                    onCurrencyChange={page.setPayCurrency}
                    agreed={page.agreed}
                    onAgreedChange={page.setAgreed}
                    onPay={page.pay}
                    paying={page.paying}
                    error={page.payError}
                  />
                </main>
                <PriceSummary booking={booking} payable={page.payable} />
              </div>
            )}
          </div>
        )}

        {booking?.priceChange && (
          <PriceChangedDialog
            open={page.priceChangePending && page.view === "held"}
            change={booking.priceChange}
            summary={`${offerSummary(booking.offer)} · ${travellersLabel}`}
            airline={booking.offer.validatingAirline.name}
            onContinue={page.acceptPriceChange}
            onSeeOtherFlights={page.releaseAndSeeOtherFlights}
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

// Default export for React.lazy in App.tsx
export default FlightReviewPayPage;
