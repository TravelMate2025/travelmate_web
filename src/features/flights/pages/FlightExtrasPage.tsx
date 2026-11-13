import { Link } from "react-router-dom";
import Footer from "../../../components/2Footer";
import { usePageMeta } from "../../../hooks/usePageMeta";
import Navbar from "../../../pages/homePage/Navbar";
import { continueToPaymentLabel } from "../../shared/booking/bookingFlowLabels";
import { BookingSteps } from "../components/BookingSteps";
import { BagGroupCard, ExtrasSummary, IncludedBags } from "../components/extras/ExtrasParts";
import { useExtrasPage } from "../hooks/useExtrasPage";

// /flights/extras?offer=… (mock: Extras). Step 4; signed-in only (App.tsx).
// The mock's "Seat selection" card is R3 and left out.
const FlightExtrasPage = () => {
  usePageMeta({ title: "Add extra bags | TravelMate", description: "Add checked bags to your flight before you pay." });
  const page = useExtrasPage();

  return (
    <div className="min-h-screen bg-[#F4F6FA] text-[#181818]">
      <Navbar />
      <div className="mx-auto flex max-w-[77.5rem] flex-col gap-5 px-6 pb-16 pt-28">
        <BookingSteps current="extras" backTo={{ flight: page.resultsPath, fare: page.farePath, travellers: page.travellersPath }} />
        {!page.offer ? (
          <div role="status" aria-live="polite" className="h-80 animate-pulse rounded-2xl border border-[#DEDFE1] bg-white" />
        ) : (
          <div className="flex flex-wrap items-start gap-6">
            <main className="flex min-w-0 flex-[999_1_40rem] flex-col gap-5">
              <div>
                <h1 className="mb-1.5 text-[1.75rem] font-bold">Add extra bags</h1>
                <p className="text-[0.9375rem] text-[#4E4F52]">
                  Cheaper now than at the airport. Bags can't be added after booking through TravelMate, so add them here if you need them.
                </p>
              </div>
              {page.included && <IncludedBags brand={page.included.brand} text={page.included.text} />}
              {page.groups.map((group) => (
                <BagGroupCard key={group.key} group={group} chosenIds={page.chosen} onChoose={(id) => page.choose(group, id)} />
              ))}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Link to={page.travellersPath} className="inline-flex min-h-11 items-center font-semibold text-[#023E8A]">
                  ← Back to travellers
                </Link>
                <button
                  type="button"
                  onClick={page.continueToPay}
                  className="inline-flex min-h-13 cursor-pointer items-center rounded-xl border-0 bg-[#023E8A] px-8 text-base font-extrabold text-white hover:bg-[#012A5D]"
                >
                  {continueToPaymentLabel()}
                </button>
              </div>
            </main>
            <ExtrasSummary passengers={page.passengers} flights={page.flightsPrice} extras={page.extras} total={page.total} currency={page.currency} />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

// Default export for React.lazy in App.tsx
export default FlightExtrasPage;
