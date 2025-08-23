import React, { useState, useCallback, useMemo } from "react";
import {
  TextField,
  InputAdornment,
  Popper,
  ClickAwayListener,
  Paper,
  Box,
  Typography,
} from "@mui/material";
import { DateRange } from "react-date-range";
import { useLocation, useNavigate } from "react-router-dom";
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
import { transferService } from "../carsFirstScreen/services/transferService";
import SearchDropOffLocation from "../carsFirstScreen/modals/searchDropOff";
import SearchPickUpLocation from "../carsFirstScreen/modals/searchPickUp";

interface LocationState {
  pickupLocation?: string;
  dropoffLocation?: string;
  pickupDate?: string;
  pickupTime?: string;
  selectedRide?: string;
  priceRange?: { min: number; max: number };
  passengerCounts?: PassengerCounts;
  endAddress?: string;
  endCity?: string;
  endCountry?: string;
  endGeoLat?: number;
  endGeoLong?: number;
  fromLat?: number;
  fromLon?: number;
  toLat?: number;
  toLon?: number;
  searchResults?: any[];
}

const DisplayCars: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 768 });

  // Form visibility state
  const [form, setForm] = useState<boolean>(!isMobile);

  // Extract state data with proper defaults
  const stateData = useMemo(() => {
    const locationState = (state || {}) as LocationState;
    return {
      pickupLocation: locationState.pickupLocation || "",
      dropoffLocation: locationState.dropoffLocation || "",
      pickupDate: locationState.pickupDate || "",
      pickupTime: locationState.pickupTime || "",
      selectedRide: locationState.selectedRide || "",
      priceRange: {
        min: locationState.priceRange?.min || 100000,
        max: locationState.priceRange?.max || 200000,
      },
      passengerCounts: locationState.passengerCounts || {
        adults: 2,
        children: 0,
        infant: 0,
      },
      endAddress: locationState.endAddress || undefined,
      endCity: locationState.endCity || undefined,
      endCountry: locationState.endCountry || undefined,
      endGeoLat: locationState.endGeoLat,
      endGeoLong: locationState.endGeoLong,
      fromLat: locationState.fromLat,
      fromLon: locationState.fromLon,
      toLat: locationState.toLat,
      toLon: locationState.toLon,
      searchResults: locationState.searchResults || [],
    };
  }, [state]);

  // Form management with persistence
  const { loadSavedData } = useFormPersistence(
    {} as BookingFormData,
    "displayCarsForm"
  );

  const initialData = useMemo(() => {
    // Merge navigation state with persisted data
    const savedData = loadSavedData() || {};
    if (state && (stateData.pickupLocation || stateData.dropoffLocation)) {
      return { ...savedData, ...stateData };
    }
    return { ...stateData, ...savedData };
  }, [state, stateData, loadSavedData]);

  const {
    formData,
    setFormData,
    errors,
    isValid,
    loading,
    updateField,
    updateFields,
    setLoading,
    submitError,
    setSubmitError,
  } = useBookingForm(initialData);

  // Persist form data to localStorage
  useFormPersistence(formData, "displayCarsForm");

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

  // Modal management
  const { modals, openModal, closeModal } = useModalState();

  // Location picker state
  const [pickOrDrop, setPickOrDrop] = useState<"pick" | "drop">("pick");

  // Event handlers
  const handleDropLocationClick = useCallback(
    (event: React.MouseEvent<HTMLElement>, type: "drop") => {
      setPickOrDrop(type);
      openModal("searchDropLocation");
    },
    [openModal]
  );

  const handlePickLocationClick = useCallback(
    (event: React.MouseEvent<HTMLElement>, type: "pick") => {
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
    (field: "min" | "max", event: React.ChangeEvent<HTMLInputElement>) => {
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
      if (min < 6000 || max < 6000) {
        openModal("priceError");
        return;
      }
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
    console.log("formData:", formData);
    const errors = [];
    if (!/^[A-Z]{3}$/.test(formData.pickupLocation)) {
      errors.push(
        "Pickup location must be a valid 3-letter IATA code (e.g., CDG)"
      );
    }
    if (!formData.dropoffLocation) {
      errors.push("Please enter a valid dropoff location");
    }
    if (
      typeof formData.toLat !== "number" ||
      isNaN(formData.toLat) ||
      typeof formData.toLon !== "number" ||
      isNaN(formData.toLon)
    ) {
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
      const destinationResult = await transferService.lookupHotel(
        formData.dropoffLocation,
        formData.endCountry
      );
      if (destinationResult.success && destinationResult.data?.results) {
        const matchingResult = destinationResult.data.results.find(
          (item: any) =>
            item.name
              .toLowerCase()
              .includes(formData.dropoffLocation.toLowerCase()) &&
            item.countryCode.toUpperCase() === formData.endCountry
        );
        if (matchingResult && matchingResult.coordinates) {
          const latitude = parseFloat(matchingResult.coordinates.latitude);
          const longitude = parseFloat(matchingResult.coordinates.longitude);
          if (isNaN(latitude) || isNaN(longitude)) {
            throw new Error("Invalid coordinates for dropoff location");
          }
          updateFields({
            toLat: latitude,
            toLon: longitude,
            endGeoLat: latitude,
            endGeoLong: longitude,
          });
        } else {
          throw new Error("No matching destination found");
        }
      }

      const params = transferService.convertFormToApiParams({
        ...formData,
        toLat: formData.toLat || 0,
        toLon: formData.toLon || 0,
      });
      const result = await transferService.searchTransfers(params);
      if (!result.data) {
        throw new Error(result.error || "No transfer results found");
      }
      console.log(result);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Search failed");
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  }, [
    isValid,
    formData,
    isMobile,
    navigate,
    setLoading,
    setSubmitError,
    updateFields,
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
    <div className="display-cars">
      <Navbar />

      {/* Error Alert */}
      {submitError && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
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
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      )}

      {/* Search Form */}
      {form && (
        <div
          className={`gap-7 lg:bg-gray-200 px-4 lg:px-24 py-16 ${
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
                  value={formData.pickupLocation}
                  onClick={(e) => handlePickLocationClick(e, "pick")}
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
                  onClick={(e) => handleDropLocationClick(e, "drop")}
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
          value={formData.pickupLocation}
          setValue={handleLocationSelect}
          ChangeValue={(query) =>
            setFormData((prev) => ({
              ...prev,
              pickupLocation: query,
            }))
          }
          setExtraFields={(fields) => {
            updateFields({
              fromLat: fields.fromLat,
              fromLon: fields.fromLon,
              endCountry: fields.endCountry,
            });
          }}
        />
      )}
      {modals.searchDropLocation && (
        <SearchDropOffLocation
          // pickOrDrop="pick"
          // ChangeValue={(query) =>
          //   setFormData((prev) => ({
          //     ...prev,
          //     pickupLocation: query,
          //   }))
          // }
          closeDialog={() => closeModal("searchDropLocation")}
          value={formData.dropoffLocation}
          setValue={handleLocationSelect}
          setExtraFields={(fields) => {
            updateFields({
              endAddress: fields.endAddress,
              endCity: fields.endCity,
              endCountry: fields.endCountry,
              endGeoLat: fields.endGeoLat,
              endGeoLong: fields.endGeoLong,
              toLat: fields.toLat,
              toLon: fields.toLon,
            });
          }}
        />
      )}

      {modals.rideType && (
        <RideType
          open={modals.rideType}
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

      {/* Car Results or Empty State */}
      
        <CarList
          departureInfo={{
            pickupLocation: formData.pickupLocation,
            dropoffLocation: formData.dropoffLocation,
            pickupDate: formData.pickupDate,
            pickupTime: formData.pickupTime,
            priceRange: formData.priceRange,
            selectedRide: formData.selectedRide,
            passengerCounts: formData.passengerCounts,
            endAddress: formData.endAddress,
            endCity: formData.endCity,
            endCountry: formData.endCountry,
            endGeoLat: formData.endGeoLat,
            endGeoLong: formData.endGeoLong,
            fromLat: formData.fromLat,
            fromLon: formData.fromLon,
            toLat: formData.toLat,
            toLon: formData.toLon,
          }}
          searchResults={stateData.searchResults}
          OpenForm={() => setForm(true)}
          loading={loading}
        />
     
    </div>
  );
};
export default DisplayCars;
