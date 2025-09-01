import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  TextField,
  InputAdornment,
  Popper,
  ClickAwayListener,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import { DateRange } from "react-date-range";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../store";
import { setCarInfo } from "../carPaymentSlice";
import { setSearchResults } from "../carPaymentSlice";

// Icons
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import { MdArrowDropDown } from "react-icons/md";
import { Info } from "lucide-react";

// Custom hooks and utilities
import { useBookingForm } from "../hooks/useBookingForm";
import { useFormPersistence } from "../hooks/useFormPersistence";
import { useDateSelection } from "../hooks/useDateSelection";
import { useLocationSearch } from "../hooks/useLocationSearch";
import { useModalState } from "../hooks/useModalState";
import {
  formatPassengerCount,
  formatPriceRange,
} from "../utilities/formatting";
import { BookingFormData } from "../types/booking";

// Components
import Passengers from "./modals/Passengers";
import PriceRange from "./modals/PriceRange";
import RideType from "./modals/RideType";
import RecentSearch from "./RecentSearch";
import { PassengerCounts } from "../types/booking";
import { transferService } from "../services/transferService";
import { formatDate } from "../utilities/formatting";
import SearchPickUpLocation from "./modals/searchPickUp";
import SearchDropOffLocation from "./modals/searchDropOff";

