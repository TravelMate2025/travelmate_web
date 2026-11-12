import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import type { RootState } from "../../../store";
import { flightMultiCityPath, flightResultsPath, flightsLandingPath } from "../../shared/bookingFlowRoutes";
import { criteriaFromQuery, criteriaToQuery } from "../search/criteriaUrl";
import { loadRecentSearches, saveRecentSearch, type RecentFlightSearch } from "../search/recentSearches";
import {
  CABINS,
  MAX_MULTI_CITY_LEGS,
  MIN_MULTI_CITY_LEGS,
  emptyLeg,
  fromCriteria,
  initialDraft,
  toCriteria,
  withTripType,
  type DraftLeg,
  type SearchDraft,
} from "../search/searchDraft";
import { validateSearch } from "../search/validateSearch";
import type { CabinClass, FlexibleDays, FlightSearchCriteria, PassengerCounts, Place, TripType } from "../types";
import { useFlightCurrency } from "./useFlightCurrency";
import { resolvePlace } from "./usePlaces";

export const FLIGHT_SEARCH_ANCHOR_ID = "flight-search";

/**
 * "single": the /flights search card (Return, One-way). Search opens the results page.
 * "multi": the /flights/multi-city page (mock: MultiCity). Search stays on that page.
 * Switching between them navigates, carrying the first flight's From and To.
 */
export type SearchFormMode = "single" | "multi";

const localToday = () => format(new Date(), "yyyy-MM-dd");

/** Rebuilds a draft from saved criteria, dropping dates that have passed. */
const restoreDraft = async (criteria: FlightSearchCriteria, known: Record<string, Place> = {}) => {
  const codes = [...new Set(criteria.legs.flatMap((l) => [l.origin, l.destination]))];
  const found = await Promise.all(codes.map((code) => known[code] ?? resolvePlace(code)));
  const lookup = Object.fromEntries(found.filter((p): p is Place => p !== null).map((p) => [p.code, p]));
  const draft = fromCriteria(criteria, (code) => lookup[code] ?? null);
  const today = localToday();
  return {
    ...draft,
    legs: draft.legs.map((leg) => ({ ...leg, date: leg.date && leg.date >= today ? leg.date : null })),
    returnDate: draft.returnDate && draft.returnDate >= today ? draft.returnDate : null,
  };
};

/** The multi-city screen has no flexible dates, direct-only or nearby-airport options (mock). */
const asMultiCity = (draft: SearchDraft): SearchDraft => {
  const multi = withTripType(draft, "MULTI_CITY");
  return { ...multi, nonStop: false, includeNearbyAirports: false, legs: multi.legs.map((leg) => ({ ...leg, flexibleDays: 0 })) };
};

const asSingle = (draft: SearchDraft): SearchDraft => (draft.tripType === "MULTI_CITY" ? withTripType(draft, "RETURN") : draft);

