import React, { useState, useCallback, useMemo, useEffect } from "react";
import { TextField, InputAdornment, Skeleton } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

// Icons
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { MdArrowDropDown } from "react-icons/md";
import { X } from "lucide-react";

// Custom hooks and utilities
import { useBookingForm } from "../hooks/useBookingForm";
import { useModalState } from "../hooks/useModalState";
import {
  formatPassengerCount,
  formatPriceRange,
} from "../utilities/formatting";

// Components
import Passengers from "../carsFirstScreen/modals/Passengers";
import PriceRange from "../carsFirstScreen/modals/PriceRange";
import RideType from "../carsFirstScreen/modals/RideType";
import CarList from "./CarList";
import Navbar from "../../../pages/homePage/Navbar";
import EmptyState from "./EmptyState";
import { BookingFormData, PassengerCounts } from "../types/booking";
import { transferService } from "../services/transferService";
import SearchDropOffLocation from "../carsFirstScreen/modals/searchDropOff";
import SearchPickUpLocation from "../carsFirstScreen/modals/searchPickUp";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

const DisplayCars: React.FC = () => {
  const { state } = useLocation();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [loadingSkeleton, setLoadingSkeleton] = useState(false);
  const navigate = useNavigate();
  const { modals, openModal, closeModal } = useModalState();
  const [form, setForm] = useState<boolean>(!isMobile);
  const [pickOrDrop, setPickOrDrop] = useState<"pick" | "drop">("pick");
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
  const initialData = useMemo(() => {
    if (!carInfo) {
      return {
        pickupLocation: "",
        pickupLocaDescription: "",
        dropoffLocation: "",
        dropoffLocaDescription: "",
        pickupDate: "",
        pickupTime: "",
        selectedRide: "",
        priceRange: { min: 0, max: 0 },
        passengerCounts: { adults: 0, children: 0, infant: 0 },
        toLat: undefined,
        toLon: undefined,
        searchResults: [],
        search_id: "",
        rate_key: "",
      } as BookingFormData;
    }

    return {
      pickupLocation: carInfo.pickupLocation || "",
      pickupLocaDescription: carInfo.pickupLocaDescription || "",
      dropoffLocation: carInfo.dropoffLocation || "",
      dropoffLocaDescription: carInfo.dropoffLocaDescription || "",
      pickupDate: carInfo.pickupDate || "",
      pickupTime: carInfo.pickupTime || "",
      selectedRide: carInfo.selectedRide || "",
      priceRange: {
        min: carInfo.priceRange?.min ?? 0,
        max: carInfo.priceRange?.max ?? 0,
      },
      passengerCounts: carInfo.passengerCounts || {
        adults: 0,
        children: 0,
        infant: 0,
      },
      toLat: carInfo.toLat,
      toLon: carInfo.toLon,
      searchResults: carInfo.searchResults || [],
      search_id: state.search_id,
      rate_key: "",
    } as BookingFormData;
  }, [carInfo]);

  const {
    formData,
    setFormData,
    errors,
    isValid,
    loading,
    updateField,
    setLoading,
    submitError,
    setSubmitError,
  } = useBookingForm(initialData);


  const stateData = useMemo(() => {
    const locationState = (state || {}) as BookingFormData;
    return {
      pickupLocation: locationState.pickupLocation || "",
      pickupLocaDescription: locationState.pickupLocaDescription || "",
      dropoffLocation: locationState.dropoffLocation || "",
      pickupDate: locationState.pickupDate || "",
      pickupTime: locationState.pickupTime || "",
      selectedRide: locationState.selectedRide || "",
      priceRange: {
        min: locationState.priceRange?.min,
        max: locationState.priceRange?.max,
      },
      passengerCounts: locationState.passengerCounts,
      toLat: locationState.toLat,
      toLon: locationState.toLon,
      searchResults: locationState.searchResults || [],
      search_id: locationState.search_id || "",
    };
  }, [state]);

  useEffect(() => {
    if (!carInfo || !carInfo.pickupLocation) {
      console.warn("No car search data found, redirecting to search page");
      navigate("/" , {replace: true} );
    }
  }, [carInfo, navigate]);

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

  const handleLocationSelect = useCallback(
    (location: string) => {
      if (pickOrDrop === "pick") {
        updateField("pickupLocation", location);
      } else {
        updateField("dropoffLocation", location);
      }
    },
    [pickOrDrop, updateField]
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

  const handleUpdateSearch = useCallback(async () => {
    const errors = [];
    if (!formData.pickupLocation) {
      errors.push("Please enter a valid pickup location");
    }
    if (!formData.dropoffLocation) {
      errors.push("Please enter a valid dropoff location");
    }
    if (!formData.toLat || !formData.toLon) {
      errors.push("Dropoff location must have valid GPS coordinates");
    }
    if (!formData.pickupDate) {
      errors.push("Please select a pickup date");
    }
    if (!formData.pickupTime) {
      errors.push("Please select a pickup time");
    }
    if (!isValid) {
      errors.push("Please fill in all required fields correctly");
    }

    if (errors.length > 0) {
      setSubmitError(errors.join(", "));
      return;
    }

    setSubmitError(null);
    try {
      setLoading(true);

      setLoadingSkeleton(true);
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
      updateField("searchResults", result?.data?.results?.services || []);
      if (isMobile) {
        setForm(false);
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Search failed");
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
      setLoadingSkeleton(false);
    }
  }, [
    isValid,
    formData,
    isMobile,
    setLoading,
    setSubmitError,
    updateField,
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
  console.log(formData)

  return (
    <div className="relative">
      <Navbar />

      {/* Error Alert */}
      {submitError && (
        <div
          className="absolute top-24 left-0 w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded "
          role="alert"
        >
          <span className="block sm:inline">{submitError}</span>
          <span
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setSubmitError(null)}
          >
            <X className="h-6 w-6 text-red-500 cursor-pointer" />
          </span>
        </div>
      )}

      {/* Loading Spinner */}

      {/* Search Form */}
      {form && (
        <div
          className={`gap-7 lg:bg-gray-200 px-4 lg:px-24 py-20 pt-24 ${
            form ? "flex" : "hidden"
          } ${
            isMobile
              ? "flex-col w-full items-start"
              : "flex-row justify-normal items-center"
          }`}
        >
          <div className="lg:mt-20 mt-12">
            {/* First Row */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:w-auto w-[90vw]">
              {/* Ride Type */}
              <div className="flex flex-col gap-2 w-full">
                <label className="font-medium text-sm text-gray-700">
                  Ride Type
                </label>
                <TextField
                  variant="outlined"
                  size="small"
                  value={displayValues.rideType}
                  onClick={() => openModal("rideType")}
                  error={!!errors.selectedRide}
                  helperText={errors.selectedRide}
                  className="w-full lg:w-auto"
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
                    },
                  }}
                />
              </div>

              {/* From Location */}
              <div className="flex flex-col gap-2 w-full">
                <label className="font-medium text-sm text-gray-700">
                  Pick Up
                </label>
                <TextField
                  variant="outlined"
                  size="small"
                  className="w-full lg:w-auto"
                  placeholder="Enter Pick Up Location"
                  value={formData.pickupLocaDescription}
                  onClick={() => handlePickLocationClick("pick")}
                  error={!!errors.pickupLocation}
                  helperText={errors.pickupLocation}
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
                      cursor: "pointer",
                    },
                  }}
                />
              </div>

              {/* To Location */}
              <div className="flex flex-col gap-2 w-full">
                <label className="font-medium text-sm text-gray-700">
                  Drop Off
                </label>
                <TextField
                  variant="outlined"
                  size="small"
                  className="w-full lg:w-auto"
                  placeholder="Enter Drop Off Location"
                  value={formData.dropoffLocation}
                  onClick={() => handleDropLocationClick("drop")}
                  error={!!errors.dropoffLocation}
                  helperText={errors.dropoffLocation}
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
                      cursor: "pointer",
                    },
                  }}
                />
              </div>

              {/* Departure Date */}
              <div className="flex flex-col gap-2 w-full">
                <label className="font-medium text-sm text-gray-700">
                  Pick Up Date
                </label>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    disablePast
                    value={
                      formData.pickupDate ? dayjs(formData.pickupDate) : null
                    }
                    onChange={(newValue) => {
                      if (newValue) {
                        updateField(
                          "pickupDate",
                          newValue.format("YYYY-MM-DD")
                        );
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
                {errors.pickupDate && (
                  <p className="text-xs text-red-700 pl-3">
                    {errors.pickupDate}
                  </p>
                )}
              </div>
            </div>

            {/* Second Row */}
            <div className="flex flex-col gap-4 mt-5 lg:flex-row">
              {/* Pick Up Time */}
              <div className="flex flex-col gap-2 w-full">
                <label className="font-medium text-sm text-gray-700">
                  Pick Up Time
                </label>
                <TextField
                  type="time"
                  value={formData.pickupTime}
                  onChange={handleTimeChange}
                  error={!!errors.pickupTime}
                  helperText={errors.pickupTime}
                  size="small"
                  sx={{
                    "& .MuiInputBase-root": {
                      height: "44px",
                      borderRadius: "8px",
                    },
                  }}
                />
              </div>

              {/* Passengers */}
              <div className="flex flex-col gap-2 w-full">
                <label className="font-medium text-sm text-gray-700">
                  Passengers
                </label>
                <TextField
                  size="small"
                  className="w-full lg:w-auto"
                  value={displayValues.passengers}
                  onClick={() => openModal("passengers")}
                  error={!!errors.passengerCounts}
                  helperText={errors.passengerCounts}
                  placeholder="Select Passengers"
                  InputProps={{ readOnly: true }}
                  sx={{
                    "& .MuiInputBase-root": {
                      height: "44px",
                      borderRadius: "8px",
                      cursor: "pointer",
                    },
                  }}
                />
              </div>

              {/* Price Range */}
              <div className="flex flex-col gap-2 w-full">
                <label className="font-medium text-sm text-gray-700">
                  Price Range
                </label>
                <TextField
                  size="small"
                  className="w-full lg:w-auto"
                  value={displayValues.priceRange}
                  onClick={() => openModal("priceRange")}
                  error={!!errors.priceRange}
                  helperText={errors.priceRange}
                  placeholder="Select Price Range"
                  InputProps={{ readOnly: true }}
                  sx={{
                    "& .MuiInputBase-root": {
                      height: "44px",
                      borderRadius: "8px",
                      cursor: "pointer",
                    },
                  }}
                />
              </div>
            </div>
          </div>

          {/* Update Button */}
          <button
            className="bg-[#023E8A] lg:w-[120px] w-full text-center text-white font-inter text-base rounded-md py-3 lg:mt-14 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
            onClick={handleUpdateSearch}
            disabled={!isValid || loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      )}

      {/* Modals */}

      {modals.searchPickLocation && (
        <SearchPickUpLocation
          closeDialog={() => closeModal("searchPickLocation")}
          value={formData.pickupLocaDescription}
          setValue={handleLocationSelect}
          ChangeValue={(query) =>
            setFormData((prev) => ({
              ...prev,
              pickupLocaDescription: query,
            }))
          }
          setExtraFields={(fields) => {
            updateField("toLat", fields.toLat);
            updateField("toLon", fields.toLon);
          }}
        />
      )}
      {modals.searchDropLocation && (
        <SearchDropOffLocation
          closeDialog={() => closeModal("searchDropLocation")}
          value={formData.dropoffLocation}
          collectTo={collectTo}
          setValue={handleLocationSelect}
          ChangeValue={(query) =>
            setFormData((prev) => ({
              ...prev,
              dropoffLocation: query,
            }))
          }
          setExtraFields={(fields) => {
            updateField("toLat", fields.toLat);
            updateField("toLon", fields.toLon);
          }}
        />
      )}

      {modals.rideType && (
        <RideType
          // open={modals.rideType}
          closeModal={() => closeModal("rideType")}
          selectedRide={formData.selectedRide}
          handleSelectRide={handleRideSelect}
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

      {loadingSkeleton ? (
        <div className="px-4 lg:px-24 py-10 space-y-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex gap-4 items-center p-4  rounded-lg shadow-sm bg-white"
            >
              <Skeleton variant="rectangular" width={120} height={80} />
              <div className="flex-1 space-y-3">
                <Skeleton variant="text" width="60%" height={24} />
                <Skeleton variant="text" width="40%" height={20} />
                <Skeleton variant="text" width="80%" height={20} />
              </div>
              <Skeleton variant="rectangular" width={100} height={40} />
            </div>
          ))}
        </div>
      ) : (carInfo?.searchResults?.length ?? 0) > 0 ? (
        <CarList
          departureInfo={{
            pickupLocation: formData.pickupLocation,
            pickupLocaDescription: formData.pickupLocaDescription,
            dropoffLocaDescription: formData.dropoffLocaDescription,
            dropoffLocation: formData.dropoffLocation,
            pickupDate: formData.pickupDate,
            pickupTime: formData.pickupTime,
            priceRange: formData.priceRange,
            selectedRide: formData.selectedRide,
            passengerCounts: formData.passengerCounts,
            toLat: formData.toLat,
            toLon: formData.toLon,
            search_id: formData.search_id,
          }}
          searchResults={carInfo?.searchResults || stateData.searchResults}
          OpenForm={() => setForm(true)}
          loading={loading}
          rate_key={formData.rate_key ?? ""}
        />
      ) : (
        <EmptyState
          content=" Looks like there are no available Taxi that match your search. Try
        updating your location, date, time or price range and search again."
          title="No Taxi Avaiable"
        />
      )}
    </div>
  );
};
export default DisplayCars;
