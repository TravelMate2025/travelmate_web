import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { AppDispatch, RootState } from "../../../store";
import { flightMultiCityPath, flightResultsPath, flightStepPath, flightsLandingPath } from "../../shared/bookingFlowRoutes";
import { bagGroups, bagsTotal, chooseBag, includedBagsText, type BagGroup } from "../booking/bags";
import { hasExtrasStep } from "../bookingSteps";
import { criteriaToQuery } from "../search/criteriaUrl";
import { passengersSummary } from "../search/searchDraft";
import { setFlightBags } from "../slice";

// /flights/extras?offer=… (mock: Extras). Step 4 when the airline sells extra
// bags for this offer. Bags come from the price check (with bags) done on the
// fare step; prices are confirmed again when the seats are held.
export const useExtrasPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("offer");
  const priceCheck = useSelector((state: RootState) => state.flights.priceCheck);
  const travelers = useSelector((state: RootState) => state.flights.travelers);
  const contact = useSelector((state: RootState) => state.flights.contact);
  const savedBagIds = useSelector((state: RootState) => state.flights.bagOptionIds);
  const lastCriteria = useSelector((state: RootState) => state.flights.criteria);

  const result = priceCheck.result?.offer.offerToken === token ? priceCheck.result : null;
  const missingTravellers = travelers.length === 0 || !contact;

  // Traveller details aren't stored, so after a reload they're entered again first
  useEffect(() => {
    if (!token) return;
    if (missingTravellers || !result) navigate(flightStepPath("flightTravellers", token), { replace: true });
    else if (!hasExtrasStep(result.bagOptions)) navigate(flightStepPath("flightReviewAndPay", token), { replace: true });
  }, [missingTravellers, navigate, result, token]);

  // UI state until "Continue": the choice per direction
  const [chosen, setChosen] = useState<string[]>(savedBagIds);

  const currency = result?.offer.price.currency ?? "USD";
  const groups = useMemo(
    () => (result ? bagGroups(result.bagOptions, result.offer, travelers, currency) : []),
    [currency, result, travelers]
  );
  const extras = bagsTotal(result?.bagOptions ?? [], chosen, currency);

  const resultsPath = useMemo(() => {
    if (!lastCriteria) return flightsLandingPath();
    const query = criteriaToQuery(lastCriteria);
    return lastCriteria.tripType === "MULTI_CITY" ? flightMultiCityPath(query) : flightResultsPath(query);
  }, [lastCriteria]);

  return {
    offer: result?.offer ?? null,
    groups,
    chosen,
    choose: (group: BagGroup, id: string | null) => setChosen((ids) => chooseBag(group, ids, id)),
    included: result ? includedBagsText(result.offer) : null,
    currency,
    flightsPrice: result?.offer.price.amount ?? "0",
    /** "1 adult" for "Flights · 1 adult" (mock) */
    passengers: passengersSummary({
      adults: travelers.filter((t) => t.type === "ADULT").length,
      children: travelers.filter((t) => t.type === "CHILD").length,
      heldInfants: travelers.filter((t) => t.type === "HELD_INFANT").length,
      seatedInfants: travelers.filter((t) => t.type === "SEATED_INFANT").length,
    }),
    extras,
    total: (Number(result?.offer.price.amount ?? 0) + Number(extras.amount)).toFixed(2),
    resultsPath,
    farePath: token ? flightStepPath("flightFare", token) : resultsPath,
    travellersPath: token ? flightStepPath("flightTravellers", token) : resultsPath,
    continueToPay: () => {
      if (!token) return;
      dispatch(setFlightBags(chosen));
      navigate(flightStepPath("flightReviewAndPay", token));
    },
  };
};
