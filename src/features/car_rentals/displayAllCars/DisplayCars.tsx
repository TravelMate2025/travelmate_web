import React, { useState, useCallback, useMemo } from "react";
import { TextField, InputAdornment, Skeleton } from "@mui/material";
import { useLocation } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

// Icons
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
// import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";
// import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import { MdArrowDropDown } from "react-icons/md";
import { X } from "lucide-react";

// Custom hooks and utilities
import { useBookingForm } from "../hooks/useBookingForm";
import { useFormPersistence } from "../hooks/useFormPersistence";
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
import SearchLocation from "../carsFirstScreen/modals/SearchLoaction";


import { useMediaQuery } from "react-responsive";
import EmptyState from "./EmptyState";
import { BookingFormData, PassengerCounts } from "../types/booking";
import { transferService } from "../services/transferService";
import SearchDropOffLocation from "../carsFirstScreen/modals/searchDropOff";
import SearchPickUpLocation from "../carsFirstScreen/modals/searchPickUp";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

interface LocationState {
  from?: string;
  to?: string;
  departureDate?: string;
  times?: {
    pickUpTime: string;
    dropOffTime: string;
  };
  priceRange?: {
    miniprice: number;
    maxprice: number;
  };
  selectedRide?: string;
  passengerCounts?: {
    adults: number;
    children: number;
    infant: number;
  };
}

const formatPassengerCount = (counts: {
  adults: number;
  children: number;
  infant: number;
}) => {
  const { adults, children, infant } = counts;
  const parts = [];
  if (adults > 0) parts.push(`${adults} adult${adults > 1 ? "s" : ""}`);
  if (children > 0) parts.push(`${children} child${children > 1 ? "ren" : ""}`);
  if (infant > 0) parts.push(`${infant} infant${infant > 1 ? "s" : ""}`);
  return parts.length ? parts.join(", ") : "Select Passengers";
};

const formatDate = (date: Date) => format(date, "dd MMM yyyy");

const DisplayCars = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
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
    const merged =
      state && (stateData.pickupLocation || stateData.dropoffLocation)
        ? { ...savedData, ...stateData }
        : { ...stateData, ...savedData };

    // Ensure priceRange.min and priceRange.max are numbers (not undefined)
    return {
      ...merged,
      priceRange: {
        min:
          typeof merged.priceRange?.min === "number"
            ? merged.priceRange.min
            : 0,
        max:
          typeof merged.priceRange?.max === "number"
            ? merged.priceRange.max
            : 0,
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


  const { modals, openModal, closeModal } = useModalState();
  const [pickOrDrop, setPickOrDrop] = useState<"pick" | "drop">("pick");

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
    <div className="">
      <Navbar />
      {searchPickOrDrop && (
        <SearchLocation
          searchPickOrDrop={searchPickOrDrop}
          closeDialog={() => setSearchPickOrDrop(false)}
          handleFromClick={() => {}} // You can pass a real function if needed
          pickOrDrop={pickOrDrop}
          value={pickOrDrop === "pick" ? from : to}
          setValue={pickOrDrop === "pick" ? setFrom : setTo}
        />
      )}
      {form && (
        <div
          className={` gap-7 lg:bg-gray-200 px-4 lg:px-24 py-16 ${
            form ? "flex" : "hidden"
          } ${
            isMobile
              ? "flex-col w-full items-start"
              : "flex-row justify-normal items-center"
          }`}
        >
          <div className="lg:mt-20 mt-12">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:w-auto w-[90vw]">
              {/* Ride Type */}
              <div className="flex flex-col gap-2 w-full">
                <label>Ride Type</label>
                <TextField
                  variant="outlined"
                  size="small"
                  value={selectedRide}
                  onClick={() => setRideTypeModal(true)}
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
                    },
                  }}
                />
              </div>

              {/* From */}
              <div className="flex flex-col gap-2 w-full">
                <label>Pick Up</label>
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

              {/* To */}
              <div className="flex flex-col gap-2 w-full">
                <label>Drop Off</label>
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

              {/* Departure Date */}
              <div className="flex flex-col gap-2 w-full">
                <label className="font-medium text-sm text-gray-700">
                  Pick Up Date
                </label>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={
                      formData.pickupDate ? dayjs(formData.pickupDate) : null
                    }
                    onChange={(newValue) => {
                      if (newValue) {
                        updateField(
                          "pickupDate",
                          newValue.toISOString().split("T")[0]
                        );
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
                              <CalendarMonthOutlinedIcon />
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
            </div>

            {/* Second Row */}
            <div className="flex flex-col gap-4 mt-5 lg:flex-row">
              <div className="flex flex-col gap-2 w-full">
                <label>Pick Up Time</label>
                <TextField
                  type="time"
                  name="pickUpTime"
                  value={times.pickUpTime}
                  onChange={handleTimeChange}
                  size="small"
                  sx={{
                    "& .MuiInputBase-root": {
                      height: "44px",
                      borderRadius: "8px",
                    },
                  }}
                />
              </div>

              <div className="flex flex-col gap-2 w-full">
                <label>Passengers</label>
                <TextField
                  size="small"
                  className="w-full lg:w-auto"
                  value={formatPassengerCount(passengerCounts)}
                  onClick={() => setOpenPassengerModal(true)}
                  aria-readonly
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{
                    "& .MuiInputBase-root": {
                      height: "44px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      backgroundColor: "#fff",
                    },
                  }}
                />
              </div>

              <div className="flex flex-col gap-2 w-full">
                <label>Price Range</label>
                <TextField
                  size="small"
                  className="w-full lg:w-auto"
                  value={`₦${priceRange.miniprice} - ₦${priceRange.maxprice}`}
                  onClick={() => setOpenClick(true)}
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{
                    "& .MuiInputBase-root": {
                      height: "44px",
                      borderRadius: "8px",
                      cursor: "pointer",
                    },
                  }}
                />
                <PriceRange
                  openClick={openClick}
                  handleCloseClick={() => setOpenClick(false)}
                  handlePriceChange={(e) =>
                    setPriceRange((prev) => ({
                      ...prev,
                      miniprice: Number(e.target.value.replace(/,/g, "")) || 0,
                    }))
                  }
                  handleMaxPriceChange={(e) =>
                    setPriceRange((prev) => ({
                      ...prev,
                      maxprice: Number(e.target.value.replace(/,/g, "")) || 0,
                    }))
                  }
                  openNoModal={openNoModal}
                  handleCloseNoModal={() => setOpenNoModal(false)}
                  miniprice={String(priceRange.miniprice)}
                  maxprice={String(priceRange.maxprice)}
                  handleSubmitOffer={handleSubmitOffer}
                />
              </div>
            </div>
          </div>
          <button
            className="bg-[#023E8A]  lg:w-[120px]  w-full text-center text-white font-inter text-base rounded-md py-3 lg:mt-14 cursor-pointer disabled:bg-gray-400 disabled:cursor-auto"
            onClick={() =>
              isMobile ? setForm(false) : navigate("/cars-searchResults")
            }
          >
            Update
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
      {openPassengerModal && (
        <Passengers
          openPassengerModal={openPassengerModal}
          closeModal={() => setOpenPassengerModal(false)}
          initialValues={passengerCounts}
          handlePassengersUpdate={setPassengerCounts}
        />
      )}

      {/* Car Results */}
      {from && to && selectedRide && passengerCounts && times.pickUpTime && priceRange.maxprice && priceRange.miniprice && dateRange ? (
        <CarList
          departureInfo={{
            from,
            to,
            departureDate,
            times,
            priceRange,
            selectedRide,
            passengerCounts,
          }}
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
