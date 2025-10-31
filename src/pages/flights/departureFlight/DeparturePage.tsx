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
  TextField,
  Box,
  InputAdornment,
  Divider,
  Stack,
  Pagination,
} from "@mui/material";
import { Link, } from "react-router-dom";
import { format } from "date-fns";
import { Icon } from "@iconify/react";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import SortIcon from "@mui/icons-material/Sort";
import Navbar from "../../homePage/Navbar";
import TravelmateApp from "../../homePage/TravelmateApp";
import Footer from "../../../components/2Footer";
import Breadcrumb from "../../BreadCrumb";
import SortFlight from "../../../features/flights/components/SortFlight";
import DepartCard from "../../../features/flights/components/DepartCard";
import { LocationSelector } from "../../../features/flights/components/LocationSelector";
import { DateSelector } from "../../../features/flights/components/DateSelector";
import { PassengerSelector } from "../../../features/flights/components/PassengerSelector";
import { ClassSelector } from "../../../features/flights/components/ClassSelector";
import {
  FlightDrawer,
  MultiCitySelection,
} from "../../../features/flights/components/FlightDrawer";
import FilterFlight, {
  FlightFilters,
} from "../../../features/flights/components/FilterFlight";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SimpleTripFormValues, simpleTripSchema } from "../../homePage/Flight";
import {

  useLazyFetchFlightsQuery,
} from "../../../features/flights/api/flightApi";
import { useLazyGetLocationInfoQuery } from "../../../features/flights/api/locationApi";
import { buildFlightPayload } from "../../../features/flights/api/flightApi";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { SearchData } from "../../../features/flights/hooks/useFlightBooking";
import { Airport } from "../../../features/flights/types";


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
  departureInfo?: Departure[];
}

const ITEMS_PER_PAGE = 4;

const DeparturePage: React.FC<DepartureListProps> = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [fetchCoords, { data: locationData   }] = useLazyGetLocationInfoQuery();
  const [fetchFlights, { data: flightResults, error, isLoading, isFetching }] =
    useLazyFetchFlightsQuery();

