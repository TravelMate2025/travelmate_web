import { useEffect, useMemo, useState } from "react";
import { Autocomplete, Box, Button, TextField } from "@mui/material";
import { format, addDays } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../../store";
import { clearStaysCache, setLocationDetails, setSearchParams } from "../slice";
import { bookingFlowRoutes } from "../../shared/bookingFlowRoutes";
import {
  staySearchStayTypeOptions,
  partnerStayLocationToOption,
  type StaySearchLocationOption,
  type StaySearchStayType,
} from "../../shared/booking/staySearchOptions";
import { fetchPartnerStayLocations } from "../../shared/partnerLocationsService";
import {
  staySearchLabel,
  stayResultsLabel,
} from "../../shared/booking/bookingFlowLabels";
import ReusableDateSelector from "../components/ReusableDateSelector";

const recentSearchStorageKey = "travelmate_recent_destination_searches";
const initialStayType = "" as StaySearchStayType;

function normalizeText(value: string) {
  return value.toLowerCase().trim();
}

function optionMatchesQuery(option: StaySearchLocationOption, query: string) {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return true;
  const searchTerms = [
    option.destinationLabel,
    option.country,
    ...option.adminLevels,
    ...option.cities,
  ];
  return searchTerms.some((term) => normalizeText(term).includes(normalizedQuery));
}

function readRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(recentSearchStorageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeRecentSearches(destinationLabel: string) {
  if (typeof window === "undefined") return;
  try {
    const existing = readRecentSearches().filter((item) => item !== destinationLabel);
    const next = [destinationLabel, ...existing].slice(0, 5);
    window.localStorage.setItem(recentSearchStorageKey, JSON.stringify(next));
  } catch {
    // ignore storage failures
  }
}

export default function PartnerStaySearchPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const storedSearch = useSelector((state: RootState) => state.stays.searchParams);

  const [locationOptions, setLocationOptions] = useState<StaySearchLocationOption[]>([]);

  const initialDestination = useMemo(
    () =>
      locationOptions.find(
        (option) =>
          option.country === storedSearch?.country &&
          option.adminLevels.includes(storedSearch?.adminLevel1 ?? "") &&
          option.cities.includes(storedSearch?.city ?? ""),
      ) ?? null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locationOptions, storedSearch?.adminLevel1, storedSearch?.city, storedSearch?.country],
  );

  const [selectedDestination, setSelectedDestination] =
    useState<StaySearchLocationOption | null>(initialDestination);
  const [stayType, setStayType] = useState<StaySearchStayType>(
    (storedSearch?.stayType as StaySearchStayType | undefined) ?? initialStayType,
  );
  const [checkIn, setCheckIn] = useState(
    storedSearch?.checkIn ?? format(new Date(), "yyyy-MM-dd"),
  );
  const [checkOut, setCheckOut] = useState(
    storedSearch?.checkOut ?? format(addDays(new Date(), 7), "yyyy-MM-dd"),
  );
  const [adults, setAdults] = useState(storedSearch?.adults ?? 2);
  const [children, setChildren] = useState(storedSearch?.children ?? 0);
  const [rooms, setRooms] = useState(storedSearch?.rooms ?? 1);
  const [recentSearches, setRecentSearches] = useState<string[]>(readRecentSearches);

  useEffect(() => {
    fetchPartnerStayLocations()
      .then((data) => {
        const mapped = data.locations.map(partnerStayLocationToOption);
        if (mapped.length > 0) setLocationOptions(mapped);
      })
      .catch((error) => {
        console.error("[Stays][locations] failed to load partner inventory", error);
      });
  }, []);

  useEffect(() => {
    if (!selectedDestination && initialDestination) {
      setSelectedDestination(initialDestination);
    }
  }, [initialDestination, selectedDestination]);

  // Recents first, then the rest of the canonical list deduplicated
  const autocompleteOptions = useMemo(() => {
    const recentOptions = recentSearches
      .map((label) =>
        locationOptions.find((option) => option.destinationLabel === label),
      )
      .filter((option): option is StaySearchLocationOption => Boolean(option));
    const recentLabels = new Set(recentOptions.map((option) => option.destinationLabel));
    return [
      ...recentOptions,
      ...locationOptions.filter((option) => !recentLabels.has(option.destinationLabel)),
    ];
  }, [recentSearches, locationOptions]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedDestination) return;

    writeRecentSearches(selectedDestination.destinationLabel);
    setRecentSearches(readRecentSearches());

    dispatch(clearStaysCache());
    dispatch(
      setLocationDetails({
        name: selectedDestination.destinationLabel,
        country_name: selectedDestination.country,
        country_code: selectedDestination.country.slice(0, 2).toUpperCase(),
        code: selectedDestination.cities[0].toLowerCase().replace(/\s+/g, "-"),
        adminLevel1: selectedDestination.adminLevels[0],
        city: selectedDestination.cities[0],
        stayType,
      }),
    );
    dispatch(
      setSearchParams({
        destination: selectedDestination.cities[0] || selectedDestination.destinationLabel,
        country: selectedDestination.country,
        adminLevel1: selectedDestination.adminLevels[0],
        city: selectedDestination.cities[0],
        stayType,
        checkIn,
        checkOut,
        adults,
        children,
        rooms,
      }),
    );

    navigate(`${bookingFlowRoutes.stayResults}?flow=partner`);
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-8">
      <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm font-medium text-blue-700">{staySearchLabel()}</p>
            <h1 className="text-2xl font-semibold text-gray-900">Find a destination</h1>
            <p className="mt-1 text-sm text-gray-600">
              Search by destination first, then we resolve the partner location behind the scenes.
            </p>
          </div>

          <form className="grid gap-4 lg:grid-cols-2" onSubmit={handleSubmit}>
            <div className="lg:col-span-2">
              <Autocomplete
                options={autocompleteOptions}
                value={selectedDestination}
                onChange={(_, newValue) => setSelectedDestination(newValue)}
                getOptionLabel={(option) => option.destinationLabel}
                isOptionEqualToValue={(option, value) =>
                  option.destinationLabel === value.destinationLabel
                }
                groupBy={(option) =>
                  recentSearches.includes(option.destinationLabel)
                    ? "Recent searches"
                    : "Destinations"
                }
                filterOptions={(options, { inputValue }) =>
                  inputValue
                    ? options.filter((option) => optionMatchesQuery(option, inputValue))
                    : options
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Destination"
                    placeholder="Search city, area, or property"
                  />
                )}
                renderOption={(props, option) => {
                  const { key, ...rest } = props as React.HTMLAttributes<HTMLLIElement> & { key?: React.Key };
                  return (
                    <li key={key} {...rest}>
                      <span className="flex-1">{option.destinationLabel}</span>
                      <span className="ml-2 text-xs text-gray-400">
                        {option.cities[0]}, {option.adminLevels[0]}
                      </span>
                    </li>
                  );
                }}
              />
            </div>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-gray-700">Stay type</span>
              <select
                value={stayType}
                onChange={(event) => setStayType(event.target.value as StaySearchStayType)}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">Any stay type</option>
                {staySearchStayTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-2">
              <span className="text-sm font-medium text-gray-700">Dates</span>
              <ReusableDateSelector
                onDateChange={(start, end) => {
                  setCheckIn(start);
                  setCheckOut(end);
                }}
              />
            </div>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-gray-700">
                Guests
                <span className="ml-1 text-xs font-normal text-gray-400">
                  (adults / children / rooms)
                </span>
              </span>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  min={1}
                  value={adults}
                  onChange={(event) => setAdults(Number(event.target.value))}
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                  aria-label="Adults"
                />
                <input
                  type="number"
                  min={0}
                  value={children}
                  onChange={(event) => setChildren(Number(event.target.value))}
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                  aria-label="Children"
                />
                <input
                  type="number"
                  min={1}
                  value={rooms}
                  onChange={(event) => setRooms(Number(event.target.value))}
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                  aria-label="Rooms"
                />
              </div>
            </label>

            <Box className="lg:col-span-2 flex justify-end">
              <Button
                type="submit"
                variant="contained"
                disabled={!selectedDestination}
                sx={{ textTransform: "none" }}
              >
                Show {stayResultsLabel()}
              </Button>
            </Box>
          </form>
        </div>
      </div>
    </div>
  );
}
