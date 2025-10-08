import Navbar from "../../homePage/Navbar";
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";

import {
  Button,

  FormControl,
  Grid,
  PaginationItem,
 
  useMediaQuery,
  useTheme,
} from "@mui/material";

import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";


import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import {  format } from "date-fns";

import { Divider,  } from "@mui/material";

import { Link,  } from "react-router-dom";
import TravelmateApp from "../../homePage/TravelmateApp";
import Footer from "../../../components/2Footer";

import { Stack, Pagination,  } from "@mui/material";
import { useLocation } from "react-router-dom";

import SortIcon from "@mui/icons-material/Sort";

import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";


import Breadcrumb from "../../BreadCrumb";

import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

import { Icon } from "@iconify/react";


interface Departure {
  id: number;
  planeName: string;
  image: string;
  spaceleft: string;
  class: string;
  timefrom: string;
  placefrom: string;
  duration: string;
  non: string;
  flightcode: string;
  timeto: string;
  placeto: string;
  refundable: string;
  price: string;
  passenger: string;
  tax: string;
}

interface DepartureListProps {
  departureInfo: Departure[];
}


import SortFlight from "../../../features/flights/components/SortFlight";

import DepartCard from "../../../features/flights/components/DepartCard";
import { LocationSelector } from "../../../features/flights/components/LocationSelector";
import { DateSelector } from "../../../features/flights/components/DateSelector";
import { PassengerSelector } from "../../../features/flights/components/PassengerSelector";
import { ClassSelector } from "../../../features/flights/components/ClassSelector";
import {
 
  useFlightBooking,
} from "../../../features/flights/hooks/useFlightBooking";
import {
  FlightDrawer,

  MultiCitySelection,
} from "../../../features/flights/components/FlightDrawer";


import {
  FlightOffer,
 

} from "../../../features/flights/types";
import {
  buildFlightPayload,
  TripType,
  useLazyFetchFlightsQuery
} from "../../../features/flights/api/flightApi";
import { useLazyGetLocationInfoQuery } from "../../../features/flights/api/locationApi";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {


  SimpleTripFormValues,
  simpleTripSchema,
} from "../../homePage/Flight";
import FilterFlight, { FlightFilters } from "../../../features/flights/components/FilterFlight";

