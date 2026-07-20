import Footer from "../components/2Footer";
import Navbar from "./homePage/Navbar";
import { usePageMeta } from "../hooks/usePageMeta";

// Static, not backend-managed -- unlike About/Privacy/Terms, there's no
// RefundPolicy model in the backend yet. Terms below are written to match,
// not contradict, what's already stated elsewhere on the site (Stays:
// StaysFAQ/StaysTrustRow's "48 hours before check-in"; Transfers:
// TransferFAQ/TransferTrustRow's "24 hours before pickup").
export function RefundPolicyPage() {
  usePageMeta({
    title: "Refund & Cancellation Policy | TravelMate",
    description:
      "How refunds and cancellations work on TravelMate for stays, flights, and airport transfers.",
  });

  return (
    <>
      <Navbar />
      <section className="mt-[50px] min-h-screen lg:mt-[100px] text-sm lg:text-lg text-[#4E4F52] max-w-[1240px] mx-auto px-4 py-10 space-y-8 lg:space-y-10">
        <div>
          <p className="text-[#181818] font-semibold text-2xl text-center lg:text-left lg:text-4xl">
            Refund &amp; Cancellation Policy
          </p>
        </div>

        <div className="space-y-8 text-sm lg:text-base leading-relaxed">
          <div>
            <h2 className="text-[#181818] font-semibold text-lg lg:text-xl mb-3">Stays</h2>
            <p>
              Most stays can be cancelled free of charge up to 48 hours before
              check-in. Some properties or rate types (for example,
              non-refundable rates) may have different terms — the exact
              cancellation policy for your specific booking is always shown
              before you confirm, and again in your booking confirmation.
            </p>
          </div>

          <div>
            <h2 className="text-[#181818] font-semibold text-lg lg:text-xl mb-3">
              Airport Transfers
            </h2>
            <p>
              Transfers can be cancelled free of charge up to 24 hours before
              your scheduled pickup time. Cancellations made after that
              window may not be eligible for a refund, since a driver may
              already be assigned to your trip.
            </p>
          </div>

          <div>
            <h2 className="text-[#181818] font-semibold text-lg lg:text-xl mb-3">Flights</h2>
            <p>
              Flight refund eligibility depends on the fare type and airline
              rules for the specific flight you book — some fares are fully
              refundable, others are partially refundable or non-refundable.
              These terms are shown before you complete payment, and
              cancellation or change requests are subject to the airline's
              own policy for that fare.
            </p>
          </div>

          <div>
            <h2 className="text-[#181818] font-semibold text-lg lg:text-xl mb-3">
              How refunds are processed
            </h2>
            <p>
              Eligible refunds are issued back to the original payment method
              used at checkout, processed securely through Flutterwave.
              Refund timing depends on your bank or card issuer and can take
              several business days to reflect after we initiate it.
            </p>
          </div>

          <div>
            <h2 className="text-[#181818] font-semibold text-lg lg:text-xl mb-3">
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
      </section>
      <Footer />
    </>
  );
}
