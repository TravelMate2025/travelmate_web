import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../store";
import Navbar from "../../../pages/homePage/Navbar";
import Footer from "../../../components/2Footer";
import { FaCheckCircle } from "react-icons/fa";
import { bookingFlowRoutes } from "../../shared/bookingFlowRoutes";

const StayHoldSummaryPage: React.FC = () => {
  const navigate = useNavigate();
  const { holdResp, quoteResp } = useSelector((state: RootState) => state.stays);

  if (!holdResp) {
    return (
      <div>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <p className="text-gray-500">No hold data found. Please start a new booking.</p>
          <button
            onClick={() => navigate(bookingFlowRoutes.staySearch)}
            className="bg-[#023E8A] text-white px-6 py-2 rounded-lg"
          >
            Search Stays
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const currency = holdResp.currency;
  const paymentLink = holdResp.paymentLink;
  const quoteCurrency = quoteResp?.pricing.currency ?? currency;

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return iso;
    }
  };

  return (
    <div>
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-16 space-y-8">
        {/* Status banner */}
        <div className="flex flex-col items-center gap-3 text-center">
          <FaCheckCircle className="text-green-500 text-5xl" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Reservation Held</h1>
          <p className="text-gray-500 text-sm max-w-sm">
            Your booking is held and awaiting payment. Complete payment before the hold expires.
          </p>
          <span className="rounded-full bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 uppercase tracking-wide">
            {holdResp.status}
          </span>
        </div>

        {/* Booking reference */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-3 text-sm">
          <h2 className="font-semibold text-gray-700 text-base">Booking Details</h2>
          <div className="flex justify-between">
            <span className="text-gray-500">Booking Reference</span>
            <span className="font-bold text-[#023E8A]">{holdResp.bookingReference}</span>
          </div>
          {holdResp.paymentIntentId && (
            <div className="flex justify-between">
              <span className="text-gray-500">Payment Intent</span>
              <span className="font-mono text-xs font-medium">{holdResp.paymentIntentId}</span>
            </div>
          )}
          {holdResp.requestId && (
            <div className="flex justify-between">
              <span className="text-gray-500">Request ID</span>
              <span className="font-medium font-mono text-xs">{holdResp.requestId}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-500">Hold Expires</span>
            <span className="font-medium text-red-600">{formatDate(holdResp.holdExpiresAt)}</span>
          </div>
          {holdResp.cancellationOptionSelection && (
            <div className="flex justify-between">
              <span className="text-gray-500">Rate</span>
              <span className="font-medium">{holdResp.cancellationOptionSelection.label}</span>
            </div>
          )}
          {holdResp.cancellationOptionSelection?.cancellationCutoffAtLocal && (
            <div className="flex justify-between">
              <span className="text-gray-500">Cancel before</span>
              <span className="font-medium">
                {formatDate(holdResp.cancellationOptionSelection.cancellationCutoffAtLocal)}
              </span>
            </div>
          )}
          {holdResp.idempotency?.replayed && (
            <div className="rounded-md bg-yellow-50 border border-yellow-200 px-3 py-2 text-xs text-yellow-700">
              This hold already existed and was returned as-is.
            </div>
          )}
          {quoteResp?.lockId && (
            <div className="flex justify-between">
              <span className="text-gray-500">Quote Lock</span>
              <span className="font-mono text-xs font-medium">{quoteResp.lockId}</span>
            </div>
          )}
        </div>

        {/* Travelers */}
        {holdResp.travelers?.length > 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-3 text-sm">
            <h2 className="font-semibold text-gray-700 text-base">Travelers</h2>
            {holdResp.travelers.map((t, i) => (
              <div key={i} className="flex justify-between items-center border-b last:border-0 pb-2 last:pb-0">
                <div>
                  <p className="font-medium">
                    {t.firstName} {t.lastName}
                  </p>
                  <p className="text-gray-400 text-xs">{t.email}</p>
                </div>
                <span className="rounded-full bg-gray-100 text-gray-600 text-xs px-2 py-0.5 capitalize">
                  {t.type}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Room */}
        {(holdResp.roomSelections?.length || quoteResp?.roomSelections?.length) ? (
          <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-3 text-sm">
            <h2 className="font-semibold text-gray-700 text-base">Room Selection</h2>
            {(holdResp.roomSelections?.length ? holdResp.roomSelections : quoteResp?.roomSelections || []).map(
              (selection, index) => (
                <div key={`${selection.roomId ?? "room"}-${index}`} className="flex justify-between">
                  <span className="text-gray-500">Room</span>
                  <span className="font-medium">{selection.roomId ?? "—"}</span>
                </div>
              ),
            )}
            {(holdResp.ratePlanSelection || quoteResp?.ratePlanSelection) && (
              <div className="flex justify-between">
                <span className="text-gray-500">Rate Plan</span>
                <span className="font-medium">{holdResp.ratePlanSelection ?? quoteResp?.ratePlanSelection}</span>
              </div>
            )}
          </div>
        ) : null}

        {/* Price breakdown */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-3 text-sm">
            <h2 className="font-semibold text-gray-700 text-base">Price Breakdown</h2>
            <div className="flex justify-between">
              <span className="text-gray-500">Base</span>
              <span className="font-medium">{currency} {holdResp.baseAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Tax</span>
            <span className="font-medium">{currency} {holdResp.taxAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Fees</span>
            <span className="font-medium">{currency} {holdResp.feeAmount.toLocaleString()}</span>
          </div>
            <div className="border-t pt-2 flex justify-between font-bold text-base">
              <span>Total</span>
              <span>{currency} {holdResp.totalAmount.toLocaleString()}</span>
            </div>
            {quoteResp?.pricing && (
              <p className="text-xs text-gray-500">
                Quote total: {quoteCurrency} {quoteResp.pricing.total.toLocaleString()}
              </p>
            )}
          </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            className="w-full bg-[#023E8A] text-white py-3 rounded-xl font-semibold hover:bg-[#023E9E] transition-colors"
            onClick={() => {
              if (!paymentLink) {
                alert("Payment handoff is not available for this booking yet.");
                return;
              }
              window.location.assign(paymentLink);
            }}
          >
            Continue to Payment
          </button>
          <button
            className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            onClick={() => navigate("/")}
          >
            Back to Home
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default StayHoldSummaryPage;