const [loading, setLoading] =  useState(false)
  // Form setup
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  
  } = useForm<SimpleTripFormValues>({
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

  // Parse search data from sessionStorage
  const searchData = useMemo(
    () => JSON.parse(sessionStorage.getItem("trip") || "{}") as SearchData,
    []
  );
  const {
    tripType,
    from: selectedFrom,
    to: selectedTo,
    flightClass: selectedClass,
    flights,
    date,
    passengers: selectedPassengers,
  } = searchData;

  // State management
  const [page, setPage] = useState(1);
  const [openClick, setOpenClick] = useState(false);
  const [selectedDepartureId, setSelectedDepartureId] = useState<string | null>(
    null
  );
  const [isOpenFrom, setIsOpenFrom] = useState(false);
  const [isOpenTo, setIsOpenTo] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState<string>("recommended");
  const [filters, setFilters] = useState<FlightFilters>({
    priceRange: [2000, 10_000_000],
    stops: null,
    refundPolicy: null,
    airlines: [],
  });
  const [multiCitySelections, setMultiCitySelections] = useState<
    MultiCitySelection[]
  >([]);
  const [currentSegment, setCurrentSegment] = useState(0);
  const [visitedSegments, setVisitedSegments] = useState([0]);
  const fromAnchors = useRef<Record<string, HTMLDivElement | null>>({});
  const toAnchors = useRef<Record<string, HTMLDivElement | null>>({});
  const [counts, setCounts] = useState({
    adults: 0,
    children: 0,
    infants: 0,
    extraBags: 0,
  });

  // Geolocation effect
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) =>
          fetchCoords({ latitude, longitude }).catch((err) =>
            console.error("Geolocation lookup failed:", err)
          ),
        (err) => console.error("Geolocation error:", err)
      );
    }
  }, [fetchCoords]);


  // Reset form when searchData changes
  useEffect(() => {
    if (!date) return;

    
  reset({
    class: selectedClass,
    date,
    from: selectedFrom,
    to: tripType === "multi-city" ? selectedFrom : selectedTo,
    passengers: selectedPassengers,
    tripType: tripType as "round-trip" | "one-way" | "multi-city",
  });

  }, [
    searchData,
    reset,
    date,
    selectedClass,
    selectedFrom,
    selectedTo,
    selectedPassengers,
    tripType,
  ]);


  
  // Fetch flights on mount
  useEffect(() => {
    if (locationData?.currency) {
      getFlight({
        class: selectedClass,
        date: date as any,
        from: selectedFrom as any,
        passengers: selectedPassengers,
        to: selectedTo as any,
        tripType: tripType as "round-trip" | "one-way" | "multi-city",
      });
    }
  }, [
    locationData?.currency,
    selectedClass,
    date,
    selectedFrom,
    selectedTo,
    selectedPassengers,
  ]);

  // Reset page when filters or sort change
  useEffect(() => {
    setPage(1);
  }, [filters, selectedSort]);

  // Handlers
  const handleIncrement = useCallback((type: keyof typeof counts) => {
    setCounts((prev) => ({ ...prev, [type]: prev[type] + 1 }));
  }, []);

  const handleDecrement = useCallback((type: keyof typeof counts) => {
    setCounts((prev) => ({
      ...prev,
      [type]: prev[type] > 0 ? prev[type] - 1 : 0,
    }));
  }, []);

  const handleOpen = useCallback((depart: any) => {
    setSelectedDepartureId(depart.id);
    setOpenClick(true);
  }, []);

  const handleCloseClick = useCallback(() => {
    setOpenClick(false);
    setSelectedDepartureId(null);
  }, []);

  const goNextSegment = useCallback(() => {
    if (Array.isArray(flights) && currentSegment < flights.length - 1) {
      const next = currentSegment + 1;
      setCurrentSegment(next);
      setVisitedSegments((prev) =>
        prev.includes(next) ? prev : [...prev, next]
      );
    }
  }, [currentSegment, flights]);

  // Flight fetching logic
  const getFlight = useCallback(
    (formData?: SimpleTripFormValues) => {

      try {
setLoading(true)
        const t  =     tripType as "round-trip" | "one-way" | "multi-city"
        const payload = buildFlightPayload({
          tripType: formData?.tripType || t || "round-trip",
          initialFrom: { id: selectedFrom?.iataCode || "" },
          initialTo: { id: selectedTo?.iataCode || "" },
          selectedFrom: formData?.from || selectedFrom as any,
          selectedTo: formData?.to || selectedTo as any,
          date: formData?.date || date,
          passengerCounts: formData?.passengers || selectedPassengers as any,
          travelClass: formData?.class || selectedClass,
          currency: locationData?.currency || "NGN",
          // @ts-ignore
          flights,
        });
        // @ts-ignore
        fetchFlights(payload);
      } catch (err) {
        setLoading(false);
        console.error("Failed to fetch flights:", err);
      } finally {
        setLoading(false)
      }
    },
    [
      tripType,
      selectedFrom,
      selectedTo,
      date,
      selectedPassengers,
      selectedClass,
      locationData?.currency,
      flights,
      fetchFlights,
    ]
  );

