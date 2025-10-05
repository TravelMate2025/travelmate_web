import React, { useState, useCallback, useMemo } from "react";
import {
  TextField,
  InputAdornment,
  Popper,
  ClickAwayListener,
  Paper,
  Box,
  Typography,
  Skeleton,
} from "@mui/material";
import { DateRange } from "react-date-range";
import { useLocation } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

// Icons
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import { MdArrowDropDown } from "react-icons/md";
import { X } from "lucide-react";

// Custom hooks and utilities
import { useBookingForm } from "../hooks/useBookingForm";
import { useFormPersistence } from "../hooks/useFormPersistence";
import { useDateSelection } from "../hooks/useDateSelection";
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
import { formatDate } from "../utilities/formatting";
import { transferService } from "../services/transferService";
import SearchDropOffLocation from "../carsFirstScreen/modals/searchDropOff";
import SearchPickUpLocation from "../carsFirstScreen/modals/searchPickUp";

interface LocationState {
  pickupLocation?: string;
  pickUpLocaDescription?: string;
  dropoffLocation?: string;
  pickupDate?: string;
  pickupTime?: string;
  selectedRide?: string;
  priceRange?: { min: number; max: number };
  passengerCounts?: PassengerCounts;
  endAddress?: string;
  endCity?: string;
  endCountry?: string;
  fromLat?: number;
  fromLon?: number;
  toLat?: number;
  toLon?: number;
  searchResults?: any[];
  search_id?: string;
}

