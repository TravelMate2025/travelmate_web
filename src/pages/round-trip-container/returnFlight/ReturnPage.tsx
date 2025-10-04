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
  Card,
  CardContent,
  FormControl,
  Grid,
  PaginationItem,
  RadioGroup,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
// import LocationOnOutlinedIcon from "@mui/icons-material/LocationOn";

import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { addDays, format } from "date-fns";
import FlightClassOutlinedIcon from "@mui/icons-material/FlightClassOutlined";

import Typography from "@mui/material/Typography";

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { Divider, IconButton } from "@mui/material";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { Link, useParams } from "react-router-dom";
import TravelmateApp from "../../homePage/TravelmateApp";
import Footer from "../../../components/2Footer";
import airlogo from "../../../assets/airlogo.svg";

import Line from "../../../assets/arrow.svg";
import { Stack, Pagination, Dialog, DialogContent } from "@mui/material";
import { useLocation } from "react-router-dom";

import SortIcon from "@mui/icons-material/Sort";

import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import Breadcrumb from "../../BreadCrumb";

import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CheckIcon from "@mui/icons-material/Check";
import axios from "axios";
import { Icon } from "@iconify/react";
interface DateRangeType {
  startDate: Date;
  endDate: Date;
  key: string;
}

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

import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";

import { MdArrowDropDown } from "react-icons/md";

import SortFlight from "../../../features/flights/components/SortFlight";
import FilterFlight, {
  FlightFilters,
} from "../../../features/flights/components/FilterFlight";
import DepartCard from "../../../features/flights/components/DepartCard";
import { LocationSelector } from "../../../features/flights/components/LocationSelector";
import { DateSelector } from "../../../features/flights/components/DateSelector";
import { PassengerSelector } from "../../../features/flights/components/PassengerSelector";
import { ClassSelector } from "../../../features/flights/components/ClassSelector";
import {
  DateSelection,
  useFlightBooking,
} from "../../../features/flights/hooks/useFlightBooking";
import {
  FlightDrawer,
  Counts,
} from "../../../features/flights/components/FlightDrawer";

import dayjs from "dayjs";
import { FlightOffer, FlightSearchResponse } from "../../../features/flights/types";
import { buildFlightPayload, TripType, useLazyFetchFlightsQuery } from "../../../features/flights/api/flightApi";
import { useLazyGetLocationInfoQuery } from "../../../features/flights/api/locationApi";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {  getFormattedDate, MultiTripFormValues, multiTripSchema, SimpleTripFormValues, simpleTripSchema } from "../../homePage/Flight";


const DeparturePage: React.FC<DepartureListProps> = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
const [fetchCoords, { isFetching, data }] = useLazyGetLocationInfoQuery();
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

  const multiForm = useForm<MultiTripFormValues>({
    resolver: yupResolver(multiTripSchema),
    defaultValues: {
      tripType: "multi-city",
      flights: [],
      class: "",
      passengers: { adults: 1, children: 0, infants: 0 },
    },
  });

  
       const [country, setCountry] = useState<string>("Detecting...");
    
        useEffect(() => {
          if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
              async (position) => {
                const { latitude, longitude } = position.coords;
    
                try {
              
               
                
               fetchCoords({latitude, longitude})
                } catch (error) {
                  console.error("Geolocation lookup failed:", error);
                  setCountry("Error detecting country");
                }
              },
              (error) => {
                console.error("Geolocation error:", error);
                setCountry("Permission denied or unavailable");
              }
            );
          } else {
            setCountry("Geolocation not supported");
          }
        }, []);
  const {
    from: initialFrom,
    to: initialTo,
    formattedDate,
    date,
   flights:storedFlights,
    passengers,
    selectedDate: initDate,
    passengerCounts,
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

    setSelectedFrom,
    setSelectedTo,

    setSelectedClass,
    setPassengerCounts,

    updateFlight,
    addFlight,
    removeFlight,
    handleSearch,
  } = useFlightBooking();

  const [selectedDate, setSelectedDate] = useState<DateSelection>(new Date());
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [fetchFlights, { data: flightResults, error, isLoading, isFetching:fetchingFlight }] =
    useLazyFetchFlightsQuery();
  const [_locations, setLocations] = useState([
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
                currency: data?.currency,
                flights,
              });

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
          currency: data?.currency,
          flights,
        });
  
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

