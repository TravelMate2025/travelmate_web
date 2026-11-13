import { Link } from "react-router-dom";
import Footer from "../../../components/2Footer";
import { usePageMeta } from "../../../hooks/usePageMeta";
import Navbar from "../../../pages/homePage/Navbar";
import { bookingSteps } from "../booking/bookingStatus";
import { FareUnavailable } from "../components/fare/FareUnavailable";
import { HoldOutcome } from "../components/pay/HoldOutcome";
import { FailedAfterPayment } from "../components/status/FailedAfterPayment";
import { ProgressList, ReferenceBoxes, StatusHero, TripCard } from "../components/status/StatusParts";
import { useBookingStatusPage } from "../hooks/useBookingStatusPage";
import { flightStepPath } from "../../shared/bookingFlowRoutes";

// /flights/bookings/:bookingId/status (mock: Status). Signed-in only (App.tsx).
const HEROES = {
  "confirming-payment": { tone: "blue", title: "Confirming your payment", text: "We're waiting for Flutterwave to confirm it. This usually takes a few seconds." },
  issuing: { tone: "blue", title: "Booking confirmed, ticket on the way", text: "Your seats are booked. We’re issuing your e-ticket now." },
  ticketed: { tone: "green", title: "You’re all set", text: "Your e-ticket is issued and in your email." },
} as const;

const BUTTON = "inline-flex min-h-12.5 items-center rounded-xl px-6 font-bold no-underline";

const FlightBookingStatusPage = () => {
  usePageMeta({ title: "Your booking | TravelMate", description: "Payment, booking and e-ticket progress for your flight." });
  const page = useBookingStatusPage();
  const { booking, view } = page;

  return (
    <div className="min-h-screen bg-[#F4F6FA] text-[#181818]">
      <Navbar />
      <div className="pt-20">
        {view === "failed-after-payment" && booking ? (
          <FailedAfterPayment booking={booking} findAnotherTo={page.resultsPath} />
        ) : view === "expired" && booking ? (
          <HoldOutcome
            kind="expired"
            offer={booking.offer}
            travellers={`${booking.travelers.length} ${booking.travelers.length === 1 ? "traveller" : "travellers"}`}
            wasPrice={booking.total.amount}
            checkAgainTo={flightStepPath("flightFare", booking.offer.offerToken)}
            otherFlightsTo={page.resultsPath}
          />
        ) : (
          <main className="mx-auto flex max-w-[55rem] flex-col gap-5 px-6 pb-16 pt-8">
            {view === "error" ? (
              <FareUnavailable error={page.error} onSeeOtherFlights={page.retry} onRetry={page.retry} />
            ) : !booking || !(view in HEROES) ? (
              <div role="status" aria-live="polite" className="flex flex-col gap-4">
                <p className="text-sm font-semibold text-[#4E4F52]">Loading your booking…</p>
                <div aria-hidden className="h-72 animate-pulse rounded-[1.25rem] border border-[#DEDFE1] bg-white" />
              </div>
            ) : (
              <>
                <section
                  aria-live="polite"
                  aria-label="Booking status"
                  className="flex flex-col gap-4.5 rounded-[1.25rem] border border-[#DEDFE1] bg-white p-7"
                >
                  <StatusHero {...HEROES[view as keyof typeof HEROES]} />
                  <ReferenceBoxes booking={booking} />
                  <ProgressList steps={bookingSteps(booking)} label="Booking progress" />
                </section>
                <TripCard booking={booking} />
                <div className="flex flex-wrap gap-3">
                  <Link to={page.managePath} className={`${BUTTON} bg-[#023E8A] text-white`}>
                    Manage booking
                  </Link>
                  <button type="button" onClick={page.addToCalendar} className={`${BUTTON} cursor-pointer border-2 border-[#023E8A] bg-white text-[#023E8A]`}>
                    Add to calendar
                  </button>
                </div>
              </>
            )}
          </main>
        )}
      </div>
      <Footer />
    </div>
  );
};

// Default export for React.lazy in App.tsx
export default FlightBookingStatusPage;