const DisplayCars: React.FC = () => {
  const { state } = useLocation();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [loadingSkeleton, setLoadingSkeleton] = useState(false);
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

  // Form visibility state
  const [form, setForm] = useState<boolean>(!isMobile);

  // Extract state data with proper defaults
  const stateData = useMemo(() => {
    const locationState = (state || {}) as LocationState;
    return {
      pickupLocation: locationState.pickupLocation || "",
      pickUpLocaDescription: locationState.pickUpLocaDescription || "",
      dropoffLocation: locationState.dropoffLocation || "",
      pickupDate: locationState.pickupDate || "",
      pickupTime: locationState.pickupTime || "",
      selectedRide: locationState.selectedRide || "",
      priceRange: {
        min: locationState.priceRange?.min,
        max: locationState.priceRange?.max,
      },
      passengerCounts: locationState.passengerCounts,
      endAddress: locationState.endAddress || undefined,
      endCity: locationState.endCity || undefined,
      endCountry: locationState.endCountry || undefined,
      fromLat: locationState.fromLat,
      fromLon: locationState.fromLon,
      toLat: locationState.toLat,
      toLon: locationState.toLon,
      searchResults: locationState.searchResults || [],
      search_id: locationState.search_id || "",
    };
  }, [state]);

  const { loadSavedData } = useFormPersistence(
    {} as BookingFormData,
    "carBookingForm"
  );

  const initialData = useMemo(() => {
    const savedData = loadSavedData() || {};
    const merged = state && (stateData.pickupLocation || stateData.dropoffLocation)
      ? { ...savedData, ...stateData }
      : { ...stateData, ...savedData };

    // Ensure priceRange.min and priceRange.max are numbers (not undefined)
    return {
      ...merged,
      priceRange: {
        min: typeof merged.priceRange?.min === "number" ? merged.priceRange.min : 0,
        max: typeof merged.priceRange?.max === "number" ? merged.priceRange.max : 0,
      },
    };
  }, [state, stateData, loadSavedData]);

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

  // Persist form data to localStorage
  useFormPersistence(formData, "carBookingForm");

  // Date selection
  const {
    anchorEl,
    dateRange,
    open: datePickerOpen,
    handleClick: handleDateClick,
    handleClose: handleDateClose,
    handleSelectDate,
    updateDateRange,
  } = useDateSelection((displayDate) => {
    updateField("pickupDate", displayDate);
  });

  const { modals, openModal, closeModal } = useModalState();
  const [pickOrDrop, setPickOrDrop] = useState<"pick" | "drop">("pick");

  // Event handlers
  const handleDropLocationClick = useCallback(
    ( type: "drop") => {
      setPickOrDrop(type);
      openModal("searchDropLocation");
    },
    [openModal]
  );

  const handlePickLocationClick = useCallback(
    ( type: "pick") => {
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

  const handlePriceChange = useCallback(
    (
      field: "min" | "max",
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const value = event.target.value.replace(/[^0-9]/g, "");
      const parsedValue = value ? parseInt(value, 10) : 0;
      updateField("priceRange", {
        ...formData.priceRange,
        [field]: parsedValue,
      });
    },
    [updateField, formData.priceRange]
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

    if (isMobile) {
      setForm(false);
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
        throw new Error("Invalid destination coordinates");
      }
      const result = await transferService.searchTransfers(params);
      if (!result?.data?.results?.services) {
        throw new Error(result.error || "No transfer results found");
      }
      updateField("searchResults", result?.data?.results?.services || []);
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
                  value={formData.pickUpLocaDescription}
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
                  onClick={() => handleDropLocationClick( "drop")}
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
                <TextField
                  variant="outlined"
                  size="small"
                  className="w-full lg:w-auto"
                  value={formData.pickupDate || "Select Date"}
                  onClick={handleDateClick}
                  error={!!errors.pickupDate}
                  helperText={errors.pickupDate}
                  placeholder="Select Date"
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarMonthOutlinedIcon />
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

                {/* Date Range Popper */}
                <Popper
                  id="date-range-popper"
                  open={datePickerOpen}
                  anchorEl={anchorEl}
                  placement="bottom-start"
                  modifiers={[
                    {
                      name: "offset",
                      options: { offset: [0, 10] },
                    },
                  ]}
                >
                  <ClickAwayListener onClickAway={handleDateClose}>
                    <Paper
                      elevation={3}
                      sx={{
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                        width: {
                          xs: "90vw",
                          sm: "500px",
                          md: "650px",
                          lg: "850px",
                        },
                        maxWidth: "95vw",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        p: 2,
                      }}
                    >
                      <Box sx={{ width: "100%" }}>
                        <DateRange
                          editableDateInputs={true}
                          onChange={updateDateRange}
                          moveRangeOnFirstSelection={false}
                          ranges={dateRange}
                          rangeColors={["#FF6F1E"]}
                          months={window.innerWidth < 768 ? 1 : 2}
                          direction={
                            window.innerWidth < 768 ? "vertical" : "horizontal"
                          }
                          showDateDisplay={false}
                          className="w-full"
                        />

                        <Box sx={{ mt: 2, width: "100%" }}>
                          <Typography
                            variant="body2"
                            align="center"
                            fontWeight={600}
                            gutterBottom
                          >
                            {dateRange[0].startDate
                              ? `${formatDate(dateRange[0].startDate)}${
                                  dateRange[0].endDate
                                    ? ` - ${formatDate(dateRange[0].endDate)}`
                                    : ""
                                }`
                              : "Pick a date"}
                          </Typography>

                          <button
                            className="w-full h-[52px] rounded-[4px] font-inter text-[14px] font-medium"
                            style={{
                              backgroundColor: "#023E8A",
                              color: "white",
                              marginTop: "12px",
                            }}
                            onClick={handleSelectDate}
                          >
                            Select Date
                          </button>
                        </Box>
                      </Box>
                    </Paper>
                  </ClickAwayListener>
                </Popper>
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
          value={formData.pickUpLocaDescription}
          setValue={handleLocationSelect}
           ChangeValue={(query) =>
            setFormData((prev) => ({
              ...prev,
              pickUpLocaDescription: query,
            }))
          }
          setExtraFields={(fields) => {
            updateField("endAddress", fields.endAddress);
            updateField("endCity", fields.endCity);
            updateField("endCountry", fields.endCountry);
            updateField("fromLat", fields.fromLat);
            updateField("fromLon", fields.fromLon);
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
            updateField("endAddress", fields.endAddress);
            updateField("endCity", fields.endCity);
            updateField("endCountry", fields.endCountry);
            updateField("fromLat", fields.fromLat);
            updateField("fromLon", fields.fromLon);
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
          handleCloseNoModal={() => closeModal("priceError")}
          miniprice={formData.priceRange.min}
          maxprice={formData.priceRange.max}
          handleSubmitOffer={handlePriceSubmit}
          handlePriceChange={handlePriceChange}
        />
      )}

      {loadingSkeleton ? (
        <div className="px-4 lg:px-24 py-10 space-y-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex gap-4 items-center p-4 border rounded-lg shadow-sm bg-white"
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
      ) : (formData?.searchResults?.length ?? 0) > 0 ? (
        <CarList
          departureInfo={{
            pickupLocation: formData.pickupLocation,
            pickUpLocaDescription: formData.pickUpLocaDescription,
            dropoffLocaDescription: formData.dropoffLocaDescription,
            dropoffLocation: formData.dropoffLocation,
            pickupDate: formData.pickupDate,
            pickupTime: formData.pickupTime,
            priceRange: formData.priceRange,
            selectedRide: formData.selectedRide,
            passengerCounts: formData.passengerCounts,
            endAddress: formData.endAddress,
            endCity: formData.endCity,
            endCountry: formData.endCountry,
            fromLat: formData.fromLat,
            fromLon: formData.fromLon,
            toLat: formData.toLat,
            toLon: formData.toLon,
            search_id: formData.search_id,
          }}
          searchResults={formData.searchResults || stateData.searchResults}
          OpenForm={() => setForm(true)}
          loading={loading}
          rate_key={formData.rate_key ?? ""}
        />
      ) : (
        <EmptyState />
      )}
    </div>
  );
};
export default DisplayCars;
