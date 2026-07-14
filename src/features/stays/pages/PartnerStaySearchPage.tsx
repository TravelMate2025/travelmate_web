import { useEffect, useMemo, useState } from "react";
import { Autocomplete, Button, TextField } from "@mui/material";
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
import { stayResultsLabel } from "../../shared/booking/bookingFlowLabels";
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
  const [checkIn, setCheckIn] = useState(storedSearch?.checkIn ?? "");
  const [checkOut, setCheckOut] = useState(storedSearch?.checkOut ?? "");
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
    if (!selectedDestination || !checkIn || !checkOut) return;

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

  // Field density/layout matches the Transfers tab (CarBookingFirstScreen/
  // Page.tsx) deliberately -- no inner card (WelcomePage's own outer card
  // already wraps every tab equally), no header block, same 44px compact
  // field height, same flat-row layout, same modest fixed-width button.
  // Stays previously nested a second card inside that outer one and added a
  // full header block Transfers never had, which is what made it read as
  // much bigger than the other two tabs for the same job.
  const compactFieldSx = {
    "& .MuiInputBase-root": { height: "44px", borderRadius: "8px" },
  };

  return (
    <div>
      <form
        className="flex lg:flex-row flex-col justify-normal lg:justify-center lg:items-end gap-4 lg:min-w-full lg:max-w-full"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-4 w-full">
          <div className="flex lg:flex-row flex-col justify-between lg:items-center gap-4 w-full">
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="stay-destination" className="text-sm text-gray-700">
                Destination
              </label>
              <Autocomplete
                id="stay-destination"
                size="small"
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
                sx={compactFieldSx}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Search city, area, or property" />
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

            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="stay-type" className="text-sm text-gray-700">
                Stay type
              </label>
              <select
                id="stay-type"
                value={stayType}
                onChange={(event) => setStayType(event.target.value as StaySearchStayType)}
                className="rounded-lg border border-gray-300 px-3 text-sm h-[44px]"
              >
                <option value="">Any stay type</option>
                {staySearchStayTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2 w-full">
              <label className="text-sm text-gray-700">Dates</label>
              <ReusableDateSelector
                onDateChange={(start, end) => {
                  setCheckIn(start);
                  setCheckOut(end);
                }}
                initialValue={checkIn && checkOut ? `${checkIn} - ${checkOut}` : ""}
              />
            </div>
          </div>

          <div className="flex lg:flex-row flex-col justify-between items-center w-full gap-4">
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="stay-adults" className="text-sm text-gray-700">
                Adults
              </label>
              <TextField
                id="stay-adults"
                type="number"
                size="small"
                inputProps={{ min: 1 }}
                value={adults}
                onChange={(event) => setAdults(Number(event.target.value))}
                sx={compactFieldSx}
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="stay-children" className="text-sm text-gray-700">
                Children
              </label>
              <TextField
                id="stay-children"
                type="number"
                size="small"
                inputProps={{ min: 0 }}
                value={children}
                onChange={(event) => setChildren(Number(event.target.value))}
                sx={compactFieldSx}
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="stay-rooms" className="text-sm text-gray-700">
                Rooms
              </label>
              <TextField
                id="stay-rooms"
                type="number"
                size="small"
                inputProps={{ min: 1 }}
                value={rooms}
                onChange={(event) => setRooms(Number(event.target.value))}
                sx={compactFieldSx}
              />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          variant="contained"
          disabled={!selectedDestination || !checkIn || !checkOut}
          sx={{
            textTransform: "none",
            backgroundColor: "#023E8A",
            fontWeight: 500,
            borderRadius: "8px",
            paddingY: "12px",
            width: { xs: "100%", lg: "120px" },
            flexShrink: 0,
            "&:hover": { backgroundColor: "#0450A2" },
          }}
        >
          {stayResultsLabel()}
        </Button>
      </form>
    </div>
  );
}
