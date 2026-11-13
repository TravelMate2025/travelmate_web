import { Link } from "react-router-dom";
import Footer from "../../../components/2Footer";
import { usePageMeta } from "../../../hooks/usePageMeta";
import Navbar from "../../../pages/homePage/Navbar";
import { routeName, statusBadge, travellersText, tripDates } from "../booking/manage";
import { FareUnavailable } from "../components/fare/FareUnavailable";
import { CancelCard, FareAside, ItineraryCard, RefundCard } from "../components/manage/ManageParts";
import { StatusBadge } from "../components/manage/StatusBadge";
import { CANCEL_REASONS, useManageBookingPage } from "../hooks/useManageBookingPage";

// /flights/bookings/:bookingId (mock: Manage). Signed-in only (App.tsx).
const ENDED = ["CANCELLED", "CANCELLATION_REQUESTED", "FAILED", "HOLD_EXPIRED"];

const FlightManageBookingPage = () => {
  usePageMeta({ title: "Manage booking | TravelMate", description: "Your flight itinerary, references, e-tickets and cancellation." });
  const page = useManageBookingPage();
  const { booking } = page;

  return (
    <div className="min-h-screen bg-[#F4F6FA] text-[#181818]">
      <Navbar />
      <div className="mx-auto flex max-w-[77.5rem] flex-wrap items-start gap-6 px-6 pb-16 pt-26">
        <main className="flex min-w-0 flex-[999_1_40rem] flex-col gap-4.5">
          <Link to={page.allTripsPath} className="inline-flex min-h-11 items-center self-start font-semibold text-[#023E8A]">
            ← All trips
          </Link>
          {page.error ? (
            <FareUnavailable error={page.error} onSeeOtherFlights={page.retry} onRetry={page.retry} />
          ) : !booking || booking.status === "HELD" ? (
            <div role="status" aria-live="polite" className="flex flex-col gap-4">
              <p className="text-sm font-semibold text-[#4E4F52]">Loading your booking…</p>
              <div aria-hidden className="h-72 animate-pulse rounded-2xl border border-[#DEDFE1] bg-white" />
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="mb-1 text-[1.75rem] font-bold">{routeName(booking.offer)}</h1>
                  <div className="text-[#4E4F52]">
                    {tripDates(booking.offer)} · {travellersText(booking)} · {booking.offer.validatingAirline.name}
                  </div>
                </div>
                <div aria-live="polite">
                  <StatusBadge badge={statusBadge(booking)} />
                </div>
              </div>
              {ENDED.includes(booking.status) && <RefundCard booking={booking} />}
              <ItineraryCard
                booking={booking}
                downloading={page.downloading}
                onDownload={page.downloadItinerary}
                onCancel={page.cancellable && !page.cancelOpen ? page.openCancel : null}
              />
              {page.cancellable && page.cancelOpen && (
                <CancelCard
                  booking={booking}
                  preview={page.preview}
                  reasons={CANCEL_REASONS}
                  reason={page.reason}
                  onReason={page.setReason}
                  cancelling={page.cancelling}
                  error={page.cancelError?.message ?? null}
                  onConfirm={page.confirmCancel}
                  onKeep={page.keepBooking}
                />
              )}
            </>
          )}
        </main>
        {booking && booking.status !== "HELD" && <FareAside offer={booking.offer} />}
      </div>
      <Footer />
    </div>
  );
};

// Default export for React.lazy in App.tsx
export default FlightManageBookingPage;
