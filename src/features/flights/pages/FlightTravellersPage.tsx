import { Link } from "react-router-dom";
import Footer from "../../../components/2Footer";
import { usePageMeta } from "../../../hooks/usePageMeta";
import Navbar from "../../../pages/homePage/Navbar";
import { flightStepTitle } from "../../shared/booking/bookingFlowLabels";
import { BookingSteps } from "../components/BookingSteps";
import { FareUnavailable } from "../components/fare/FareUnavailable";
import { ContactCard } from "../components/travellers/ContactCard";
import { TravellerCard } from "../components/travellers/TravellerCard";
import { TripSummary } from "../components/travellers/TripSummary";
import { useTravellersPage } from "../hooks/useTravellersPage";
import { requirementFor } from "../travellers/travellerForm";
import type { Carrier } from "../types";

// /flights/travellers?offer=… (mock: Travelers). Step 3; signed-in only (App.tsx).
const FlightTravellersPage = () => {
  usePageMeta({
    title: "Traveller details | TravelMate",
    description: "Enter traveller names exactly as on the passport, and contact details for your e-ticket.",
  });
  const page = useTravellersPage();
  const { offer, form, result } = page;
  const airlines: Carrier[] = offer
    ? [...new Map(offer.itineraries.flatMap((it) => it.segments.map((s) => [s.marketing.code, { code: s.marketing.code, name: s.marketing.name }]))).values()]
    : [];

  return (
    <div className="min-h-screen bg-[#F4F6FA] text-[#181818]">
      <Navbar />
      <div className="mx-auto flex max-w-[77.5rem] flex-col gap-5 px-6 pb-16 pt-28">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <BookingSteps current="travellers" backTo={{ flight: page.resultsPath, fare: page.farePath }} />
          {page.signedInAs && (
            <span className="text-sm text-[#4E4F52]">
              Signed in as <strong className="text-[#181818]">{page.signedInAs}</strong>
            </span>
          )}
        </div>

        {page.status === "failed" ? (
          <FareUnavailable error={page.error} onSeeOtherFlights={page.seeOtherFlights} onRetry={page.retry} />
        ) : !offer || !form || !result ? (
          <div role="status" aria-live="polite" className="flex flex-col gap-4">
            <p className="text-sm font-semibold text-[#4E4F52]">Getting the airline's booking requirements…</p>
            <div aria-hidden className="h-80 animate-pulse rounded-2xl border border-[#DEDFE1] bg-white" />
          </div>
        ) : (
          <div className="flex flex-wrap items-start gap-6">
            <main className="flex min-w-0 flex-[999_1_40rem] flex-col gap-5">
              <div>
                <h1 className="mb-1.5 text-[1.75rem] font-bold">{flightStepTitle("travellers")}</h1>
                <p className="text-[0.9375rem] text-[#4E4F52]">
                  Enter names exactly as they appear on the passport. We only ask for what this airline needs.{" "}
                  <span className="text-[#B42318]">*</span> = required.
                </p>
              </div>

              <form
                noValidate
                onSubmit={(e) => {
                  e.preventDefault();
                  page.submit();
                }}
                className="flex flex-col gap-5"
              >
                {form.travellers.map((t, index) => (
                  <TravellerCard
                    key={t.travelerId}
                    index={index}
                    travellers={form.travellers}
                    requirement={requirementFor(result.requirements, t.travelerId)}
                    errors={page.errors}
                    airlines={airlines}
                    showProfileButton={index === 0 && page.profileAvailable}
                    onChange={(patch) => page.updateTraveller(t.travelerId, patch)}
                    onUseProfile={page.fillFromProfile}
                    onShortenNames={() => page.shortenNames(t.travelerId)}
                  />
                ))}
                <ContactCard
                  contact={form.contact}
                  emailRequired={result.requirements.emailRequired}
                  mobileRequired={result.requirements.mobileRequired}
                  errors={page.errors}
                  onChange={page.updateContact}
                />
                {Object.keys(page.errors).length > 0 && (
                  <p role="alert" className="text-sm font-semibold text-[#B42318]">
                    Please check the highlighted details.
                  </p>
                )}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Link to={page.farePath} className="inline-flex min-h-11 items-center font-semibold text-[#023E8A]">
                    ← Back to fares
                  </Link>
                  <button
                    type="submit"
                    className="inline-flex min-h-13 cursor-pointer items-center rounded-xl bg-[#023E8A] px-8 text-base font-extrabold text-white hover:bg-[#012A5D]"
                  >
                    {page.continueLabel}
                  </button>
                </div>
              </form>
            </main>
            <TripSummary offer={offer} />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

// Default export for React.lazy in App.tsx
export default FlightTravellersPage;
