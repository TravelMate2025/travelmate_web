import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { AppDispatch, RootState } from "../../../store";
import {
  flightBookingStatusPath,
  flightMultiCityPath,
  flightResultsPath,
  flightStepPath,
  flightsLandingPath,
} from "../../shared/bookingFlowRoutes";
import { flightsApi } from "../api";
import { FlightApiError } from "../api/errors";
import { criteriaToQuery } from "../search/criteriaUrl";
import { holdFlightBooking, refreshFlightBooking } from "../slice";
import type { CurrencyCode } from "../types";
import { useFlightCurrency } from "./useFlightCurrency";

export type ReviewView = "holding" | "held" | "expired" | "unavailable" | "error";

const secondsUntil = (iso: string | null) => (iso ? Math.max(0, Math.floor((Date.parse(iso) - Date.now()) / 1000)) : 0);

// Review and pay (mock: Pay, HoldExpired, BookingFailed before payment).
// "Book, then pay" (flights_plan.md C3): arriving here holds the seats with the
// airline; the customer then pays within the hold window.
export const useReviewPayPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("offer");
  const { currency } = useFlightCurrency();
  const travelers = useSelector((state: RootState) => state.flights.travelers);
  const contact = useSelector((state: RootState) => state.flights.contact);
  const bagOptionIds = useSelector((state: RootState) => state.flights.bagOptionIds);
  const bookingState = useSelector((state: RootState) => state.flights.booking);
  const priceCheck = useSelector((state: RootState) => state.flights.priceCheck);
  const lastCriteria = useSelector((state: RootState) => state.flights.criteria);

  const savedBookingId = useSelector((state: RootState) => state.flights.bookingId);
  const booking = bookingState.result && bookingState.result.offer.offerToken === token ? bookingState.result : null;
  const missingTravellers = travelers.length === 0 || !contact;

  // After a reload only the booking id survives (traveller details are never stored):
  // read that booking back before deciding anything, so the seats are never held twice.
  const resumeRequested = useRef(false);
  useEffect(() => {
    if (!token || booking || !savedBookingId || resumeRequested.current) return;
    resumeRequested.current = true;
    dispatch(refreshFlightBooking(savedBookingId));
  }, [booking, dispatch, savedBookingId, token]);
  const resuming = Boolean(savedBookingId) && !booking && bookingState.status !== "failed" && (!resumeRequested.current || bookingState.status === "loading");

  // No booking and no traveller details for this offer: they're entered on the step before
  useEffect(() => {
    if (token && !resuming && !booking && missingTravellers) navigate(flightStepPath("flightTravellers", token), { replace: true });
  }, [booking, missingTravellers, navigate, resuming, token]);

  // Hold the seats once. The ref also stops React's development double-run from creating two PNRs.
  const holdRequested = useRef(false);
  useEffect(() => {
    if (!token || resuming || holdRequested.current) return;
    if (booking) {
      holdRequested.current = true;
      if (booking.status === "HELD") dispatch(refreshFlightBooking(booking.id));
      return;
    }
    if (missingTravellers || !contact) return;
    holdRequested.current = true;
    dispatch(holdFlightBooking({ offerToken: token, travelers, contact, bagOptionIds, currency }));
    // Decides once the resume (if any) has finished
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, resuming, booking?.id]);

  // ---- countdown to the payment deadline (mock: "Pay within 14:52")
  const [secondsLeft, setSecondsLeft] = useState(() => secondsUntil(booking?.holdExpiresAt ?? null));
  const expiryChecked = useRef(false);
  useEffect(() => {
    if (!booking?.holdExpiresAt || booking.status !== "HELD") return;
    expiryChecked.current = false;
    const tick = () => {
      const left = secondsUntil(booking.holdExpiresAt);
      setSecondsLeft(left);
      if (left === 0 && !expiryChecked.current) {
        expiryChecked.current = true;
        dispatch(refreshFlightBooking(booking.id));
      }
    };
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [booking?.holdExpiresAt, booking?.id, booking?.status, dispatch]);

  // Paid already (e.g. back button after checkout): the status page shows progress
  useEffect(() => {
    if (booking && ["PAID", "TICKETING", "TICKETED"].includes(booking.status)) {
      navigate(flightBookingStatusPath(booking.id), { replace: true });
    }
  }, [booking, navigate]);

  // ---- payment
  const [payCurrency, setPayCurrency] = useState<CurrencyCode>(currency);
  const [agreed, setAgreed] = useState(false);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [priceChangeAccepted, setPriceChangeAccepted] = useState(false);

  const payable = booking?.payable.find((p) => p.currency === payCurrency) ?? null;

  const pay = useCallback(async () => {
    if (!booking || !agreed) return;
    setPaying(true);
    setPayError(null);
    try {
      const { checkoutUrl } = await flightsApi.startCheckout(booking.id, payCurrency);
      // Flutterwave's hosted page is another site; the fake API returns an in-app path
      if (checkoutUrl.startsWith("/")) navigate(checkoutUrl);
      else window.location.assign(checkoutUrl);
    } catch (error) {
      setPaying(false);
      if (error instanceof FlightApiError && error.code === "HOLD_EXPIRED") {
        dispatch(refreshFlightBooking(booking.id));
        return;
      }
      setPayError(error instanceof FlightApiError ? error.message : "We couldn't start the payment. Please try again.");
    }
  }, [agreed, booking, dispatch, navigate, payCurrency]);

  const resultsPath = useMemo(() => {
    if (!lastCriteria) return flightsLandingPath();
    const query = criteriaToQuery(lastCriteria);
    return lastCriteria.tripType === "MULTI_CITY" ? flightMultiCityPath(query) : flightResultsPath(query);
  }, [lastCriteria]);

  /** "See other flights" from the price-change dialog: release the seats first. */
  const releaseAndSeeOtherFlights = useCallback(async () => {
    if (booking) await flightsApi.cancelBooking(booking.id, "Price changed at hold").catch(() => undefined);
    navigate(resultsPath);
  }, [booking, navigate, resultsPath]);

  const view: ReviewView =
    bookingState.status === "failed" && !booking
      ? bookingState.error?.code === "OFFER_UNAVAILABLE" || bookingState.error?.code === "OFFER_EXPIRED"
        ? "unavailable"
        : "error"
      : !booking
        ? "holding"
        : booking.status === "HOLD_EXPIRED"
          ? "expired"
          : "held";

  return {
    token,
    view,
    error: bookingState.error,
    booking,
    fareRules: priceCheck.result?.offer.offerToken === token ? priceCheck.result.fareRules : [],
    secondsLeft,
    payCurrency,
    setPayCurrency,
    payable,
    agreed,
    setAgreed,
    pay,
    paying,
    payError,
    priceChangePending: Boolean(booking?.priceChange?.direction === "UP" && !priceChangeAccepted),
    acceptPriceChange: () => setPriceChangeAccepted(true),
    releaseAndSeeOtherFlights,
    resultsPath,
    farePath: token ? flightStepPath("flightFare", token) : resultsPath,
    travellersPath: token ? flightStepPath("flightTravellers", token) : resultsPath,
    retry: () => {
      holdRequested.current = false;
      if (token && contact) dispatch(holdFlightBooking({ offerToken: token, travelers, contact, bagOptionIds, currency }));
    },
  };
};
