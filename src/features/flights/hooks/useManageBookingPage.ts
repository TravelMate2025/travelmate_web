import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import type { AppDispatch, RootState } from "../../../store";
import { bookingFlowRoutes, flightBookingStatusPath, flightStepPath } from "../../shared/bookingFlowRoutes";
import { shouldPoll } from "../booking/bookingStatus";
import { canCancel } from "../booking/manage";
import { cancelFlightBooking, previewFlightCancellation, refreshFlightBooking } from "../slice";

const POLL_MS = 5000;

export const CANCEL_REASONS = ["Change of plans", "Found another option", "Other"] as const;

// /flights/bookings/:bookingId (mock: Manage). Itinerary, references, tickets,
// itinerary PDF, and cancelling: full refund before the ticket is issued or in
// the void window, otherwise a refund the airline confirms.
export const useManageBookingPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { bookingId = "" } = useParams();
  const [searchParams] = useSearchParams();
  const bookingState = useSelector((state: RootState) => state.flights.booking);
  const preview = useSelector((state: RootState) => state.flights.cancellationPreview);
  const cancellation = useSelector((state: RootState) => state.flights.cancellation);
  const booking = bookingState.result?.id === bookingId ? bookingState.result : null;
  const cancellable = booking ? canCancel(booking) : false;
  const polling = shouldPoll(booking);

  // UI state: the cancel section is open when asked for from My bookings
  const [cancelOpen, setCancelOpen] = useState(searchParams.get("cancel") === "1");
  const [reason, setReason] = useState<string>(CANCEL_REASONS[0]);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (bookingId) dispatch(refreshFlightBooking(bookingId));
  }, [bookingId, dispatch]);

  // Ticketing can finish while the page is open; keep the badge and tickets current
  useEffect(() => {
    if (!bookingId || !polling || cancellation.status === "loading") return;
    const timer = window.setInterval(() => dispatch(refreshFlightBooking(bookingId)), POLL_MS);
    return () => window.clearInterval(timer);
  }, [bookingId, cancellation.status, dispatch, polling]);

  // Not paid yet: that belongs on Review and pay (or the status page while the payment confirms)
  useEffect(() => {
    if (booking?.status !== "HELD") return;
    navigate(
      booking.payment?.status === "PENDING" ? flightBookingStatusPath(booking.id) : flightStepPath("flightReviewAndPay", booking.offer.offerToken),
      { replace: true }
    );
  }, [booking, navigate]);

  // The refund figures, fetched once the section is open
  useEffect(() => {
    if (cancelOpen && cancellable && booking) dispatch(previewFlightCancellation(booking.id));
    // Only when opening, or when the booking first becomes cancellable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cancelOpen, cancellable, booking?.id, dispatch]);

  const confirmCancel = useCallback(async () => {
    if (!booking) return;
    const result = await dispatch(cancelFlightBooking({ bookingId: booking.id, reason }));
    if (cancelFlightBooking.fulfilled.match(result)) {
      setCancelOpen(false);
      toast.success(
        result.payload.status === "CANCELLATION_REQUESTED"
          ? "Cancellation requested. We’ll email you when the airline confirms your refund."
          : "Booking cancelled. Your refund has started."
      );
    }
  }, [booking, dispatch, reason]);

  const downloadItinerary = useCallback(async () => {
    if (!booking) return;
    setDownloading(true);
    try {
      const { downloadItineraryPdf } = await import("../booking/itineraryPdf");
      await downloadItineraryPdf(booking);
    } catch {
      toast.error("We couldn't create the PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  }, [booking]);

  return {
    booking,
    loading: !booking && bookingState.status !== "failed",
    error: booking ? null : bookingState.error,
    retry: () => dispatch(refreshFlightBooking(bookingId)),
    allTripsPath: bookingFlowRoutes.myBookings,
    cancellable,
    cancelOpen,
    openCancel: () => setCancelOpen(true),
    keepBooking: () => setCancelOpen(false),
    reason,
    setReason,
    preview,
    cancelling: cancellation.status === "loading",
    cancelError: cancellation.status === "failed" ? cancellation.error : null,
    confirmCancel,
    downloading,
    downloadItinerary,
  };
};
