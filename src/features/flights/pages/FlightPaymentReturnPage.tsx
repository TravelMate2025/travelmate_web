import { useEffect } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Footer from "../../../components/2Footer";
import { usePageMeta } from "../../../hooks/usePageMeta";
import Navbar from "../../../pages/homePage/Navbar";
import type { AppDispatch, RootState } from "../../../store";
import { flightBookingStatusPath, flightStepPath, flightsLandingPath } from "../../shared/bookingFlowRoutes";
import { refreshFlightBooking } from "../slice";

// /flights/payment-return: Flutterwave sends the customer back here with
// ?status=successful|cancelled|failed. The server confirms the payment through
// its signed webhook; this page only routes the customer onwards.
const FlightPaymentReturnPage = () => {
  usePageMeta({ title: "Payment | TravelMate", description: "Returning from secure payment." });
  const [params] = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const bookingId = params.get("bookingId");
  const status = params.get("status");
  const booking = useSelector((state: RootState) => state.flights.booking.result);
  const succeeded = status === "successful" || status === "completed";

  useEffect(() => {
    if (bookingId && !succeeded) dispatch(refreshFlightBooking(bookingId));
  }, [bookingId, dispatch, succeeded]);

  if (bookingId && succeeded) return <Navigate to={flightBookingStatusPath(bookingId)} replace />;

  const stillHeld = booking?.id === bookingId && booking.status === "HELD";
  return (
    <div className="min-h-screen bg-[#F4F6FA] text-[#181818]">
      <Navbar />
      <main className="mx-auto flex w-full max-w-[40rem] flex-col gap-5 px-6 pb-16 pt-32">
        <span className="inline-flex h-15 w-15 items-center justify-center self-center rounded-full bg-[#FFF1E8] text-[#9A3412]">
          <ErrorOutlineIcon aria-hidden />
        </span>
        <h1 className="text-center text-[1.75rem] font-bold">Your payment wasn't completed</h1>
        <p className="text-center text-[#4E4F52]">
          {status === "cancelled" ? "You left the payment page before paying." : "The payment didn't go through."} You haven't been charged.
          {stillHeld ? " Your seats are still held, so you can try again." : ""}
        </p>
        {stillHeld && booking ? (
          <Link
            to={flightStepPath("flightReviewAndPay", booking.offer.offerToken)}
            className="flex min-h-13 items-center justify-center rounded-xl bg-[#023E8A] font-extrabold text-white no-underline"
          >
            Back to payment
          </Link>
        ) : (
          <Link to={flightsLandingPath()} className="flex min-h-13 items-center justify-center rounded-xl bg-[#023E8A] font-extrabold text-white no-underline">
            Search flights
          </Link>
        )}
      </main>
      <Footer />
    </div>
  );
};

// Default export for React.lazy in App.tsx
export default FlightPaymentReturnPage;