console.log(tripType);

  useEffect(() => {
    
    if (tripType === "multi-city") {
      const currentFlight = flights?.[currentSegment];
      
reset({
  class: selectedClass,
  date: currentFlight?.date as any,
  from: currentFlight?.from as Airport,
  to: (tripType === "multi-city" ? currentFlight?.to : selectedTo) as Airport,
  passengers: selectedPassengers,
  tripType: tripType as "round-trip" | "one-way" | "multi-city",
});



    }
  },[tripType])
  const onSearch = handleSubmit((formData) => {
    sessionStorage.setItem(
      "trip",
      JSON.stringify({
        ...searchData,
        date: formData.date,
        flightClass: formData.class,
        from: formData.from,
        to: formData.to,
        passengers: formData.passengers,
        tripType: formData.tripType,
      })
    );
    getFlight(formData);
  });



  // Flight filtering
  const filteredDepartures = useMemo(() => {
    return (flightResults?.data || []).filter((flight: any) => {
      const price = parseFloat(flight.price?.total || "0");
      if (price < filters.priceRange[0] || price > filters.priceRange[1])
        return false;

      if (filters.stops !== null) {
        const stops = flight.itineraries[0]?.segments?.length - 1 || 0;
        if (filters.stops === "Non Stop" && stops > 0) return false;
        if (filters.stops === "1 Stop" && stops !== 1) return false;
        if (filters.stops === "1+ Stop" && stops < 2) return false;
      }

      if (filters.refundPolicy === "refundable" && !flight.refundable)
        return false;
      if (filters.refundPolicy === "non-refundable" && flight.refundable)
        return false;

      if (
        filters.airlines.length > 0 &&
        !filters.airlines.includes(flight.validatingAirlineCodes?.[0] || "")
      )
        return false;

      return true;
    });
  }, [flightResults?.data, filters]);

  // Flight sorting
  const sortedDepartures = useMemo(() => {
    const sortedArray = [...filteredDepartures];
    const parsePrice = (p: any) =>
      parseFloat(String(p).replace(/[,₦\$]/g, "") || "0");
    const durationToMinutes = (raw: string | undefined) => {
      if (!raw) return 0;
      const isoMatch = String(raw).match(/PT(?:(\d+)H)?(?:(\d+)M)?/i);
      if (isoMatch)
        return (
          parseInt(isoMatch[1] || "0", 10) * 60 +
          parseInt(isoMatch[2] || "0", 10)
        );
      const hoursMatch = String(raw).match(/(\d+)\s*h(?:rs?)?/i);
      const minsMatch = String(raw).match(/(\d+)\s*m/i);
      return (
        (hoursMatch ? parseInt(hoursMatch[1], 10) * 60 : 0) +
        (minsMatch ? parseInt(minsMatch[1], 10) : 0)
      );
    };

    switch (selectedSort) {
      case "price_low":
        sortedArray.sort(
          (a, b) => parsePrice(a.price?.total) - parsePrice(b.price?.total)
        );
        break;
      case "price_high":
        sortedArray.sort(
          (a, b) => parsePrice(b.price?.total) - parsePrice(a.price?.total)
        );
        break;
      case "shortest_duration":
        sortedArray.sort(
          (a, b) =>
            durationToMinutes(a.itineraries?.[0]?.duration) -
            durationToMinutes(b.itineraries?.[0]?.duration)
        );
        break;
      case "longest_duration":
        sortedArray.sort(
          (a, b) =>
            durationToMinutes(b.itineraries?.[0]?.duration) -
            durationToMinutes(a.itineraries?.[0]?.duration)
        );
        break;
      default:
        break;
    }
    return sortedArray;
  }, [filteredDepartures, selectedSort]);

  const paginatedItems = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return sortedDepartures.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [page, sortedDepartures]);

  const selectedDeparture = useMemo(
    () => flightResults?.data?.find((d: any) => d.id === selectedDepartureId),
    [flightResults?.data, selectedDepartureId]
  );
  const isMultiCity = tripType === "multi-city";
  const currentFlight = flights?.[currentSegment];

  return (
    <div>
      <Navbar />
      <div className="w-full h-full md:bg-[#CCD8E833] mt-[73px]">
        {/* Mobile header */}
        <div className="mb-6 md:hidden">
          <Link to="/">
            <div className="absolute left-[28px] top-[85px] w-[40px] h-[40px] p-[8px] bg-white border-[0.5px] border-[#EBECED] shadow-md rounded-[4px]">
              <ArrowBackIosNewOutlinedIcon />
            </div>
          </Link>
          <p className="text-center font-semibold text-[20px] mt-[90px]">
            Departure Flight
          </p>
        </div>

        {/* Desktop form */}
        <div className="hidden md:block w-[90%] m-auto py-10">
          <form onSubmit={onSearch}>
            <FormControl sx={{ width: "100%" }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={2}>
                  <Controller
                    name="from"
                    control={control}
                    render={({ field }) => (
                      <LocationSelector
                        id="from"
                        label="From"
                        onSelect={field.onChange}
                        isOpen={isOpenFrom}
                        defaultValue={field.value as any}
                        anchorEl={fromAnchors.current["single"]}
                        setAnchorEl={(el) =>
                          (fromAnchors.current["single"] = el)
                        }
                        setIsOpen={setIsOpenFrom}
                        onRemoveLocation={() => field.onChange("")}
                      />
                    )}
                  />
                  {errors.from && (
                    <p className="text-red-500 text-sm">
                      {errors.from.message}
                    </p>
                  )}
                </Grid>
                <Grid item xs={12} md={2}>
                  <Controller
                    name="to"
                    control={control}
                    render={({ field }) => (
                      <LocationSelector
                        id="to"
                        label="To"
                        onSelect={field.onChange}
                        isOpen={isOpenTo}
                        defaultValue={field.value as any}
                        anchorEl={toAnchors.current["single"]}
                        setAnchorEl={(el) => (toAnchors.current["single"] = el)}
                        setIsOpen={setIsOpenTo}
                        onRemoveLocation={() => field.onChange("")}
                      />
                    )}
                  />
                  {errors.to && (
                    <p className="text-red-500 text-sm">{errors.to.message}</p>
                  )}
                </Grid>
                <Grid item xs={12} md={2}>
                  <Controller
                    name="date"
                    control={control}
                    render={({ field }) => {
              
        
              
                      
                   return (
                     <>
                       <DateSelector
                         id="departure-date"
                         label="Date"
                         value={ 
                           typeof field.value === "string"
                             ? format(new Date(field.value), "dd MMM yyyy")
                             : //  @ts-ignore
                             field.value?.startDate && field.value?.endDate
                             ? `${format(
                                 //  @ts-ignore
                                 new Date(field.value.startDate),
                                 "dd MMM yyyy"
                               )} - ${format(
                                 //  @ts-ignore
                                 new Date(field.value.endDate),
                                 "dd MMM yyyy"
                               )}`
                             : ""
                         }
                         //  defaultDate={date}
                         onDateChange={(val) => {
                           console.log(val);
                           
                           
                           field.onChange(
                             val instanceof Date
                               ? val.toISOString()
                               : val?.startDate && val?.endDate
                               ? val
                               : null
                           )
                         }
                         }
                         range={tripType === "round-trip"}
                       />
                     </>
                   );
                    }}
                  />
                  {errors.date && (
                    <p className="text-red-500 text-sm">
                      {errors.date.message}
                    </p>
                  )}
                </Grid>
                <Grid item xs={12} md={2}>
                  <Controller
                    name="passengers"
                    control={control}
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
                  {errors.passengers && (
                    <p className="text-red-500 text-sm">
                      {errors.passengers.message}
                    </p>
                  )}
                </Grid>
                <Grid item xs={12} md={2}>
                  <Controller
                    name="class"
                    control={control}
                    render={({ field }) => (
                      <ClassSelector
                        id="class"
                        label="Class"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {errors.class && (
                    <p className="text-red-500 text-sm">
                      {errors.class.message}
                    </p>
                  )}
                </Grid>
                <Grid item xs={12} md={2} display="flex" alignItems="flex-end">
                  <button
                    type="submit"
                    className="bg-[#023E8A] h-[52px] w-full md:max-w-[140px] text-white font-inter text-base rounded-[8px] hover:bg-[#012a5c] transition-colors"
                  >
                    Search
                  </button>
                </Grid>
              </Grid>
            </FormControl>
          </form>
        </div>

        {/* Mobile search summary */}
        <div className="md:mb-[20px] mt-[25px] w-[90%] m-auto md:hidden">
          <div className="border-[1px] border-[#023E8A] bg-[#CCD8E81A] p-[10px] rounded-[8px]">
            <div className="flex gap-2 justify-between">
              <div className="text-[#181818]">
                <p className="text-[16px] font-medium">{`${control._formValues.from?.cityName} to ${control._formValues.to?.cityName}`}</p>
                <p className="text-[14px] font-normal text-[#67696D]">
                  {control._formValues.date instanceof Date
                    ? control._formValues.date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    : control._formValues.date?.startDate instanceof Date
                    ? control._formValues.date.startDate.toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric" }
                      )
                    : ""}
                  ,{" "}
                  {(control._formValues.passengers.adults || 0) +
                    (control._formValues.passengers.children || 0) +
                    (control._formValues.passengers.infants || 0)}{" "}
                  passengers
                </p>
              </div>
              <Link to="/">
                <ModeEditOutlinedIcon className="mt-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="bg-white w-full h-full md:pt-[20px] pb-[50px] mb-[100px]">
          <div className="w-[90%] m-auto hidden md:block">
            <div className="flex gap-1 text-[15px] mb-4">
              <span>Home</span>
              {isMultiCity ? (
                [...new Set([...visitedSegments, currentSegment])]
                  .sort((a, b) => a - b)
                  .map((idx) => (
                    <React.Fragment key={`segment-${idx}`}>
                      <span className="text-[#67696D]">&gt;</span>
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
                  ))
              ) : (
                <Breadcrumb />
              )}
            </div>
            <Divider />
          </div>

          <div className="mt-[26px] md:mb-[26px]">
            <div className="w-[90%] m-auto flex justify-between">
              <p className="text-[24px] font-inter font-semibold max-md:hidden">
                {isMultiCity && currentFlight?.from && currentFlight?.to
                  ? `Departure Flight from ${currentFlight.from.cityName} (${currentFlight.from.iataCode}) to ${currentFlight.to.cityName} (${currentFlight.to.iataCode})`
                  : "Departure Flight"}
              </p>
              <Box sx={{ display: "flex", gap: "15px" }}>
                <TextField
                  id="filter-input"
                  variant="outlined"
                  size="small"
                  placeholder="Filter"
                  onClick={() => setIsDialogOpen(true)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
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
                      opacity: 1,
                    },
                    "& .MuiInputBase-input": { color: "black" },
                  }}
                />
                <FilterFlight
                  isMobile={isMobile}
                  filters={filters}
                  open={isDialogOpen}
                  onClose={() => setIsDialogOpen(false)}
                  onChange={setFilters}
                  onApply={() => {
                    
                    setFilters({ ...filters })
                    setIsDialogOpen(false);
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
                  setValue={setSelectedSort}
                  open={isSortOpen}
                  onClose={() => setIsSortOpen(false)}
                  isMobile={isMobile}
                  value={selectedSort}
                  handleApplyFilters={() => {
                    setIsSortOpen(false);
                  }}
                />
              </Box>
            </div>
            <Divider />
          </div>

          <div className="mt-[24px] w-[90%] m-auto cursor-pointer">
            {loading || isFetching ? (
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
                  onClick={() => getFlight()}
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
                          <span>Prev</span>
                        </div>
                      ),
                      next: () => (
                        <div className="flex items-center gap-3">
                          <span>Next</span>
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
                            "&:hover": { backgroundColor: "#CCD8E801" },
                            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                            borderRadius: "6px",
                          }
                        : {}),
                    }}
                  />
                )}
                onChange={(_event, value) => setPage(value)}
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
                searchState={searchData}
                selectedOption="basic"
                onNext={goNextSegment}
                setSelectedOption={() => {}} // Placeholder, adjust as needed
                selectedDeparture={selectedDeparture}
                returnFlight={isMultiCity ? currentSegment : 0}
                title="Departure"
              />
            )}
          </div>
        </div>

        <TravelmateApp />
      </div>
      <Footer />
    </div>
  );
};

export default React.memo(DeparturePage);

