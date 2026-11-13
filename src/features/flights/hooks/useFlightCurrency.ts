import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store";
import { browserCountry, currencyForCountry } from "../currency";
import { setFlightCountry, setFlightCurrency } from "../slice";
import type { CurrencyCode } from "../types";

/** The visitor's chosen country, else a guess from the browser. Drives popular routes and the default currency. */
export const useFlightCountry = () => {
  const dispatch = useDispatch<AppDispatch>();
  const chosen = useSelector((state: RootState) => state.flights.country);
  const country = chosen ?? browserCountry();
  const setCountry = useCallback((next: string) => dispatch(setFlightCountry(next)), [dispatch]);
  return { country, setCountry };
};

/** The user's chosen currency, or their country's default until they choose. */
export const useFlightCurrency = () => {
  const dispatch = useDispatch<AppDispatch>();
  const chosen = useSelector((state: RootState) => state.flights.currency);
  const { country } = useFlightCountry();
  const currency: CurrencyCode = chosen ?? currencyForCountry(country);
  const setCurrency = useCallback((next: CurrencyCode) => dispatch(setFlightCurrency(next)), [dispatch]);
  return { currency, setCurrency };
};
