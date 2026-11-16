import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store";
import { updateUserProfile } from "../../account/api/profile";
import { setUserProfile } from "../../account/slices/profileSlice";
import { browserCountry, pickCurrency } from "../currency";
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

/**
 * The currency for prices: chosen in this session, else saved on the signed-in
 * user's profile, else their country's default (decision F-7). Choosing one
 * while signed in saves it on the profile, so it follows them to other devices.
 */
export const useFlightCurrency = () => {
  const dispatch = useDispatch<AppDispatch>();
  const chosen = useSelector((state: RootState) => state.flights.currency);
  const profile = useSelector((state: RootState) => state.profile.profile);
  const { country } = useFlightCountry();
  const currency: CurrencyCode = pickCurrency(chosen, profile?.preferred_currency, country);
  const setCurrency = useCallback(
    (next: CurrencyCode) => {
      dispatch(setFlightCurrency(next));
      if (profile && profile.preferred_currency !== next) {
        // Best effort: the choice still applies now if saving fails
        updateUserProfile(profile.id, { preferred_currency: next })
          .then(() => dispatch(setUserProfile({ ...profile, preferred_currency: next })))
          .catch(() => undefined);
      }
    },
    [dispatch, profile]
  );
  return { currency, setCurrency };
};
