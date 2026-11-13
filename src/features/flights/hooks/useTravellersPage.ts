import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import type { AppDispatch, RootState } from "../../../store";
import { flightMultiCityPath, flightResultsPath, flightStepPath, flightsLandingPath } from "../../shared/bookingFlowRoutes";
import { continueToPaymentLabel } from "../../shared/booking/bookingFlowLabels";
import { FLIGHT_FEATURES } from "../bookingSteps";
import { criteriaToQuery } from "../search/criteriaUrl";
import { checkFlightPrice, selectFlightOffer, setFlightTravelers } from "../slice";
import { COUNTRIES } from "../travellers/countries";
import { buildForm, countryForCode, toInputs, type ContactDraft, type TravellerDraft, type TravellerForm } from "../travellers/travellerForm";
import { shortenPair, validateTravellers, type TripDates } from "../travellers/validateTravellers";
import type { Gender } from "../types";
import { useFlightCountry, useFlightCurrency } from "./useFlightCurrency";

/** The visitor's country if we have its calling code, else Nigeria. */
const contactCountryFor = (iso: string | null) => (COUNTRIES.some((c) => c.iso === iso) ? (iso as string) : "NG");

/** Profile gender text ("male", "Female") to the airline's values. */
const genderFrom = (value: string | null): Gender | "" => {
  const v = value?.trim().toLowerCase();
  return v === "male" ? "MALE" : v === "female" ? "FEMALE" : "";
};

/** "+2348012345678" -> ["NG", "8012345678"] using the longest known calling code. */
const splitPhone = (phone: string, fallbackCountry: string): [string, string] => {
  const digits = phone.replace(/[^\d+]/g, "");
  if (!digits.startsWith("+")) return [fallbackCountry, digits.replace(/^0/, "")];
  const match = [...COUNTRIES].sort((a, b) => b.callingCode.length - a.callingCode.length).find((c) => digits.slice(1).startsWith(c.callingCode));
  return match ? [countryForCode(`+${match.callingCode}`, fallbackCountry), digits.slice(1 + match.callingCode.length)] : [fallbackCountry, digits.slice(1)];
};

// The Travellers step (mock: Travelers). Signed-in only (PrivateRoute), so
// sign-in happens before anything is typed and nothing is lost.
export const useTravellersPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("offer");
  const { currency } = useFlightCurrency();
  const { country } = useFlightCountry();
  const priceCheck = useSelector((state: RootState) => state.flights.priceCheck);
  const savedTravelers = useSelector((state: RootState) => state.flights.travelers);
  const savedContact = useSelector((state: RootState) => state.flights.contact);
  const lastCriteria = useSelector((state: RootState) => state.flights.criteria);
  // The persisted profile slice can come back as null, not just an empty profile
  const profile = useSelector((state: RootState) => state.profile?.profile ?? null);
  const user = useSelector((state: RootState) => state.auth.user);

  const result = priceCheck.status === "succeeded" && priceCheck.result?.offer.offerToken === token ? priceCheck.result : null;

  // Arriving without a price check for this offer (after signing in, or a reload): price it again
  useEffect(() => {
    if (!token || result || priceCheck.status === "loading") return;
    dispatch(selectFlightOffer(token));
    dispatch(checkFlightPrice({ offerToken: token, currency, includeBags: true }));
    // Only when the offer changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const [form, setForm] = useState<TravellerForm | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (result && !form) setForm(buildForm(result.requirements, { travelers: savedTravelers, contact: savedContact }, contactCountryFor(country)));
    // Built once per offer; later edits live in the form
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  const offer = result?.offer ?? null;
  const dates: TripDates | null = useMemo(() => {
    if (!offer) return null;
    const lastItinerary = offer.itineraries[offer.itineraries.length - 1];
    return {
      firstDeparture: offer.itineraries[0].segments[0].from.atLocal.slice(0, 10),
      lastFlight: lastItinerary.segments[lastItinerary.segments.length - 1].to.atLocal.slice(0, 10),
      today: format(new Date(), "yyyy-MM-dd"),
    };
  }, [offer]);

  const errors = useMemo(
    () => (submitted && form && result && dates ? validateTravellers(form, result.requirements, dates) : {}),
    [dates, form, result, submitted]
  );

  const updateTraveller = useCallback((travelerId: string, patch: Partial<TravellerDraft>) => {
    setForm((f) => f && { ...f, travellers: f.travellers.map((t) => (t.travelerId === travelerId ? { ...t, ...patch } : t)) });
  }, []);

  const updateContact = useCallback((patch: Partial<ContactDraft>) => {
    setForm((f) => f && { ...f, contact: { ...f.contact, ...patch } });
  }, []);

  /** "Use my profile details": fills the lead traveller and contact from the account. */
  const fillFromProfile = useCallback(() => {
    if (!profile || !form) return;
    const lead = form.travellers[0];
    updateTraveller(lead.travelerId, {
      firstName: profile.first_name ?? lead.firstName,
      lastName: profile.last_name ?? lead.lastName,
      gender: genderFrom(profile.gender) || lead.gender,
      dateOfBirth: profile.date_of_birth ?? lead.dateOfBirth,
    });
    const [phoneCountry, number] = profile.mobile_number ? splitPhone(profile.mobile_number, form.contact.phoneCountry) : [form.contact.phoneCountry, ""];
    updateContact({ email: profile.email || form.contact.email, ...(profile.mobile_number ? { phoneCountry, phoneNumber: number } : {}) });
  }, [form, profile, updateContact, updateTraveller]);

  /** Applies the guide's shortened names for an adult + lap infant pair, after the customer agrees. */
  const shortenNames = useCallback(
    (infantId: string) => {
      if (!form) return;
      const infant = form.travellers.find((t) => t.travelerId === infantId);
      const adult = form.travellers.find((t) => t.travelerId === infant?.associatedAdultId);
      if (!infant || !adult) return;
      const short = shortenPair(adult, infant);
      if (!short) return;
      updateTraveller(adult.travelerId, short.adult);
      updateTraveller(infant.travelerId, short.infant);
    },
    [form, updateTraveller]
  );

  const resultsPath = useMemo(() => {
    if (!lastCriteria) return flightsLandingPath();
    const query = criteriaToQuery(lastCriteria);
    return lastCriteria.tripType === "MULTI_CITY" ? flightMultiCityPath(query) : flightResultsPath(query);
  }, [lastCriteria]);
  const farePath = token ? flightStepPath("flightFare", token) : resultsPath;

  const submit = () => {
    if (!form || !result || !dates || !token) return;
    setSubmitted(true);
    const found = validateTravellers(form, result.requirements, dates);
    if (Object.keys(found).length > 0) {
      // Take the user to the first problem
      requestAnimationFrame(() => document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus());
      return;
    }
    dispatch(setFlightTravelers(toInputs(form)));
    navigate(flightStepPath(FLIGHT_FEATURES.extras ? "flightExtras" : "flightReviewAndPay", token));
  };

  return {
    token,
    status: priceCheck.status,
    error: priceCheck.error,
    result,
    offer,
    form,
    errors,
    profileAvailable: Boolean(profile),
    signedInAs: [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || user?.name || user?.email || null,
    updateTraveller,
    updateContact,
    fillFromProfile,
    shortenNames,
    resultsPath,
    farePath,
    continueLabel: FLIGHT_FEATURES.extras ? "Continue to extras" : continueToPaymentLabel(),
    submit,
    seeOtherFlights: () => navigate(resultsPath),
    retry: () => token && dispatch(checkFlightPrice({ offerToken: token, currency, includeBags: true })),
  };
};