useEffect(() => {
  if (data?.currency) {
    getFlight();
  }
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
const { id } = useParams<{ id: string }>();
const flightIndex = 1;

// Get all flights from sessionStorage
const tripData = JSON.parse(sessionStorage.getItem("trip") || "{}");
const [currentSegment, setCurrentSegment] = useState(1); // start at first flight
const [visitedSegments, setVisitedSegments] = useState([0]);
const currentFlight = storedFlights[currentSegment];
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

const goPrevSegment = () => {
  if (currentSegment > 0) {
    setCurrentSegment(currentSegment - 1);
  }
};

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
 
      
  
      simpleForm.reset({class:initialFlight, date:date, from:initialFrom, to:initialTo, passengers, tripType: tripType as any})
    } else {
      console.log(currentFlight, location );
      simpleForm.reset({class:location.state.flightClass, tripType:tripType as any, passengers:location.state.passengers,date:currentFlight.date, from:currentFlight.from, to:currentFlight.to})
      
    }


 
  }, [location]);


  const [filters, setFilters] = useState<FlightFilters>({
    priceRange: [2000, 10_000_000],
    stops: null,
    refundPolicy: null,
    airlines: [],
  });
  const [multiCitySelections, setMultiCitySelections] = useState<
    { flight: FlightOffer; counts: Counts; option: string, upsell:FlightSearchResponse }[]
  >([]);
  const handleFilterChange = (newFilters: FlightFilters) => {
    setFilters(newFilters);
  
  };

  // const [tempValue, setTempValue] = useState<number[]>([2000, 10000000]);

  const [selectedSort, setSelectedSort] = useState<string | undefined>(
    "recommended"
  );
  const handleRemoveLocation = useCallback((location: string) => {
 
  }, []);
  const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const sortedDepartures = useMemo(() => {
    const sortedArray = [...departures];

    const durationToMinutes = (duration: string) => {
      const hoursMatch = duration?.match(/(\d+)hrs?/);
      const minutesMatch = duration?.match(/(\d+)m/);
      const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
      const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;
      return hours * 60 + minutes;
    };

    switch (selectedSort) {
      case "price_low":
        sortedArray.sort(
          (a: any, b: any) => parseInt(a.price.total) - parseInt(b.price.total)
        );
        break;
      case "price_high":
        sortedArray.sort(
          (a: any, b: any) => parseInt(b.price.total) - parseInt(a.price.total)
        );
        break;
      case "shortest_duration":
        sortedArray.sort(
          (a: any, b: any) =>
            durationToMinutes(a.itineraries[0]?.duration) -
            durationToMinutes(b.itineraries[0]?.duration)
        );
        break;
      case "longest_duration":
        sortedArray.sort(
          (a: any, b: any) =>
            durationToMinutes(b.itineraries[0]?.duration) -
            durationToMinutes(a.itineraries[0]?.duration)
        );
        break;
      default:
        break;
    }

    return sortedArray;
  }, [selectedSort, departures]);

  const paginatedItems = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return sortedDepartures.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [page, sortedDepartures]);

  const [openFrom, setOpenFromMulti] = useState<Record<string, boolean>>({});
  const [openTo, setOpenToMulti] = useState<Record<string, boolean>>({});

  const toggleOpenFrom = (id: string, value: boolean) => {
    setOpenFromMulti((prev) => ({ ...prev, [id]: value }));
  };

  const toggleOpenTo = (id: string, value: boolean) => {
    setOpenToMulti((prev) => ({ ...prev, [id]: value }));
  };



 

  const getNewFlight = useCallback(
    (formData?: FlightFormValues) => {
      try {
        const payload = buildFlightPayload({
          tripType:
            formData?.tripType || tripType || ("round-trip" as TripType),

          // ✅ Prefer formData, then state, then initial
          selectedFrom: formData?.from || selectedFrom || initialFrom,
          selectedTo: formData?.to || selectedTo || initialTo,

          date: formData?.date || date,
          passengerCounts: formData?.passengers || passengers,
          travelClass: formData?.class || selectedClass,
          currency: data?.currency,
          flights,
        });

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
  
console.log(simpleForm.formState.errors);

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
            Return Flight
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
                          defaultValue={field.value}
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
                          defaultValue={field.value}
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
                          counts={field.value}
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
                  {from} to {to}
                </p>
                <p className="text-[14px] font-normal text-[#67696D]">
                  {/* {formatDate(selectedDate as Date)} , {passengerText} */}
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
                    .map((idx) => (
                      <React.Fragment key={flights[idx].id}>
                        <span className="text-[#67696D]"> &gt; </span>
                        <span
                          className={`font-medium cursor-pointer ${
                            currentSegment === idx
                              ? "text-[#023E8A]"
                              : "text-[#67696D]"
                          }`}
                          onClick={() => setCurrentSegment(idx)}
                        >
                          Return Flight {currentSegment + 1} 
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
                    ? `Return Flight from
                          ${currentFlight.from.cityName} (${currentFlight.from.iataCode}) to
                          ${currentFlight.to.cityName} (${currentFlight.to.iataCode})`
                    : " Return Flight"}
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
              {isLoading || isFetching ? (
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
                    {error?.data?.message ||
                      "Something went wrong while fetching flight offers. Please try again later."}
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
                  count={Math.ceil(departures.length / ITEMS_PER_PAGE)}
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
              
                  options={[]}
                  selectedOption={selectedOption}
                  onNext={goNextSegment}
                  setSelectedOption={setSelectedOption}
                  selectedDeparture={selectedDeparture}
                  returnFlight={isMultiCity ? currentSegment : 1}
                  title="Return"
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