const CarBookingFirstScreen: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const carInfo = useSelector((state: RootState) => state.cars.carInfo);
  const collectFrom = (data: string, data2: string) => {
    setFormData((prev) => ({
      ...prev,
      pickUpLocaDescription: data,
      pickupLocation: data2,
    }));
  };
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
      endGeoLat: latitude,
      endGeoLong: longitude,
      toLat: latitude,
      toLon: longitude,
    }));
  };
  // Initialize form with Redux data or saved data
  const { loadSavedData } = useFormPersistence({} as BookingFormData);
  const initialData = useMemo(() => {
    if (carInfo) {
      return {
        pickupLocation: carInfo.pickupLocation || "",
        pickUpLocaDescription: carInfo.pickupLocaDescription || "",
        dropoffLocation: carInfo.dropoffLocation || "",
        pickupDate: carInfo.pickupDate || "",
        pickupTime: carInfo.pickupTime || "",
        selectedRide: carInfo.selectedRide || "",
        priceRange: carInfo.priceRange || { min: 0, max: 0 },
        passengerCounts: carInfo.passengerCounts || {
          adults: "",
          children: "",
          infant: "",
        },
        endGeoLat: carInfo.endGeoLat,
        endGeoLong: carInfo.endGeoLong,
      };
    }
    return (
      loadSavedData() || {
        pickupLocation: "",
        pickUpLocaDescription: "",
        dropoffLocation: "",

        pickupDate: "",
        pickupTime: "",
        selectedRide: "",
        priceRange: { min: 0, max: 0 },
        passengerCounts: {
          adults: 0,
          children: 0,
          infant: 0,
        },
        endGeoLat: 0,
        endGeoLong: 0,
      }
    );
  }, [carInfo, loadSavedData]);

  const {
    formData,
    setFormData,
    errors,
    isValid,
    loading,
    updateField,
    setLoading,
    setSubmitError,
  } = useBookingForm(initialData);

  // Persist form data
  useFormPersistence(formData);

  // Date selection
  const {
    anchorEl,
    dateRange,
    open: datePickerOpen,
    handleClick: handleDateClick,
    handleClose: handleDateClose,
    handleSelectDate,
    updateDateRange,
  } = useDateSelection((apiDate, displayDate) => {
    updateField("pickupDate", displayDate);
  });

  // Location search
  const { locations, removeLocation } = useLocationSearch();

  // Modal management
  const { modals, openModal, closeModal } = useModalState();

  // Location picker state
  const [pickOrDrop, setPickOrDrop] = useState<"pick" | "drop">("pick");
  const [locationPopper, setLocationPopper] = useState<{
    from: { open: boolean; anchor: HTMLElement | null };
    to: { open: boolean; anchor: HTMLElement | null };
  }>({
    from: { open: false, anchor: null },
    to: { open: false, anchor: null },
  });

  // Sync with Redux store whenever formData changes
  useEffect(() => {
    const reduxData = {
      pickupLocation: formData.pickupLocation,
      pickupLocaDescription: formData.pickUpLocaDescription,
      dropoffLocation: formData.dropoffLocation,
      dropoffLocaDescription: formData.dropoffLocaDescription,
      pickupDate: formData.pickupDate,
      pickupTime: formData.pickupTime,
      selectedRide: formData.selectedRide,
      priceRange: formData.priceRange,
      passengerCounts: formData.passengerCounts,
      endAddress: formData.endAddress,
      endCity: formData.endCity,
      endCountry: formData.endCountry,
      endGeoLat: formData.toLat,
      endGeoLong: formData.toLon,
      fromLat: formData.fromLat,
      fromLon: formData.fromLon,
      toLat: formData.toLat,
      toLon: formData.toLon,
      searchResults: carInfo?.searchResults || [],
    };

    dispatch(setCarInfo(reduxData));
  }, [formData, dispatch, carInfo?.searchResults]);

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
    [pickOrDrop, updateField, closeModal]
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
      // if (min < 6000 || max < 6000) {
      //   openModal("priceError");
      //   return;
      // }
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
    const errors = [];
    if (!/^[A-Z]{3}$/.test(formData.pickupLocation)) {
      errors.push(
        "Pickup location must be a valid 3-letter IATA code (e.g., LOS)"
      );
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
    }

    setSubmitError(null);
    try {
      setLoading(true);
      const params = transferService.convertFormToApiParams({
        ...formData,
        // toLat: formData.toLat,
        // toLon: formData.toLon
      });
      if (!params.fcode || !/^[A-Z]{3}$/.test(params.fcode)) {
        throw new Error("Invalid pickup location code");
      }
      if (!params.tcode || params.tcode === "undefined,undefined") {
        throw new Error("Invalid destination coordinates");
      }
      const result = await transferService.searchTransfers(params);
      if (!result?.data) {
        throw new Error("No transfer results found");
      }
      dispatch(setSearchResults(result?.data?.results?.services || []));
      console.log("Search results:", result?.data);
      navigate("/cars-searchResults", {
        state: {
          ...formData,
          searchResults: result?.data?.results?.services || [],
          times: { pickUpTime: formData.pickupTime, dropOffTime: "" },
          priceRange: {
            min: formData.priceRange.min,
            max: formData.priceRange.max,
          },
          search_id: result?.data?.search_id,
        },
      });
      {
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Search failed");
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
    <div className="car-booking-first-screen">
      {/* Error Alert */}
      {/* {(submitError || searchError) && (
        <ErrorAlert
          message={submitError || searchError || ""} 
          onClose={() => setSubmitError(null)} 
        />
      )} */}

      {/* Shared Ride Info */}
      {formData.selectedRide === "Shared Ride" && (
        <div className="flex items-center gap-3 bg-[#CCD8E880] p-2 rounded-md m-2">
          <Info />
          <p className="text-[#181818] text-xs font-sans">
            Kindly note Shared rides don't go to private addresses. You'll be
            dropped at a nearby landmark.
          </p>
        </div>
      )}

      <div className="flex lg:flex-row flex-col justify-normal lg:items-center gap-8">
        <div className="flex flex-col">
          {/* First Row */}
          <div className="flex lg:flex-row flex-col justify-between lg:items-center gap-4">
            {/* Ride Type */}
            <div className="flex flex-col gap-2">
              <label htmlFor="ride-type">Ride Type</label>
              <TextField
                id="ride-type"
                variant="outlined"
                size="small"
                value={displayValues.rideType}
                onClick={() => openModal("rideType")}
                error={!!errors.selectedRide}
                helperText={errors.selectedRide}
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

            {/* Pick Up Location */}
            <div className="flex flex-col gap-2">
              <label htmlFor="pickup-location">Pick Up</label>
              <TextField
                id="pickup-location"
                variant="outlined"
                size="small"
                placeholder="Search Pick up Location"
                value={formData.pickUpLocaDescription}
                onClick={(e) => handlePickLocationClick(e, "pick")}
                error={!!errors.pickupLocation}
                helperText={errors.pickupLocation}
                InputProps={{
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
                  },
                }}
              />
            </div>

            {/* Drop Off Location */}
            <div className="flex flex-col gap-2">
              <label htmlFor="dropoff-location">Drop Off</label>
              <TextField
                id="dropoff-location"
                variant="outlined"
                size="small"
                placeholder="Search Destination"
                value={formData.dropoffLocation}
                onClick={(e) => handleDropLocationClick(e, "drop")}
                error={!!errors.dropoffLocation}
                helperText={errors.dropoffLocation}
                InputProps={{
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
                  },
                }}
              />
            </div>

            {/* Pick Up Date */}
            <div className="flex flex-col gap-2">
              <label htmlFor="pickup-date">Pick Up Date</label>
              <TextField
                id="pickup-date"
                variant="outlined"
                size="small"
                placeholder="Select Date"
                value={formData.pickupDate || "Select Date"}
                onClick={handleDateClick}
                error={!!errors.pickupDate}
                helperText={errors.pickupDate}
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
                      maxWidth: "95vv",
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
                error={!!errors.pickupTime}
                helperText={errors.pickupTime}
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
              <label htmlFor="passengers">Passengers</label>
              <TextField
                id="passengers"
                variant="outlined"
                size="small"
                value={displayValues.passengers}
                onClick={() => openModal("passengers")}
                error={!!errors.passengers}
                helperText={errors.passengers}
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
              <label htmlFor="price-range">Price Range</label>
              <TextField
                id="price-range"
                variant="outlined"
                size="small"
                placeholder="Enter Minimum - Maximum Price"
                value={displayValues.priceRange}
                onClick={() => openModal("priceRange")}
                error={!!errors.priceRange}
                helperText={errors.priceRange}
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

        {/* Search Button */}
        <div>
          <button
            className="bg-[#023E8A] lg:w-[120px] w-full text-center text-white font-inter text-base rounded-md py-3 lg:mt-14 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
            onClick={() => {
              console.log("Button clicked");
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
          value={formData.pickupLocation}
          setValue={handleLocationSelect}
          collectFrom={collectFrom}
          setExtraFields={(fields) => {
            updateField("endAddress", fields.endAddress);
            updateField("endCity", fields.endCity);
            updateField("endCountry", fields.endCountry);
            updateField("endGeoLat", fields.endGeoLat);
            updateField("endGeoLong", fields.endGeoLong);
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
            console.log("Data received from modal via setExtraFields:", fields);
            updateField("endAddress", fields.endAddress);
            updateField("endCity", fields.endCity);
            updateField("endCountry", fields.endCountry);
            updateField("endGeoLat", fields.endGeoLat);
            updateField("endGeoLong", fields.endGeoLong);
            updateField("fromLat", fields.fromLat);
            updateField("fromLon", fields.fromLon);
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
          open={modals.rideType}
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
          handleCloseNoModal={() => closeModal("priceError")}
          miniprice={formData.priceRange.min}
          maxprice={formData.priceRange.max}
          handleSubmitOffer={handlePriceSubmit}
          // loading={loading}
          handlePriceChange={handlePriceChange}
        />
      )}

      {/* Recent Search Component */}
      <RecentSearch
        openFrom={locationPopper.from.open}
        handleCloseFrom={() =>
          setLocationPopper((prev) => ({
            ...prev,
            from: { ...prev.from, open: false },
          }))
        }
        fromClick={locationPopper.from.anchor}
        handleFromOptionClick={handleLocationSelect}
        handleRemoveOption={removeLocation}
        locations={locations}
        // loading={searchLoading}
      />
    </div>
  );
};

export default CarBookingFirstScreen;
