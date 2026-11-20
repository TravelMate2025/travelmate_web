import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import type { AppDispatch, RootState } from "../../../store";
import {
  flightBookingManagePath,
  flightMultiCityPath,
  flightResultsPath,
  flightStepPath,
  flightsLandingPath,
} from "../../shared/bookingFlowRoutes";
import { bookingCalendar } from "../booking/calendar";
import { shouldPoll, statusView } from "../booking/bookingStatus";
import { criteriaToQuery } from "../search/criteriaUrl";
import { refreshFlightBooking } from "../slice";

const POLL_MS = 5000;

// /flights/bookings/:bookingId/status (mock: Status, BookingFailed after
// payment). Asks the server again every few seconds while something is still
// changing (payment confirming, ticket issuing, refund in progress). Leaving
// the page is safe: the server keeps going and emails the customer.
export const useBookingStatusPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { bookingId = "" } = useParams();
  const bookingState = useSelector((state: RootState) => state.flights.booking);
  const lastCriteria = useSelector((state: RootState) => state.flights.criteria);
  const booking = bookingState.result?.id === bookingId ? bookingState.result : null;
  const polling = shouldPoll(booking);

  useEffect(() => {
    if (!bookingId) return;
    dispatch(refreshFlightBooking(bookingId));
  }, [bookingId, dispatch]);

  useEffect(() => {
    if (!bookingId || !polling) return;
    const timer = window.setInterval(() => dispatch(refreshFlightBooking(bookingId)), POLL_MS);
    return () => window.clearInterval(timer);
  }, [bookingId, dispatch, polling]);

  const view = booking ? statusView(booking) : bookingState.status === "failed" ? "error" : "loading";

  // Not this page's states: unpaid holds belong on Review and pay, cancellations on Manage
  useEffect(() => {
    if (!booking) return;
    if (view === "unpaid") navigate(flightStepPath("flightReviewAndPay", booking.offer.offerToken), { replace: true });
    if (view === "cancelled") navigate(flightBookingManagePath(booking.id), { replace: true });
  }, [booking, navigate, view]);

  const resultsPath = useMemo(() => {
    if (!lastCriteria) return flightsLandingPath();
    const query = criteriaToQuery(lastCriteria);
    return lastCriteria.tripType === "MULTI_CITY" ? flightMultiCityPath(query) : flightResultsPath(query);
  }, [lastCriteria]);

  /** Downloads an .ics with one event per flight. */
  const addToCalendar = useCallback(() => {
    if (!booking) return;
    const url = URL.createObjectURL(new Blob([bookingCalendar(booking)], { type: "text/calendar;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `travelmate-${booking.reference}.ics`;
    link.click();
    URL.revokeObjectURL(url);
  }, [booking]);

  return {
    view,
    booking,
    error: bookingState.error,
    polling,
    addToCalendar,
    managePath: flightBookingManagePath(bookingId),
    resultsPath,
    retry: () => dispatch(refreshFlightBooking(bookingId)),
  };
};
