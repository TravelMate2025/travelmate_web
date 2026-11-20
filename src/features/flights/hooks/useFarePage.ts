import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { AppDispatch, RootState } from "../../../store";
import { flightMultiCityPath, flightResultsPath, flightStepPath, flightsLandingPath } from "../../shared/bookingFlowRoutes";
import { flightsApi } from "../api";
import { criteriaToQuery } from "../search/criteriaUrl";
import { checkFlightPrice, selectFlightOffer } from "../slice";
import type { CurrencyCode, FareOption } from "../types";
import { useFlightCurrency } from "./useFlightCurrency";

// The Fare step (mock: Fares). Prices the chosen offer with the airline when
// the page opens (and again for any fare family the user picks), loads the
// airline's fare families, and handles price changes. The price check lives
// in Redux because the Travellers step reads its booking requirements.
export const useFarePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const searchedToken = params.get("offer");
  const { currency, setCurrency } = useFlightCurrency();
  const priceCheck = useSelector((state: RootState) => state.flights.priceCheck);
  const lastCriteria = useSelector((state: RootState) => state.flights.criteria);

  const [chosenToken, setChosenToken] = useState<string | null>(searchedToken);
  const [options, setOptions] = useState<FareOption[] | null>(null);
  // The searched offer's own fare family, so its card shows as selected
  const [searchedBrand, setSearchedBrand] = useState<string | null>(null);
  const [acknowledgedChange, setAcknowledgedChange] = useState<string | null>(null);

  const price = useCallback(
    (offerToken: string, inCurrency: CurrencyCode) => {
      dispatch(selectFlightOffer(offerToken));
      dispatch(checkFlightPrice({ offerToken, currency: inCurrency, includeBags: true }));
    },
    [dispatch]
  );

  // Price the offer and load the fare families when the page opens or the currency changes
  useEffect(() => {
    if (!searchedToken) return;
    setChosenToken(searchedToken);
    setSearchedBrand(null);
    price(searchedToken, currency);
    let cancelled = false;
    setOptions(null);
    flightsApi
      .getFareOptions(searchedToken, currency)
      .then((result) => {
        if (!cancelled) setOptions(result);
      })
      .catch(() => {
        if (!cancelled) setOptions([]);
      });
    return () => {
      cancelled = true;
    };
  }, [currency, price, searchedToken]);

  const result = priceCheck.status === "succeeded" ? priceCheck.result : null;
  const offer = result?.offer ?? null;

  useEffect(() => {
    if (offer && chosenToken === searchedToken && searchedBrand === null) {
      setSearchedBrand(offer.itineraries[0].segments[0].brandedFare);
    }
  }, [chosenToken, offer, searchedBrand, searchedToken]);

  const isChosen = useCallback(
    (option: FareOption) =>
      option.offerToken === chosenToken || (chosenToken === searchedToken && option.brandName === searchedBrand),
    [chosenToken, searchedBrand, searchedToken]
  );

  const chooseFare = (option: FareOption) => {
    if (isChosen(option)) return;
    const token = option.brandName === searchedBrand ? (searchedToken as string) : option.offerToken;
    setChosenToken(token);
    price(token, currency);
  };

  const chosenOption = options?.find(isChosen) ?? null;

  // Price went up since the user chose it: ask before going on (mock: PriceChanged)
  const changeKey = result?.priceChange ? `${offer?.offerToken}:${result.priceChange.current.amount}` : null;
  const priceRose = result?.priceChange?.direction === "UP" && changeKey !== acknowledgedChange;

  const resultsPath = useMemo(() => {
    if (!lastCriteria) return flightsLandingPath();
    const query = criteriaToQuery(lastCriteria);
    return lastCriteria.tripType === "MULTI_CITY" ? flightMultiCityPath(query) : flightResultsPath(query);
  }, [lastCriteria]);

  return {
    searchedToken,
    currency,
    setCurrency,
    status: priceCheck.status,
    error: priceCheck.error,
    result,
    offer,
    options,
    chosenOption,
    isChosen,
    chooseFare,
    priceRose,
    acceptNewPrice: () => setAcknowledgedChange(changeKey),
    retry: () => chosenToken && price(chosenToken, currency),
    resultsPath,
    passengers: lastCriteria?.passengers ?? null,
    continueToTravellers: () => chosenToken && navigate(flightStepPath("flightTravellers", chosenToken)),
    seeOtherFlights: () => navigate(resultsPath),
  };
};
