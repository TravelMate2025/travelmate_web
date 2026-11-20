import Footer from "../components/2Footer";
import Navbar from "./homePage/Navbar";
import { usePageMeta } from "../hooks/usePageMeta";
import { InfoPageHeader } from "../components/infoPages/InfoPageHeader";
import { CompanyConnectCard } from "../components/infoPages/CompanyConnectCard";
import { FEATURES, HAS_TRAVELMATE_BOOKINGS, PRODUCTS_TEXT } from "../config/features";

const H2 = "text-[#181818] font-semibold text-lg lg:text-xl mb-3";
const TRAVELMATE_BOOKED = [FEATURES.stays && "stays", FEATURES.flights && "flights", FEATURES.transfers && "transfers"].filter(Boolean).join(", ");

// Static, not backend-managed -- unlike About/Privacy/Terms, there's no
// RefundPolicy model in the backend yet. Terms below are written to match,
// not contradict, what's already stated elsewhere on the site (Stays:
// StaysFAQ/StaysTrustRow's "48 hours before check-in"; Transfers:
// TransferFAQ/TransferTrustRow's "24 hours before pickup"). Sections follow the
// product switches (config/features.ts). DRAFT for review: the Hotels section.
export function RefundPolicyPage() {
  usePageMeta({
    title: "Refund & Cancellation Policy | TravelMate",
    description:
      `How refunds and cancellations work on TravelMate for ${PRODUCTS_TEXT}.`,
  });

  return (
    <>
      <Navbar />
      <InfoPageHeader
        eyebrow="Legal"
        title="Refund & Cancellation Policy"
        subtitle={`How refunds and cancellations work on TravelMate for ${PRODUCTS_TEXT}.`}
      />
      <section className="text-[#4E4F52] px-4 py-14">
        <div className="max-w-[680px] mx-auto text-[15.5px] leading-relaxed space-y-8">
          <div>
            <h2 className={H2}>Hotels</h2>
            <p>
              Hotel stays are booked on our partner's secure booking page.
              Whether you can cancel, and how much is refunded, depends on the
              hotel and the rate you choose (for example, non-refundable
              rates). The exact terms are shown before you pay and in your
              booking confirmation, and refunds go back to the payment method
              you used on the booking page.
            </p>
          </div>

          {FEATURES.stays && (
          <div>
            <h2 className={H2}>Stays</h2>
            <p>
              Most stays can be cancelled free of charge up to 48 hours before
              check-in. Some properties or rate types (for example,
              non-refundable rates) may have different terms — the exact
              cancellation policy for your specific booking is always shown
              before you confirm, and again in your booking confirmation.
            </p>
          </div>
          )}

          {FEATURES.transfers && (
          <div>
            <h2 className={H2}>
              Airport Transfers
            </h2>
            <p>
              Transfers can be cancelled free of charge up to 24 hours before
              your scheduled pickup time. Cancellations made after that
              window may not be eligible for a refund, since a driver may
              already be assigned to your trip.
            </p>
          </div>
          )}

          {FEATURES.flights && (
          <div>
            <h2 className={H2}>Flights</h2>
            <p>
              Flight refund eligibility depends on the fare type and airline
              rules for the specific flight you book — some fares are fully
              refundable, others are partially refundable or non-refundable.
              These terms are shown before you complete payment, and
              cancellation or change requests are subject to the airline's
              own policy for that fare.
            </p>
          </div>
          )}

          {HAS_TRAVELMATE_BOOKINGS && (
          <div>
            <h2 className={H2}>
              How refunds are processed
            </h2>
            <p>
              For {TRAVELMATE_BOOKED} booked on TravelMate, eligible refunds are
              issued back to the original payment method used at checkout,
              processed securely through Flutterwave.
              Refund timing depends on your bank or card issuer and can take
              several business days to reflect after we initiate it.
            </p>
          </div>
          )}

          <div>
            <h2 className={H2}>
              Need help with a booking?
            </h2>
            <p>
              If you need to cancel, change, or have a question about a
              specific booking, use{" "}
              <a href="/chat-with-us" className="text-[#023E8A] font-medium hover:underline">
                Chat with Us
              </a>{" "}
              or raise a support ticket from your account, and our team will
              help you directly.
            </p>
          </div>
        </div>
        <CompanyConnectCard currentPage="refund" />
      </section>
      <Footer />
    </>
  );
}
