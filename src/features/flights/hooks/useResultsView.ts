import { useMemo, useState } from "react";
import { format } from "date-fns";
import type { FlightOffer, FlightSearchCriteria, Place } from "../types";
import {
  NO_FILTERS,
  activeFilterCount,
  destinationIsCity,
  facetsOf,
  matchesFilters,
  sortOffers,
  totalMinutes,
  type ResultFilters,
  type SortMode,
} from "../results/offerFacts";

const PAGE_SIZE = 10;

// Sorting, filtering and paging of one result set. UI state only (CLAUDE.md:
// not in Redux); it resets when the search changes because the page remounts it.
export const useResultsView = (
  offers: FlightOffer[],
  criteria: FlightSearchCriteria,
  places: Record<string, Place>,
  initialSort: SortMode = "BEST"
) => {
  const [sort, setSort] = useState<SortMode>(initialSort);
  const [filters, setFilters] = useState<ResultFilters>(NO_FILTERS);
  const [shown, setShown] = useState(PAGE_SIZE);

  const facets = useMemo(() => facetsOf(offers), [offers]);
  const filtered = useMemo(() => offers.filter((o) => matchesFilters(o, filters)), [offers, filters]);
  const sorted = useMemo(() => sortOffers(filtered, sort), [filtered, sort]);

  // Each tab shows its own top offer, over the filtered list (mock: "$787.70 · 37h 10m total")
  const tabs = useMemo(
    () =>
      (["BEST", "CHEAPEST", "FASTEST"] as SortMode[]).map((mode) => ({ mode, top: sortOffers(filtered, mode)[0] ?? null })),
    [filtered]
  );
  const fastestToken = useMemo(() => sortOffers(offers, "FASTEST")[0]?.offerToken ?? null, [offers]);

  const noteContext = useMemo(
    () => ({ today: format(new Date(), "yyyy-MM-dd"), fastestToken, destinationIsCity: destinationIsCity(criteria, places) }),
    [criteria, fastestToken, places]
  );

  const updateFilters = (patch: Partial<ResultFilters>) => {
    setFilters((f) => ({ ...f, ...patch }));
    setShown(PAGE_SIZE);
  };

  return {
    sort,
    setSort: (mode: SortMode) => {
      setSort(mode);
      setShown(PAGE_SIZE);
    },
    tabs,
    filters,
    updateFilters,
    resetFilters: () => updateFilters(NO_FILTERS),
    activeFilters: activeFilterCount(filters),
    facets,
    visible: sorted.slice(0, shown),
    total: offers.length,
    matching: sorted.length,
    canShowMore: shown < sorted.length,
    showMore: () => setShown((n) => n + PAGE_SIZE),
    noteContext,
    totalMinutesOf: totalMinutes,
  };
};
