import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import type { AppDispatch, RootState } from "../../../store";
import { criteriaFromQuery } from "../search/criteriaUrl";
import { routeTitle } from "../search/recentSearches";
import { searchFlights } from "../slice";
import type { FlightSearchCriteria } from "../types";
import { useFlightCurrency } from "./useFlightCurrency";
import { usePlaceNames } from "./usePlaces";

const sameCriteria = (a: FlightSearchCriteria | null, b: FlightSearchCriteria | null) =>
  Boolean(a && b) && JSON.stringify(a) === JSON.stringify(b);

/** Reads the search from the URL and runs it (once per distinct search). */
export const useFlightResults = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [params] = useSearchParams();
  const { currency } = useFlightCurrency();
  const search = useSelector((state: RootState) => state.flights.search);
  const lastCriteria = useSelector((state: RootState) => state.flights.criteria);

  const query = params.toString();
  // `query` is the stable string form of `params`
  const criteria = useMemo(() => criteriaFromQuery(new URLSearchParams(query), currency), [query, currency]);

  const run = useCallback(() => {
    if (criteria) dispatch(searchFlights(criteria));
  }, [criteria, dispatch]);

  useEffect(() => {
    if (!criteria) return;
    // Coming back to the same search keeps its results until they expire
    const fresh =
      sameCriteria(criteria, lastCriteria) &&
      search.status !== "failed" &&
      (search.status === "loading" || (search.result && Date.parse(search.result.expiresAt) > Date.now()));
    if (!fresh) run();
    // Only when the search itself changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [criteria]);

  const places = usePlaceNames(criteria ? criteria.legs.flatMap((l) => [l.origin, l.destination]) : []);

  return {
    criteria,
    title: criteria ? routeTitle(criteria, places) : "",
    status: search.status,
    result: search.result,
    error: search.error,
    retry: run,
  };
};
