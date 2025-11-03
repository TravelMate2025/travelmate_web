import React, { useState, useEffect, useCallback, useMemo } from "react";
import { TextField, InputAdornment } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../store";
import { setCarInfo } from "../carPaymentSlice";
import { setSearchResults } from "../carPaymentSlice";

// Icons
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { MdArrowDropDown } from "react-icons/md";
import { Info } from "lucide-react";

// Custom hooks and utilities
import { useBookingForm } from "../hooks/useBookingForm";
// import { useFormPersistence } from "../hooks/useFormPersistence"; // REMOVED
import { useModalState } from "../hooks/useModalState";

import {
  formatPassengerCount,
  formatPriceRange,
} from "../utilities/formatting";
import { BookingFormData } from "../types/booking";

// Components
import Passengers from "./modals/Passengers";
import PriceRange from "./modals/PriceRange";
import { PassengerCounts } from "../types/booking";
import { transferService } from "../services/transferService";
import SearchPickUpLocation from "./modals/searchPickUp";
import SearchDropOffLocation from "./modals/searchDropOff";
import toast from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import RideType from "./modals/RideType";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { validateBookingForm } from "../utilities/validation";

const CarBookingFirstScreen: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const carInfo = useSelector((state: RootState) => state.cars.carInfo);

  const collectTo = (
    data: string,
    data2: string,
    latitude: number,
    longitude: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      dropoffLocaDescription: data,
      dropoffLocation: data2,
      toLat: latitude,
      toLon: longitude,
    }));
  };
  // Initialize form with Redux data or saved data
  // const { loadSavedData } = useFormPersistence({} as BookingFormData); // REMOVED

  const initialData = useMemo(() => {
    // Determine the base source: Redux > Default
    let baseData: Partial<BookingFormData> = {};

    if (carInfo) {
      baseData = carInfo;
    } else {
      // NO LOCAL STORAGE FALLBACK. Use strict defaults if Redux is empty.
      baseData = {};
    }

    // FIX: Ensure date is correctly formatted when read from storage/state
    // to prevent time zone shifts when initializing Dayjs.
    const safePickupDate = baseData.pickupDate
      ? dayjs(baseData.pickupDate).format("YYYY-MM-DD")
      : "";

    return {
      pickupLocation: baseData.pickupLocation || "",
      pickupLocaDescription: baseData.pickupLocaDescription || "",
      dropoffLocation: baseData.dropoffLocation || "",
      // Use the safely formatted date string
      pickupDate: safePickupDate,
      pickupTime: baseData.pickupTime || "",
      selectedRide: baseData.selectedRide || "",
      priceRange: baseData.priceRange || { min: 0, max: 0 },
      passengerCounts: baseData.passengerCounts || {
        adults: 0,
        children: 0,
        infant: 0,
      },
      toLat: baseData.toLat ? Number(baseData.toLat) : undefined,
      toLon: baseData.toLon ? Number(baseData.toLon) : undefined,
    } as BookingFormData;
  }, [carInfo]);

  const {
    formData,
    setFormData,
    errors,
    isValid,
    loading,
    touched,
    handleBlur,
    setTouched,
    updateField,
    setLoading,
    setSubmitError,
  } = useBookingForm(initialData);

  // Modal management
  const { modals, openModal, closeModal } = useModalState();

  // Location picker state
  const [pickOrDrop, setPickOrDrop] = useState<"pick" | "drop">("pick");

  // Redux Sync: CRITICAL for making Redux the single source of truth.
  useEffect(() => {
    const reduxData = {
      pickupLocation: formData.pickupLocation,
      pickupLocaDescription: formData.pickupLocaDescription,
      dropoffLocation: formData.dropoffLocation,
      dropoffLocaDescription: formData.dropoffLocaDescription,
      pickupDate: formData.pickupDate,
      pickupTime: formData.pickupTime,
      selectedRide: formData.selectedRide,
      priceRange: formData.priceRange,
      passengerCounts: formData.passengerCounts,
      toLat: formData.toLat,
      toLon: formData.toLon,
      searchResults: carInfo?.searchResults || [],
    };

    dispatch(setCarInfo(reduxData));
  }, [formData, dispatch, carInfo?.searchResults]);

  // Event handlers
  const handleDropLocationClick = useCallback(
    (type: "drop") => {
      setPickOrDrop(type);
      openModal("searchDropLocation");
    },
    [openModal]
  );
  const handlePickLocationClick = useCallback(
    (type: "pick") => {
      setPickOrDrop(type);
      openModal("searchPickLocation");
    },
    [openModal]
  );

  const handleRideClick = () => {
    openModal("rideType");
  };
  const handleLocationSelect = useCallback(
    (location: string) => {
      if (pickOrDrop === "pick") {
        updateField("pickupLocation", location);
      } else {
        updateField("dropoffLocation", location);
      }
    },
    [pickOrDrop, updateField, closeModal]
  );

  const handleTimeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      updateField("pickupTime", event.target.value);
    },
    [updateField]
  );

  const handlePriceSubmit = useCallback(
    (min: number, max: number) => {
      updateField("priceRange", { min, max });
      closeModal("priceRange");
    },
    [updateField, openModal, closeModal]
  );

  const handlePassengerUpdate = useCallback(
    (newCounts: PassengerCounts) => {
      updateField("passengerCounts", newCounts);
      closeModal("passengers");
    },
    [updateField, closeModal]
  );

  const handleRideSelect = useCallback(
    (ride: string) => {
      updateField("selectedRide", ride);
      closeModal("rideType");
    },
    [updateField, closeModal]
  );
  const handleSearch = useCallback(async () => {
    setTouched({
      pickupLocation: true,
      dropoffLocation: true,
      pickupDate: true,
      pickupTime: true,
      selectedRide: true,
      priceRange: true,
      passengers: true,
    });
    const errors = [];
    validateBookingForm(formData);
    if (!isValid) {
      errors.push("Please fill in all required fields correctly");
    }

    if (errors.length > 0) {
      setSubmitError(errors.join(", "));
    }

    setSubmitError(null);
    try {
      setLoading(true);
      const params = transferService.convertFormToApiParams({
        ...formData,
      });
      if (!params.fcode || !/^[A-Z]{3}$/.test(params.fcode)) {
        throw new Error("Invalid pickup location code");
      }
      if (!params.tcode || params.tcode === "undefined,undefined") {
        setFormData((prev) => ({ ...prev, dropoffLocaDescription: "" }));
        throw new Error(
          "Invalid destination coordinates, enter drop off location again"
        );
      }
      const result = await transferService.searchTransfers(params);
      if (!result?.data?.results?.services) {
        throw new Error(result.error || "No transfer results found");
      }
      dispatch(setSearchResults(result?.data?.results?.services || []));
      console.log("Search results:", result?.data?.results?.services);
      navigate("/cars-searchResults");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Search failed");
      toast.error(error instanceof Error ? error.message : "Search failed");
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  }, [
    isValid,
    formData,
    navigate,
    setSubmitError,
    setLoading,
    transferService,
  ]);

  // Memoized display values
  const displayValues = useMemo(
    () => ({
      passengers: formatPassengerCount(formData.passengerCounts),
      priceRange: formatPriceRange(formData.priceRange),
      rideType: formData.selectedRide || "Select Ride Type",
    }),
    [formData]
  );

  return (
    <div className="">
      <ToastContainer />
      {/* Shared Ride Info */}
      {(formData.selectedRide === "Shared Ride" ||
        formData.selectedRide === "Private and Shared Ride") && (
        <div className="flex items-center gap-3 bg-[#CCD8E880] p-2 rounded-md mb-2">
          <Info />
          <p className="text-[#181818] text-xs">
            Kindly note Shared rides don't go to private addresses. You'll be
            dropped at a nearby landmark.
          </p>
        </div>
      )}

      <div className="flex lg:flex-row flex-col justify-normal lg:justify-center lg:items-center gap-8 lg:min-w-full lg:max-w-full ">
        <div className="flex flex-col">
          {/* First Row */}
          <div className="flex lg:flex-row flex-col justify-between lg:items-center gap-4 w-full">
            {/* Ride Type */}
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="ride-type">Ride Type</label>
              <TextField
                id="ride-type"
                variant="outlined"
                size="small"
                value={displayValues.rideType}
                onClick={() => handleRideClick()}
                className="cursor-pointer"
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <MdArrowDropDown />
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

            {/* Pick Up Location */}
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="pickup-location">Pick Up</label>
              <TextField
                id="pickup-location"
                variant="outlined"
                size="small"
                placeholder="Search Terminal"
                value={formData.pickupLocaDescription}
                onClick={() => handlePickLocationClick("pick")}
                onBlur={() => handleBlur("pickupLocation")}
                error={
                  Boolean(touched.pickupLocation) &&
                  Boolean(errors.pickupLocation)
                }
                helperText={touched.pickupLocation && errors.pickupLocation}
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnOutlinedIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiInputBase-root": {
                    height: "44px",
                    borderRadius: "8px",
                    width: "100%",
                  },
                }}
              />
            </div>

            {/* Drop Off Location */}
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="dropoff-location">Drop Off</label>
              <TextField
                id="dropoff-location"
                variant="outlined"
                size="small"
                placeholder="Search Destination"
                value={formData.dropoffLocation}
                onClick={() => handleDropLocationClick("drop")}
                onBlur={() => handleBlur("dropoffpLocation")}
                error={
                  Boolean(touched.dropoffLocation) &&
                  Boolean(errors.dropoffLocation)
                }
                helperText={touched.dropoffLocation && errors.dropoffLocation}
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnOutlinedIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiInputBase-root": {
                    height: "44px",
                    borderRadius: "8px",
                    width: "100%",
                  },
                }}
              />
            </div>

            {/* Pick Up Date */}
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="pickup-date">Pick Up Date</label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  disablePast
                  value={
                    formData.pickupDate ? dayjs(formData.pickupDate) : null
                  }
                  onChange={(newValue) => {
                    if (newValue) {
                      updateField("pickupDate", newValue.format("YYYY-MM-DD"));
                    }
                  }}
                  slotProps={{
                    textField: {
                      size: "small",
                      variant: "outlined",
                      InputProps: {
                        readOnly: true,
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
          </div>

          {/* Second Row */}
          <div className="flex lg:flex-row flex-col justify-between items-center w-full gap-4 mt-5">
            {/* Pick Up Time */}
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="pickup-time">Pick Up Time</label>
              <TextField
                id="pickup-time"
                type="time"
                variant="outlined"
                size="small"
                value={formData.pickupTime}
                onChange={handleTimeChange}
                // error={!!errors.pickupTime}
                // helperText={errors.pickupTime}
                sx={{
                  "& .MuiInputBase-root": {
                    height: "44px",
                    borderRadius: "8px",
                    width: "100%",
                  },
                }}
              />
            </div>

            {/* Passengers */}
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="passengers">Passengers</label>
              <TextField
                id="passengers"
                variant="outlined"
                size="small"
                value={displayValues.passengers}
                onClick={() => openModal("passengers")}
                onBlur={() => handleBlur("passengers")}
                error={
                  Boolean(touched.passengers) && Boolean(errors.passengers)
                }
                helperText={touched.passengers && errors.passengers}
                placeholder="Select Passengers"
                InputProps={{ readOnly: true }}
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

            {/* Price Range */}
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="price-range">Price Range</label>
              <TextField
                id="price-range"
                variant="outlined"
                size="small"
                placeholder="Enter Minimum - Maximum Price"
                value={displayValues.priceRange}
                onClick={() => openModal("priceRange")}
                // error={!!errors.priceRange}
                // helperText={errors.priceRange}
                InputProps={{ readOnly: true }}
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
          </div>
        </div>

        {/* Search Button */}
        <div className="">
          <button
            className="bg-[#023E8A] lg:w-[120px] w-full text-center text-white font-inter text-base rounded-md py-3 lg:mt-14 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
            onClick={() => {
              handleSearch();
            }}
            disabled={!isValid || loading}
          >
            {loading ? "Searching..." : "Search Taxi"}
          </button>
        </div>
      </div>

      {/* Modals */}

      {modals.searchPickLocation && (
        <SearchPickUpLocation
          closeDialog={() => closeModal("searchPickLocation")}
          value={formData.pickupLocaDescription}
          setValue={handleLocationSelect}
          setExtraFields={(fields) => {
            updateField("toLat", fields.toLat);
            updateField("toLon", fields.toLon);
          }}
          ChangeValue={(query) =>
            setFormData((prev) => ({
              ...prev,
              pickupLocaDescription: query,
            }))
          }
        />
      )}
      {modals.searchDropLocation && (
        <SearchDropOffLocation
          closeDialog={() => closeModal("searchDropLocation")}
          value={formData.dropoffLocation}
          collectTo={collectTo}
          setValue={handleLocationSelect}
          ChangeValue={(query, lat, lon) =>
            setFormData((prev) => ({
              ...prev,
              dropoffLocation: query,
              toLat: lat,
              toLon: lon,
            }))
          }
          setExtraFields={(fields) => {
            updateField("toLat", fields.toLat);
            updateField("toLon", fields.toLon);
          }}
        />
      )}
      {modals.passengers && (
        <Passengers
          openPassengerModal={modals.passengers}
          closeModal={() => closeModal("passengers")}
          initialValues={formData.passengerCounts}
          handlePassengersUpdate={handlePassengerUpdate}
        />
      )}

      {modals.rideType && (
        <RideType
          closeModal={() => closeModal("rideType")}
          selectedRide={formData.selectedRide}
          handleSelectRide={handleRideSelect}
        />
      )}

      {modals.priceRange && (
        <PriceRange
          openClick={modals.priceRange}
          handleCloseClick={() => closeModal("priceRange")}
          openNoModal={modals.priceError}
          miniprice={formData.priceRange.min}
          maxprice={formData.priceRange.max}
          handleSubmitOffer={handlePriceSubmit}
        />
      )}
    </div>
  );
};

export default CarBookingFirstScreen;