export const useFlightSearchForm = (mode: SearchFormMode = "single") => {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const lastCriteria = useSelector((state: RootState) => state.flights.criteria);
  const { currency, setCurrency } = useFlightCurrency();
  const shape = mode === "multi" ? asMultiCity : asSingle;

  const [draft, setDraft] = useState<SearchDraft>(() => shape(initialDraft()));
  const [submitted, setSubmitted] = useState(false);
  const [recent, setRecent] = useState<RecentFlightSearch[]>(loadRecentSearches);
  // Which date box should open its calendar; the key changes on every request so it can re-open
  const [openDate, setOpenDate] = useState<{ index: number; key: number } | null>(null);
  const today = localToday();

  // ---- the search in the URL (multi-city page after Search, or a shared link)
  const urlCriteria = useMemo(
    () => (mode === "multi" ? criteriaFromQuery(params, currency) : null),
    // Only the URL matters here, not later currency changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mode, params]
  );

  // ---- prefill from Popular routes / Browse by class / campaigns / the other page (?from=LOS&to=LON&cabin=BUSINESS)
  const prefill = useMemo(
    () => ({ from: params.get("from"), to: params.get("to"), cabin: params.get("cabin") }),
    [params]
  );
  const hasPrefill = Boolean(prefill.from || prefill.to || prefill.cabin);

  useEffect(() => {
    if (!hasPrefill) return;
    let cancelled = false;
    Promise.all([prefill.from ? resolvePlace(prefill.from) : null, prefill.to ? resolvePlace(prefill.to) : null]).then(
      ([origin, destination]) => {
        if (cancelled) return;
        const cabin = CABINS.find((c) => c.value === prefill.cabin)?.value;
        setDraft((d) => ({
          ...d,
          legs: [
            { ...d.legs[0], origin: origin ?? d.legs[0].origin, destination: destination ?? d.legs[0].destination },
            ...d.legs.slice(1),
          ],
          cabin: cabin ?? d.cabin,
        }));
        if (origin || destination) setOpenDate({ index: 0, key: Date.now() });
        if (mode === "single") {
          document.getElementById(FLIGHT_SEARCH_ANCHOR_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        setParams(
          (current) => {
            ["from", "to", "cabin"].forEach((key) => current.delete(key));
            return current;
          },
          { replace: true }
        );
      }
    );
    return () => {
      cancelled = true;
    };
  }, [hasPrefill, mode, prefill, setParams]);

  // ---- otherwise start from the search in the URL, else the last search on this device
  const restored = useRef(false);
  useEffect(() => {
    if (restored.current || hasPrefill) return;
    const source = urlCriteria ?? lastCriteria;
    if (!source) return;
    restored.current = true;
    let cancelled = false;
    restoreDraft(source).then((next) => {
      if (!cancelled) setDraft(shape(next));
    });
    return () => {
      cancelled = true;
    };
  }, [hasPrefill, lastCriteria, shape, urlCriteria]);

  // ---- editing
  const updateLeg = useCallback((index: number, patch: Partial<DraftLeg>) => {
    setDraft((d) => ({ ...d, legs: d.legs.map((leg, i) => (i === index ? { ...leg, ...patch } : leg)) }));
  }, []);

  const swapPlaces = useCallback((index: number) => {
    setDraft((d) => ({
      ...d,
      legs: d.legs.map((leg, i) => (i === index ? { ...leg, origin: leg.destination, destination: leg.origin } : leg)),
    }));
  }, []);

  /** Within a page the trip type changes in place; across pages it navigates with From and To. */
  const setTripType = useCallback(
    (tripType: TripType) => {
      const first = draft.legs[0];
      const carry = { from: first?.origin?.code, to: first?.destination?.code };
      if (mode === "single" && tripType === "MULTI_CITY") {
        navigate(flightMultiCityPath(carry));
        return;
      }
      if (mode === "multi" && tripType !== "MULTI_CITY") {
        navigate(flightsLandingPath(carry));
        return;
      }
      setDraft((d) => withTripType(d, tripType));
    },
    [draft.legs, mode, navigate]
  );

  const setReturn = useCallback((patch: { returnDate?: string; returnFlexibleDays?: FlexibleDays }) => {
    setDraft((d) => ({ ...d, ...patch }));
  }, []);

  // A departure after the chosen return clears the return, so it can't end up before it
  const setDepartDate = useCallback((index: number, date: string) => {
    setDraft((d) => ({
      ...d,
      legs: d.legs.map((leg, i) => (i === index ? { ...leg, date } : leg)),
      returnDate: index === 0 && d.returnDate && d.returnDate < date ? null : d.returnDate,
    }));
  }, []);

  const addLeg = useCallback(() => {
    setDraft((d) => {
      if (d.legs.length >= MAX_MULTI_CITY_LEGS) return d;
      const last = d.legs[d.legs.length - 1];
      return { ...d, legs: [...d.legs, { ...emptyLeg(), origin: last.destination }] };
    });
  }, []);

  const removeLeg = useCallback((index: number) => {
    setDraft((d) => (d.legs.length <= MIN_MULTI_CITY_LEGS ? d : { ...d, legs: d.legs.filter((_, i) => i !== index) }));
  }, []);

  const setTravellers = useCallback((passengers: PassengerCounts, cabin: CabinClass) => {
    setDraft((d) => ({ ...d, passengers, cabin }));
  }, []);

  const setNonStop = useCallback((nonStop: boolean) => setDraft((d) => ({ ...d, nonStop })), []);
  const setNearby = useCallback((includeNearbyAirports: boolean) => setDraft((d) => ({ ...d, includeNearbyAirports })), []);

  const pathFor = useCallback(
    (criteria: FlightSearchCriteria) =>
      criteria.tripType === "MULTI_CITY" ? flightMultiCityPath(criteriaToQuery(criteria)) : flightResultsPath(criteriaToQuery(criteria)),
    []
  );

  /** "Search again": runs it if its dates are still ahead, otherwise fills the form to pick new dates. */
  const searchAgain = useCallback(
    async (entry: RecentFlightSearch) => {
      if (entry.criteria.legs.every((leg) => leg.date >= localToday())) {
        navigate(pathFor({ ...entry.criteria, currency }));
        return;
      }
      if (entry.criteria.tripType === "MULTI_CITY" && mode === "single") {
        navigate(flightMultiCityPath({ from: entry.criteria.legs[0].origin, to: entry.criteria.legs[0].destination }));
        return;
      }
      setDraft(shape(await restoreDraft(entry.criteria, entry.places)));
      setSubmitted(false);
      setOpenDate({ index: 0, key: Date.now() });
      document.getElementById(FLIGHT_SEARCH_ANCHOR_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [currency, mode, navigate, pathFor, shape]
  );

  // ---- validation and submit
  const errors = useMemo(() => (submitted ? validateSearch(draft, today) : {}), [submitted, draft, today]);

  const minDateForLeg = (index: number) => {
    const previous = index > 0 ? draft.legs[index - 1].date : null;
    return previous && previous > today ? previous : today;
  };

  const submit = (event?: React.FormEvent) => {
    event?.preventDefault();
    setSubmitted(true);
    if (Object.keys(validateSearch(draft, today)).length > 0) return;
    const criteria = toCriteria(draft, currency);
    const places = draft.legs.flatMap((leg) => [leg.origin, leg.destination]).filter((p): p is Place => p !== null);
    setRecent(saveRecentSearch(criteria, places));
    navigate(pathFor(criteria));
  };

  return {
    draft,
    errors,
    currency,
    recent,
    openDateKey: (index: number) => (openDate?.index === index ? openDate.key : undefined),
    minDateForLeg,
    canAddLeg: draft.legs.length < MAX_MULTI_CITY_LEGS,
    canRemoveLeg: draft.legs.length > MIN_MULTI_CITY_LEGS,
    setCurrency,
    setTripType,
    updateLeg,
    swapPlaces,
    setDepartDate,
    setReturn,
    addLeg,
    removeLeg,
    setTravellers,
    setNonStop,
    setNearby,
    searchAgain,
    submit,
  };
};
