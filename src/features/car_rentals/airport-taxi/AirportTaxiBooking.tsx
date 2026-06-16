import { useCallback, useEffect, useMemo, useState } from "react";
import { Calendar, Clock, MapPin, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TextField, InputAdornment } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { searchDetailedLocation } from "../services/locationService";
import { transferService } from "../services/transferService";
import Passengers from "../carsFirstScreen/modals/Passengers";
import { formatPassengerCount } from "../utilities/formatting";
import type { PassengerCounts, CarTransferOption } from "../types/booking";
import { setCarInfo, setSearchResults } from "../carPaymentSlice";

type PickupSuggestion = {
  displayName: string;
  iataCode?: string;
  geoCode?: { latitude: number; longitude: number };
};

type DropoffSuggestion = {
  name: string;
  latitude: number;
  longitude: number;
};

export default function AirportTaxiBooking() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [pickupQuery, setPickupQuery] = useState("");
  const [dropoffQuery, setDropoffQuery] = useState("");
  const [pickupDate, setPickupDate] = useState<string>("");
  const [pickupTime, setPickupTime] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [pickupSuggestions, setPickupSuggestions] = useState<PickupSuggestion[]>([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState<DropoffSuggestion[]>([]);
  const [showPassengers, setShowPassengers] = useState(false);
  const [passengerCounts, setPassengerCounts] = useState<PassengerCounts>({
    adults: 1,
    children: 0,
    infant: 0,
  });
  const [loading, setLoading] = useState(false);
  const [selectedPickup, setSelectedPickup] = useState<PickupSuggestion | null>(null);
  const [selectedDropoff, setSelectedDropoff] = useState<DropoffSuggestion | null>(null);

  const loadPickupSuggestions = useCallback(async (query: string) => {
    const normalized = query.trim();
    if (normalized.length < 2) {
      setPickupSuggestions([]);
      return;
    }
    const response = await transferService.lookupTerminal(normalized);
    setPickupSuggestions(
      (response.data ?? []).map((item) => ({
        displayName: item.displayName,
        iataCode: item.iataCode,
        geoCode: item.geoCode,
      }))
    );
  }, []);

  const loadDropoffSuggestions = useCallback(async (query: string) => {
    const normalized = query.trim();
    if (normalized.length < 2) {
      setDropoffSuggestions([]);
      return;
    }
    const response = await searchDetailedLocation(() => {}, normalized, "ng");
    setDropoffSuggestions(
      response.map((item) => ({
        name: item.name,
        latitude: item.latitude,
        longitude: item.longitude,
      }))
    );
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadPickupSuggestions(pickupQuery);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [pickupQuery, loadPickupSuggestions]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadDropoffSuggestions(dropoffQuery);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [dropoffQuery, loadDropoffSuggestions]);

  const passengerLabel = useMemo(
    () => formatPassengerCount(passengerCounts),
    [passengerCounts]
  );

  const [priceMin, priceMax] = useMemo(() => {
    const digits = priceRange.match(/\d+/g)?.map(Number) ?? [];
    return [digits[0] ?? 0, digits[1] ?? digits[0] ?? 0];
  }, [priceRange]);

  const canSearch = useMemo(
    () =>
      Boolean(
        pickupQuery.trim() &&
          dropoffQuery.trim() &&
          pickupDate &&
          pickupTime &&
          passengerCounts.adults + passengerCounts.children + passengerCounts.infant > 0
      ),
    [pickupQuery, dropoffQuery, pickupDate, pickupTime, passengerCounts]
  );

  const handleSearch = async () => {
    if (!canSearch || loading) return;

    const resolvedPickup = selectedPickup ?? pickupSuggestions[0] ?? null;
    const resolvedDropoff = selectedDropoff ?? dropoffSuggestions[0] ?? null;
    const pickupCode =
      resolvedPickup?.iataCode ?? resolvedPickup?.displayName?.slice(0, 3).toUpperCase() ?? "";
    const dropoffCoords = resolvedDropoff
      ? `${resolvedDropoff.latitude},${resolvedDropoff.longitude}`
      : "0,0";

    try {
      setLoading(true);
      const result = await transferService.searchTransfers({
        adults: String(passengerCounts.adults),
        children: String(passengerCounts.children),
        infants: String(passengerCounts.infant),
        departing: `${pickupDate}T${pickupTime}:00`,
        fcode: pickupCode,
        ftype: "IATA",
        tcode: dropoffCoords,
        ttype: "GPS",
        transfer_type: "PRIVATE,SHARED",
        min_price: priceMin,
        max_price: priceMax,
      });

      if (!result.success || !result.data?.results?.services) {
        throw new Error(result.error || "No transfer results found");
      }

      dispatch(
        setCarInfo({
          pickupLocation: pickupCode,
          pickupLocaDescription: pickupQuery,
          dropoffLocation: dropoffCoords,
          dropoffLocaDescription: dropoffQuery,
          pickupDate,
          pickupTime,
          selectedRide: "Transfer",
          priceRange: { min: priceMin, max: priceMax },
          passengerCounts,
          toLat: resolvedDropoff?.latitude,
          toLon: resolvedDropoff?.longitude,
          searchResults: result.data.results.services as CarTransferOption[],
        })
      );
      dispatch(setSearchResults(result.data.results.services as CarTransferOption[]));
      navigate(
        `/cars-searchResults?ride=Transfer&from=${encodeURIComponent(
          pickupQuery
        )}&to=${encodeURIComponent(dropoffQuery)}&time=${pickupDate}&pricerange=${encodeURIComponent(
          priceRange
        )}`,
        { state: { search_id: result.data.search_id } }
      );
    } catch (error) {
      console.error("Search failed:", error);
      alert(error instanceof Error ? error.message : "Search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[90%] mx-auto mt-[130px] md:mt-[150px] bg-white rounded-lg border border-[#CDCED1] shadow">
      <div className="mb-6 p-4 flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-900">Transfers</h1>
        <p className="text-gray-600">
          Search airport and city pickup points, including Lekki-style locations.
        </p>
      </div>
      <div className="border-t border-gray-200 h-2 w-full" />
      <div className="flex flex-col md:flex-row justify-between md:items-center pt-6 p-4 gap-6">
        <div className="md:w-[89%] grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Pick Up</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search airport or area"
                className="pl-10 w-full border border-[#CDCED1] rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                value={pickupQuery}
                onChange={(event) => {
                  setPickupQuery(event.target.value);
                  setSelectedPickup(null);
                }}
              />
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-black" />
            </div>
            {pickupSuggestions.length > 0 && (
              <div className="mt-2 max-h-52 overflow-auto rounded-md border border-gray-200 bg-white shadow">
                {pickupSuggestions.map((item) => (
                  <button
                    key={item.displayName}
                    type="button"
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                    onClick={() => {
                      setPickupQuery(item.displayName);
                      setSelectedPickup(item);
                    }}
                  >
                    {item.displayName}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Drop Off</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search destination"
                className="pl-10 w-full border border-[#CDCED1] rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                value={dropoffQuery}
                onChange={(event) => {
                  setDropoffQuery(event.target.value);
                  setSelectedDropoff(null);
                }}
              />
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-black" />
            </div>
            {dropoffSuggestions.length > 0 && (
              <div className="mt-2 max-h-52 overflow-auto rounded-md border border-gray-200 bg-white shadow">
                {dropoffSuggestions.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                    onClick={() => {
                      setDropoffQuery(item.name);
                      setSelectedDropoff(item);
                    }}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="pickup-date">Pick Up Date</label>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                disablePast
                value={pickupDate ? dayjs(pickupDate) : null}
                onChange={(newValue) => {
                  if (newValue) {
                    setPickupDate(newValue.format("YYYY-MM-DD"));
                  }
                }}
                slotProps={{
                  textField: {
                    size: "small",
                    variant: "outlined",
                    InputProps: {
                      readOnly: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <Calendar className="h-4 w-4 text-black" />
                        </InputAdornment>
                      ),
                    },
                    sx: {
                      "& .MuiInputBase-root": {
                        height: "44px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        width: "100%",
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pick Up Time</label>
            <TextField
              type="time"
              variant="outlined"
              size="small"
              value={pickupTime}
              onChange={(event) => setPickupTime(event.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Clock className="h-4 w-4 text-black" />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: "100%",
                "& .MuiInputBase-root": {
                  height: "44px",
                  borderRadius: "8px",
                },
              }}
            />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <label className="font-medium text-sm text-gray-700">Passengers</label>
            <TextField
              variant="outlined"
              size="small"
              value={passengerLabel}
              onClick={() => setShowPassengers(true)}
              className="w-full"
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <Search className="h-4 w-4 text-black" />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiInputBase-root": {
                  height: "44px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  width: "100%",
                },
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
            <TextField
              variant="outlined"
              size="small"
              value={priceRange}
              onChange={(event) => setPriceRange(event.target.value)}
              placeholder="Enter Minimum - Maximum price"
              sx={{
                width: "100%",
                "& .MuiInputBase-root": {
                  height: "44px",
                  borderRadius: "8px",
                },
              }}
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSearch}
            disabled={!canSearch || loading}
            className="bg-[#023E8A] hover:bg-blue-900 disabled:bg-gray-300 text-white font-light py-2 px-6 rounded-md transition-colors duration-200 h-fit inline-flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            Search
          </button>
        </div>
      </div>

      {showPassengers && (
        <Passengers
          openPassengerModal={showPassengers}
          closeModal={() => setShowPassengers(false)}
          initialValues={passengerCounts}
          handlePassengersUpdate={setPassengerCounts}
        />
      )}
    </div>
  );
}