const DeparturePage: React.FC<DepartureListProps> = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [fetchCoords, { data }] = useLazyGetLocationInfoQuery();
  const location = useLocation();

  const simpleForm = useForm<SimpleTripFormValues>({
    resolver: yupResolver(simpleTripSchema),
    defaultValues: {
      tripType: "round-trip",
      from: undefined,
      to: undefined,
      date: undefined,
      class: "",
      passengers: { adults: 1, children: 0, infants: 0 },
    },
  });

  const [_country, setCountry] = useState<string>("Detecting...");

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            fetchCoords({ latitude, longitude });
          } catch (error) {
            console.error("Geolocation lookup failed:", error);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    } else {
      setCountry("Geolocation not supported");
    }
  }, []);
  const {
    from: initialFrom,
    to: initialTo,

    date,
    flights: storedFlights,
    passengers,

    flightClass: initialFlight,
    tripType: selectedTrip,
  } = location.state;

  const {
    tripType,
    selectedFrom,
    selectedTo,

    selectedClass,

    isCountryReady,
    flights,
  } = useFlightBooking();

  const [
    fetchFlights,
    { data: flightResults, error, isLoading, isFetching: fetchingFlight },
  ] = useLazyFetchFlightsQuery();
  const [_locations, _setLocations] = useState([
    "Ibadan, Oyo",
    "Abuja",
    "Port Harcourt",
  ]);

  const [counts, setCounts] = useState({
    adults: 0,
    children: 0,
    infants: 0,
    extraBags: 0,
  });

  const handleIncrement = (type: keyof typeof counts) => {
    setCounts((prevCounts) => ({
      ...prevCounts,
      [type]: prevCounts[type] + 1,
    }));
  };

  const handleDecrement = (type: keyof typeof counts) => {
    setCounts((prevCounts) => ({
      ...prevCounts,
      [type]: prevCounts[type] > 0 ? prevCounts[type] - 1 : 0,
    }));
  };

  const isSimpleTrip =
    selectedTrip === "round-trip" || selectedTrip === "one-way";
  const isMultiCity = selectedTrip === "multi-city";
  const getFlight = useCallback(
    (formData?: SimpleTripFormValues) => {
      try {
        if (isMultiCity) {
          const payload = buildFlightPayload({
            tripType: tripType as TripType,
            initialFrom,
            initialTo,
            selectedFrom: formData?.from as any,
            selectedTo: formData?.to as any,
            date: formData?.date || date, // prefer form data if present
            passengerCounts: formData?.passengers || passengers,
            travelClass: formData?.class || selectedClass,
            currency: data?.currency || "NGN",
            // @ts-ignore
            flights,
          });

          // @ts-ignore
          fetchFlights(payload);
        } else {
          const payload = buildFlightPayload({
            tripType: tripType as TripType,
            initialFrom,
            initialTo,
            selectedFrom: selectedFrom as any,
            selectedTo: selectedTo as any,
            date: formData?.date || date, // prefer form data if present
            passengerCounts: formData?.passengers || passengers,
            travelClass: formData?.class || selectedClass,
            currency: data?.currency || "NGN",
            // @ts-ignore
            flights,
          });

          // @ts-ignore
          fetchFlights(payload);
        }
      } catch (err) {
        console.error("Failed to fetch flights:", err);
      }
    },
    [
      tripType,
      initialFrom,
      initialTo,
      selectedFrom,
      selectedTo,
      date,
      passengers,
      selectedClass,
      data?.currency,
      flights,
      fetchFlights,
    ]
  );
  // console.log(location);

  useEffect(() => {
    // if (data?.currency) {

    // @ts-ignore
    getFlight({
      class: initialFlight,
      date,
      from: initialFrom,
      passengers,
      to: initialTo,
    });
    // }
  }, [data, getFlight]);

  const [page, setPage] = useState<number>(1);
  const [openClick, setOpenClick] = useState<boolean>(false);
  const [selectedDepartureId, setSelectedDepartureId] = useState<string | null>(
    null
  );

  const handleOpen = (depart: FlightOffer) => {
    setSelectedDepartureId(depart.id);
    setOpenClick(true);
  };

  const handleCloseClick = () => {
    setOpenClick(false);
    setSelectedDepartureId(null);
  };
  const departures = flightResults?.data || [];
  const selectedDeparture = departures.find(
    (d: any) => d.id === selectedDepartureId
  );

  const [isOpenFrom, setIsOpenFrom] = useState(false);
  const [isOpenTo, setIsOpenTo] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const flightIndex = 0;

  const [currentSegment, setCurrentSegment] = useState(0); // start at first flight
  const [visitedSegments, setVisitedSegments] = useState([0]);
  const currentFlight = storedFlights[flightIndex];
  const openDialog = () => {
    setIsDialogOpen(true);
  };
  const goNextSegment = () => {
    if (currentSegment < flights.length - 1) {
      const next = currentSegment + 1;
      setCurrentSegment(next);

      // Add to visited segments if not already there
      if (!visitedSegments.includes(next)) {
        setVisitedSegments((prev) => [...prev, next]);
      }
    }
  };

  // const goPrevSegment = () => {
  //   if (currentSegment > 0) {
  //     setCurrentSegment(currentSegment - 1);
  //   }
  // };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };
  const fromAnchors = useRef<Record<string, HTMLDivElement | null>>({});
  const toAnchors = useRef<Record<string, HTMLDivElement | null>>({});
  const [isSortOpen, setIsSortOpen] = useState(false);

  const [selectedOption, setSelectedOption] = useState("basic");

  const ITEMS_PER_PAGE = 4;

  useEffect(() => {
    if (isSimpleTrip) {
      simpleForm.reset({
        class: initialFlight,
        date: date,
        from: initialFrom,
        to: initialTo,
        passengers,
        tripType: tripType as any,
      });
    } else {
      simpleForm.reset({
        class: location.state.flightClass,
        tripType: tripType as any,
        passengers: location.state.passengers,
        date: currentFlight.date,
        from: currentFlight.from,
        to: currentFlight.to,
      });
    }
  }, [location]);

  const [filters, setFilters] = useState<FlightFilters>({
    priceRange: [2000, 10_000_000],
    stops: null,
    refundPolicy: null,
    airlines: [],
  });
  const [multiCitySelections, setMultiCitySelections] = useState<
    MultiCitySelection[]
  >([]);
  const handleFilterChange = (newFilters: FlightFilters) => {
    console.log(newFilters);

    setFilters(newFilters);
  };

  // const [tempValue, setTempValue] = useState<number[]>([2000, 10000000]);

  const [selectedSort, setSelectedSort] = useState<string | undefined>(
    "recommended"
  );

  const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  // useEffect(() => {
  //   const resp = async () => {

  //         const res = axios.get(
  //           "https://r2.datahub.io/clvyjaryy0000la0cxieg4o8o/main/raw/data/countries.geojson"
  //         );
  //         console.log((await res).data);
  //   }
  //   resp()
  // }, [])

  // Filter flights before sorting
  const filteredDepartures = useMemo(() => {
    return (flightResults?.data || []).filter((flight: any) => {
      const price = parseFloat(flight.price.total || "0");

      // Price range
      if (price < filters.priceRange[0] || price > filters.priceRange[1])
        return false;

      // Stops filter
      if (filters.stops !== null) {
        console.log(filters);

        const stops = flight.itineraries[0]?.segments?.length - 1 || 0;
        console.log(stops);

        if (filters.stops === "Non Stop" && stops > 0) return false;
        if (filters.stops === "1 Stop" && stops !== 1) return false;
        if (filters.stops === "1+ Stop" && stops < 2) return false;
      }

      // Refund policy
      if (filters.refundPolicy === "refundable" && !flight.refundable)
        return false;
      if (filters.refundPolicy === "non-refundable" && flight.refundable)
        return false;

      // Airline filter
      if (filters.airlines.length > 0) {
        const carrierCode = flight.validatingAirlineCodes?.[0] || "";
        if (!filters.airlines.includes(carrierCode)) return false;
      }

      return true;
    });
  }, [flightResults?.data, filters]);

  // sort using the already-filtered list
  const sortedDepartures = useMemo(() => {
    // start from the filtered list (not the original departures)
    const sortedArray = [...filteredDepartures];

    const parsePrice = (p: any) => {
      if (!p && p !== 0) return 0;
      // price might be "2304.20" or "2,304.20" or a number
      const n = typeof p === "number" ? p : String(p).replace(/[,₦\$]/g, "");
      return parseFloat(n as any) || 0;
    };

    const durationToMinutes = (raw: string | undefined) => {
      if (!raw) return 0;

      // support ISO 8601 durations like "PT2H30M"
      const isoMatch = String(raw).match(/PT(?:(\d+)H)?(?:(\d+)M)?/i);
      if (isoMatch) {
        const h = parseInt(isoMatch[1] || "0", 10);
        const m = parseInt(isoMatch[2] || "0", 10);
        return h * 60 + m;
      }

      // support "2h 30m", "2 hrs 30 m", "2hrs30m", "2hrs", "150m", "2h30m", "2hrs"
      const hoursMatch = String(raw).match(/(\d+)\s*h(?:rs?)?/i);
      const minsMatch = String(raw).match(/(\d+)\s*m/i);
      if (hoursMatch || minsMatch) {
        const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
        const mins = minsMatch ? parseInt(minsMatch[1], 10) : 0;
        return hours * 60 + mins;
      }

      // support "2hrs" or "150m" or "2hrs 30m" handled above; fallback to numbers in string
      const digits = String(raw).match(/(\d+)/);
      return digits ? parseInt(digits[1], 10) : 0;
    };

    switch (selectedSort) {
      case "price_low":
        sortedArray.sort(
          (a: any, b: any) =>
            parsePrice(a.price?.total) - parsePrice(b.price?.total)
        );
        break;

      case "price_high":
        sortedArray.sort(
          (a: any, b: any) =>
            parsePrice(b.price?.total) - parsePrice(a.price?.total)
        );
        break;

      case "shortest_duration":
        sortedArray.sort(
          (a: any, b: any) =>
            durationToMinutes(a.itineraries?.[0]?.duration) -
            durationToMinutes(b.itineraries?.[0]?.duration)
        );
        break;

      case "longest_duration":
        sortedArray.sort(
          (a: any, b: any) =>
            durationToMinutes(b.itineraries?.[0]?.duration) -
            durationToMinutes(a.itineraries?.[0]?.duration)
        );
        break;

      case "recommended":
      default:
        // keep API order for recommended (no-op)
        break;
    }

    return sortedArray;
  }, [selectedSort, filteredDepartures]);

  useEffect(() => {
    setPage(1);
  }, [selectedSort, filters]);


  const paginatedItems = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return sortedDepartures.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [page, sortedDepartures]);

  const getNewFlight = useCallback(
    (formData?: any) => {
      try {
        const payload = buildFlightPayload({
          tripType:
            formData?.tripType || tripType || ("round-trip" as TripType),
          initialFrom, // <-- add this
          initialTo, // <-- add this
          selectedFrom: formData?.from || selectedFrom || initialFrom,
          selectedTo: formData?.to || selectedTo || initialTo,
          date: formData?.date || date,
          passengerCounts: formData?.passengers || passengers,
          travelClass: formData?.class || selectedClass,
          currency: data?.currency,
          flights,
        });

        // @ts-ignore
        fetchFlights(payload);
      } catch (err) {
        console.error("Failed to fetch flights:", err);
      }
    },
    [
      tripType,
      selectedFrom,
      selectedTo,
      date,
      passengers,
      selectedClass,
      data?.currency,
      flights,
      fetchFlights,
    ]
  );

  const onSearch = simpleForm.handleSubmit((formData) => {
    getNewFlight(formData);
  });

  return (
    <div>
      <div>
        <Navbar />
      </div>

      <div className="w-full h-full  md:bg-[#CCD8E833] mt-[73px]  ">
        <div className="mb-6 md:hidden ">
          <Link to="/">
            <div
              style={{ position: "absolute", left: "28px", top: "85px" }}
              className="w-[40px] h-[40px] p-[8px]  bg-white border-[0.5px] border-[#EBECED] shadow-md rounded-[4px] "
            >
              <ArrowBackIosNewOutlinedIcon className="font-bold " />
            </div>
          </Link>
          <p className="text-center font-semibold text-[20px]  mt-[90px]">
            Departure Flight
          </p>
        </div>

        <div className="hidden md:block w-[90%] m-auto ">
          <div className="flex justify-center pt-5 pb-6 mb-[18px]">
            <form onSubmit={onSearch}>
              <FormControl sx={{ width: "100%" }}>
                {/* Simple Trip */}

                <Grid container spacing={2}>
                  {/* From */}
                  <Grid item xs={12} md={2}>
                    <Controller
                      name="from"
                      control={simpleForm.control}
                      render={({ field }) => (
                        <LocationSelector
                          id="from"
                          label="From"
                          onSelect={field.onChange}
                          isOpen={isOpenFrom}
                          defaultValue={field.value as any}
                          anchorEl={fromAnchors.current["single"] || null}
                          setAnchorEl={(el) =>
                            (fromAnchors.current["single"] =
                              el as HTMLDivElement | null)
                          }
                          setIsOpen={setIsOpenFrom}
                          onRemoveLocation={() => field.onChange("")}
                        />
                      )}
                    />
                    {simpleForm.formState.errors.from && (
                      <p className="text-red-500 text-sm">
                        {simpleForm.formState.errors.from.message}
                      </p>
                    )}
                  </Grid>

                  {/* To */}
                  <Grid item xs={12} md={2}>
                    <Controller
                      name="to"
                      control={simpleForm.control}
                      render={({ field }) => (
                        <LocationSelector
                          id="to"
                          label="To"
                          onSelect={field.onChange}
                          isOpen={isOpenTo}
                          defaultValue={field.value as any}
                          anchorEl={toAnchors.current["single"] || null}
                          setAnchorEl={(el) =>
                            (toAnchors.current["single"] =
                              el as HTMLDivElement | null)
                          }
                          setIsOpen={setIsOpenTo}
                          onRemoveLocation={() => field.onChange("")}
                        />
                      )}
                    />
                    {simpleForm.formState.errors.to && (
                      <p className="text-red-500 text-sm">
                        {simpleForm.formState.errors.to.message}
                      </p>
                    )}
                  </Grid>

                  {/* Date */}
                  <Grid item xs={12} md={2}>
                    <Controller
                      name="date"
                      control={simpleForm.control}
                      render={({ field }) => (
                        <DateSelector
                          id="departure-date"
                          label="Date"
                          value={
                            field.value
                              ? field.value instanceof Date
                                ? format(field.value, "dd MMM yyyy")
                                : `${format(
                                    field.value.startDate,
                                    "dd MMM yyyy"
                                  )} - ${format(
                                    field.value.endDate,
                                    "dd MMM yyyy"
                                  )}`
                              : ""
                          }
                          onDateChange={(val) => {
                            if (val instanceof Date) {
                              field.onChange(val); // <-- stores date
                            } else if (val?.startDate && val?.endDate) {
                              field.onChange(val); // <-- store range object
                            } else {
                              field.onChange(null);
                            }
                          }}
                          range={tripType === "round-trip"}
                        />
                      )}
                    />

                    {simpleForm.formState.errors.date && (
                      <p className="text-red-500 text-sm">
                        {simpleForm.formState.errors.date.message}
                      </p>
                    )}
                  </Grid>

                  {/* Passengers */}
                  <Grid item xs={12} md={2}>
                    <Controller
                      name="passengers"
                      control={simpleForm.control}
                      render={({ field }) => (
                        <PassengerSelector
                          id="passengers"
                          label="Passengers"
                          value={`${field.value.adults} Adult, ${field.value.children} Child, ${field.value.infants} Infant`}
                          counts={field.value as any}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    {simpleForm.formState.errors.passengers && (
                      <p className="text-red-500 text-sm">
                        {simpleForm.formState.errors.passengers.message}
                      </p>
                    )}
                  </Grid>

                  {/* Class */}
                  <Grid item xs={12} md={2}>
                    <Controller
                      name="class"
                      control={simpleForm.control}
                      render={({ field }) => (
                        <ClassSelector
                          id="class"
                          label="Class"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    {simpleForm.formState.errors.class && (
                      <p className="text-red-500 text-sm">
                        {simpleForm.formState.errors.class.message}
                      </p>
                    )}
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={2}
                    display="flex"
                    alignItems="flex-end"
                  >
                    <button
                      type="submit"
                      disabled={!isCountryReady as boolean}
                      className="bg-[#023E8A] h-[52px] disabled:bg-zinc-700 md:max-w-[140px] w-full text-center text-white font-inter text-base rounded-[8px] cursor-pointer hover:bg-[#012a5c] transition-colors"
                    >
                      Search
                    </button>
                  </Grid>
                </Grid>

                {/* Multi-City */}
              </FormControl>
            </form>
          </div>
        </div>

        <div className="md:mb-[20px] mt-[25px] w-[90%] m-auto md:hidden">
          <div className="border-1  border-[#023E8A] w-full bg-[#CCD8E81A] pt-[10px] pb-[10px] pr-[8px] pl-[8px] rounded-[8px]">
            <div className="flex gap-2 justify-between">
              <div className="text-[#181818]">
                <p className="text-[16px] font-medium">
                  {simpleForm.getValues("from")?.cityName} to{" "}
                  {simpleForm.getValues("to")?.cityName}
                </p>
                <p className="text-[14px] font-normal text-[#67696D]">
                  {(() => {
                    const dateValue = simpleForm.getValues("date");

                    if (dateValue instanceof Date) {
                      return dateValue.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }

                    if (
                      dateValue &&
                      typeof dateValue === "object" &&
                      "startDate" in dateValue &&
                      dateValue.startDate instanceof Date
                    ) {
                      return dateValue.startDate.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }

                    return "";
                  })()}
                  ,{" "}
                  {(simpleForm.getValues("passengers.adults") ?? 0) +
                    (simpleForm.getValues("passengers.children") ?? 0) +
                    (simpleForm.getValues("passengers.infants") ?? 0)}{" "}
                  passengers
                </p>
              </div>

              <Link to="/">
                <div>
                  <ModeEditOutlinedIcon className="  mt-3" />
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white w-full h-full md:pt-[20px] pb-[50px] mb-[100px] ">
          <div className="w-[90%] m-auto hidden md:block">
            <div className="flex gap-1 text-[15px] mb-4">
              {isMultiCity ? (
                <div className="flex gap-1 text-[15px] mb-4">
                  <span className="font-medium text-[#67696D]">Home</span>
                  {visitedSegments
                    .concat(currentSegment)
                    .filter(
                      (value, index, self) => self.indexOf(value) === index
                    )
                    .sort((a, b) => a - b) // ensure order
                    .map((idx) => (
                      <React.Fragment key={`segment-${idx}`}>
                        <span className="text-[#67696D]"> &gt; </span>
                        <span
                          className={`font-medium cursor-pointer transition-colors ${
                            currentSegment === idx
                              ? "text-[#023E8A]"
                              : "text-[#67696D]"
                          } hover:text-[#023E8A]`}
                          onClick={() => setCurrentSegment(idx)}
                        >
                          Departure Flight {idx + 1}
                        </span>
                      </React.Fragment>
                    ))}
                </div>
              ) : (
                <Breadcrumb />
              )}
            </div>
          </div>

          <Divider
            sx={{
              display: {
                xs: "none",
                md: "block",
              },
            }}
          />

          <div className="">
            <div className="mt-[26px] md:mb-[26px]">
              <div className="w-[90%] m-auto flex justify-between">
                <p className="text-[24px] font-inter font-semibold max-md:hidden">
                  {isMultiCity
                    ? `Departure Flight from
                          ${currentFlight.from.cityName} (${currentFlight.from.iataCode}) to
                          ${currentFlight.to.cityName} (${currentFlight.to.iataCode})`
                    : " Departure Flight"}
                </p>
                <div>
                  <div className="">
                    <Box sx={{ display: "flex", gap: "15px" }}>
                      <TextField
                        id="filter-input"
                        variant="outlined"
                        size="small"
                        placeholder="Filter"
                        aria-readonly="true"
                        onClick={openDialog}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              {/* <TuneIcon sx={{ color: "black" }} /> */}

                              <Icon
                                icon="mi:filter"
                                width="24"
                                height="24"
                                color="black"
                              />
                            </InputAdornment>
                          ),
                          readOnly: true,
                        }}
                        sx={{
                          width: "100px",
                          "& .MuiInputBase-root": {
                            height: "44px",
                            borderRadius: "8px",
                            borderColor: "#DEDFE1",
                            cursor: "pointer",
                          },
                          "& .MuiInputBase-input::placeholder": {
                            color: "black",
                            opacity: 1, // ensures full color visibility
                          },
                          "& .MuiInputBase-input": {
                            color: "black",
                          },
                        }}
                      />

                      {/* filter here */}

                      <FilterFlight
                        isMobile={isMobile}
                        filters={filters}
                        open={isDialogOpen}
                        onClose={closeDialog}
                        onChange={handleFilterChange}
                        onApply={() => {
                          setFilters({ ...filters });
                          closeDialog();
                        }}
                      />
                      <Button
                        variant="outlined"
                        sx={{
                          display: { xs: "block", md: "none" },
                          borderRadius: "8px",
                        }}
                        color="inherit"
                        onClick={() => setIsSortOpen(true)}
                      >
                        <SortIcon sx={{ color: "black" }} /> Sort
                      </Button>

                      <SortFlight
                        setValue={(value) => {
                          setSelectedSort(value);
                        }}
                        open={isSortOpen}
                        onClose={() => setIsSortOpen(false)}
                        isMobile={isMobile}
                        value={selectedSort}
                        handleApplyFilters={() => {}}
                      />
                    </Box>
                  </div>
                </div>
              </div>
            </div>
            <Divider />
          </div>

          <div>
            <div className="mt-[24px] w-[90%] m-auto cursor-pointer">
              {isLoading || fetchingFlight ? (
                <div className="flex justify-center mt-20">
                  Loading flights...
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center mt-20 text-red-600">
                  <ErrorOutlineIcon
                    sx={{ width: 60, height: 60, color: "red" }}
                  />
                  <p className="font-semibold text-[20px] mt-4">
                    Failed to load flights
                  </p>
                  <p className="text-[#67696D] text-center w-[80%] mt-2">
                    {"data" in error &&
                    typeof error.data === "object" &&
                    "message" in error.data
                      ? (error.data as { message?: string })?.message
                      : "Something went wrong while fetching flight offers. Please try again later."}
                  </p>
                  <Button
                    variant="contained"
                    sx={{ mt: 3, borderRadius: "8px", textTransform: "none" }}
                    onClick={() => getFlight()} // retry
                  >
                    Retry
                  </Button>
                </div>
              ) : paginatedItems.length > 0 ? (
                paginatedItems.map((depart) => (
                  <DepartCard
                    key={depart.id}
                    depart={depart}
                    onClick={handleOpen}
                    segment={currentSegment}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center mt-20">
                  <SearchOutlinedIcon
                    sx={{ width: "60px", height: "60px", color: "#67696D" }}
                  />
                  <p className="text-black font-semibold text-[20px] mt-4">
                    No Flight Match your Search
                  </p>
                  <p className="text-[#67696D] w-[80%] m-auto font-normal text-[16px] mt-4 text-center">
                    Looks like there are no flights for your selected route and
                    dates. Try selecting different travel dates.
                  </p>
                </div>
              )}

              <Stack spacing={2} className="mt-50">
                <Pagination
                  count={Math.ceil(filteredDepartures.length / ITEMS_PER_PAGE)}
                  shape="rounded"
                  page={page}
                  variant="text"
                  hideNextButton={false}
                  hidePrevButton={false}
                  renderItem={(item) => (
                    <PaginationItem
                      {...item}
                      slots={{
                        previous: () => (
                          <div className="flex items-center gap-3">
                            <Icon
                              icon="material-symbols-light:arrow-back-ios-new"
                              width="24"
                              height="24"
                            />
                            <span className=" ">Prev</span>
                          </div>
                        ),
                        next: () => (
                          <div className="flex items-center gap-3">
                            <span className=" ">Next</span>
                            <Icon
                              icon="material-symbols-light:arrow-forward-ios"
                              width="24"
                              height="24"
                            />
                          </div>
                        ),
                      }}
                      sx={{
                        borderRadius: "6px",
                        fontWeight: 500,
                        "&.Mui-selected": {
                          backgroundColor: "#023E8A",
                          color: "white",
                        },
                        ...(item.type === "previous" || item.type === "next"
                          ? {
                              color: "black",

                              // horizontal padding
                              "&:hover": {
                                backgroundColor: "#CCD8E801",
                              },
                              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                              borderRadius: "6px",
                            }
                          : {}),
                      }}
                    />
                  )}
                  onChange={handleChange}
                  sx={{ display: "flex", justifyContent: "center" }}
                />
              </Stack>
              {selectedDeparture && (
                <FlightDrawer
                  counts={counts}
                  handleCloseClick={handleCloseClick}
                  handleDecrement={handleDecrement}
                  handleIncrement={handleIncrement}
                  openClick={openClick}
                  multiCitySelections={multiCitySelections}
                  setMultiCitySelections={setMultiCitySelections}
                  options={[]}
                  selectedOption={selectedOption}
                  onNext={goNextSegment}
                  setSelectedOption={setSelectedOption}
                  selectedDeparture={selectedDeparture}
                  returnFlight={isMultiCity ? currentSegment : 0}
                  title="Departure"
                />
              )}
            </div>
          </div>
        </div>

        <div className="">
          <TravelmateApp />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DeparturePage;
