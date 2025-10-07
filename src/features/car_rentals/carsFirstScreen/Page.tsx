import React, { useState, useEffect, useCallback, useMemo } from "react";
import { TextField, InputAdornment } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useNavigate } from "react-router-dom";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import { MdArrowDropDown } from "react-icons/md";
import { Info } from "lucide-react";

// Custom hooks and utilities
import { useBookingForm } from "../hooks/useBookingForm";
import { useFormPersistence } from "../hooks/useFormPersistence";
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
import dayjs from "dayjs"

const CarBookingFirstScreen: React.FC = () => {
  const navigate = useNavigate();

  const [, setSelectedValue] = useState<string>(() => {
    return localStorage.getItem("tripType") || "round-trip";
  });
  const [FromClick, setFromClick] = useState<HTMLElement | null>(null);
  const [ToClick, setToClick] = useState<HTMLElement | null>(null);

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
          adults: 0,
          children: 0,
          infant: 0,
        },
        toLat: typeof carInfo.toLat === "number" ? carInfo.toLat : undefined,
        toLon: typeof carInfo.toLon === "number" ? carInfo.toLon : undefined,
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
        toLat: undefined,
        toLon: undefined,
      }
    );
  }, [carInfo, loadSavedData]);

  const {
    formData,
    setFormData,
    // errors,
    isValid,
    loading,
    updateField,
    setLoading,
    setSubmitError,
  } = useBookingForm(initialData);

  // Persist form data
  useFormPersistence(formData);

  // Modal management
  const { modals, openModal, closeModal } = useModalState();

  // Location picker state
  const [pickOrDrop, setPickOrDrop] = useState<"pick" | "drop">("pick");
  // const [locationPopper, setLocationPopper] = useState<{
  //   from: { open: boolean; anchor: HTMLElement | null };
  //   to: { open: boolean; anchor: HTMLElement | null };
  // }>({
  //   from: { open: false, anchor: null },
  //   to: { open: false, anchor: null },
  // });

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
      // endAddress: formData.endAddress,
      // endCity: formData.endCity,
      // endCountry: formData.endCountry,
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
    console.log("Clicked");
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

  const handleTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTimes({ ...times, [event.target.name]: event.target.value });
  };

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

  const handleMaxPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/,/g, "");
    if (!isNaN(Number(value)) && value !== "") {
      const formattedValue = new Intl.NumberFormat().format(Number(value));
      setMaxPrice(formattedValue);
    } else {
      setMaxPrice("");
    }
  };

  const handleRideSelect = useCallback(
    (ride: string) => {
      updateField("selectedRide", ride);
      closeModal("rideType");
    },
    [updateField, closeModal]
  );
  const handleSearch = useCallback(async () => {
    console.log(formData);
    const errors = [];
    if (!formData.pickupLocation) {
      errors.push("Please enter a valid pickup location");
    }
    if (!formData.dropoffLocation) {
      errors.push("Please enter a valid dropoff location");
    }
    // if (!formData.toLat || !formData.toLon) {
    //   errors.push("Dropoff location must have valid GPS coordinates");
    // }
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
      });
      if (!params.fcode || !/^[A-Z]{3}$/.test(params.fcode)) {
        throw new Error("Invalid pickup location code");
      }
      if (!params.tcode || params.tcode === "undefined,undefined") {
        throw new Error("Invalid destination coordinates");
      }
      const result = await transferService.searchTransfers(params);
      if (!result?.data) {
        console.log(params);
        throw new Error(result.error || "No transfer results found");
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
    <div>
      {searchPickOrDrop && (
        <SearchLoaction
          searchPickOrDrop={searchPickOrDrop}
          closeDialog={() => setSearchPickOrDrop(false)}
          handleFromClick={handleFromClick}
          pickOrDrop={pickOrDrop}
          value={pickOrDrop === "pick" ? selectedFrom : selectedTo}
          setValue={pickOrDrop === "pick" ? setSelectedFrom : setSelectedTo}
        />
      )}
      {openPassengerModal && (
        <Passengers
          openPassengerModal={openPassengerModal}
          closeModal={() => setOpenPassengerModal(false)}
          initialValues={passengerCounts}
          handlePassengersUpdate={(newValues) => setPassengerCounts(newValues)}
        />
      )}
      {rideTypeModal && (
        <RideType
          rideTypeModal={rideTypeModal}
          closeModal={() => setRideTypeModal(false)}
          selectedRide={selectedRide}
          handleSelectRide={handleSelectRide}
        />
      )}
      {selectedRide === "Shared Ride" && (
        <div className="flex items-center gap-3 bg-[#CCD8E880] p-2 rounded-md m-2">
          <Info />
          <p className="text-[#181818] text-xs font-sans">
            Kindly note Shared rides don’t go to private addresses. You’ll be
            dropped at a nearby landmark.
          </p>
        </div>
      )}
      <div className="flex lg:flex-row flex-col justify-normal lg:items-center gap-8">
        <div className="flex flex-col">
          {/* <-------------------------------------top inputs------------------------------------> */}
          <div className="flex lg:flex-row flex-col justify-between lg:items-center gap-4">
            <div className="flex flex-col gap-2 ">
              <label htmlFor="Ride Type">Ride Type</label>
              <TextField
                id="from"
                className="capitalize cursor-pointer"
                variant="outlined"
                size="small"
                value={displayValues.rideType}
                onClick={() => handleRideClick()}
                // error={!!errors.selectedRide}
                // helperText={errors.selectedRide}
                className="cursor-pointer"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MdArrowDropDown />
                    </InputAdornment>
                  ),
                }}
                aria-readonly
                sx={{
                  "& .MuiInputBase-root": {
                    height: "44px",
                    borderRadius: "8px",
                  },
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="from" className="mb-1">
                Pick Up
              </label>
              <TextField
                id="from"
                variant="outlined"
                size="small"
                placeholder="Search Pick up Location"
                value={formData.pickUpLocaDescription}
                onClick={() => handlePickLocationClick("pick")}
                // error={!!errors.pickupLocation}
                // helperText={errors.pickupLocation}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnOutlinedIcon />
                    </InputAdornment>
                  ),
                }}
                // className="md:w-[23vw] lg:w-[23vw] w-full"
                sx={{
                  "& .MuiInputBase-root": {
                    height: "44px",
                    borderRadius: "8px",
                  },
                }}
              />

              <Popper
                id="from-popper"
                open={openFrom}
                anchorEl={FromClick}
                placement="bottom-start"
                className="hidden md:block"
              >
                <ClickAwayListener onClickAway={handleCloseFrom}>
                  <Paper
                    elevation={3}
                    sx={{
                      width: "317px",
                      borderRadius: "6px",
                      backgroundColor: "white",
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                      paddingBottom: "25px",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      className="font-inter text-[#343537] text-lg pl-[24px] pt-[24px] pr-[24px]"
                    >
                      Recent Searches
                    </Typography>

                    {locations.length === 0 ? (
                      <Typography
                        sx={{
                          textAlign: "center",
                          padding: "20px",
                          color: "#777",
                        }}
                        className="font-inter"
                      >
                        No recent searches
                      </Typography>
                    ) : (
                      locations.map((location, index) => (
                        <React.Fragment key={location}>
                          <div className="flex justify-between pl-[24px] pt-[24px] pr-[24px] cursor-pointer">
                            <div
                              className="flex gap-[8px]"
                              onClick={() => handleFromOptionClick(location)}
                            >
                              <div className="h-[28px] w-[28px] rounded-[4px] border border-[#FF6F1E] bg-[#FF6F1E0A] text-center">
                                <RoomOutlinedIcon
                                  className="text-[#FF6F1E]"
                                  sx={{ fontSize: "16px" }}
                                />
                              </div>
                              <p>{location}</p>
                            </div>

                            <CloseOutlinedIcon
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveOption(location);
                              }}
                              className="cursor-pointer"
                              sx={{ color: "gray" }}
                            />
                          </div>

                          {index !== locations.length - 1 && (
                            <Divider sx={{ marginTop: "15px" }} />
                          )}
                        </React.Fragment>
                      ))
                    )}
                  </Paper>
                </ClickAwayListener>
              </Popper>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="to" className="mb-1">
                Drop Off
              </label>
              <TextField
                id="to"
                variant="outlined"
                size="small"
                //  onClick={}
                value={selectedTo}
                onChange={(e) => setSelectedTo(e.target.value)}
                onClick={(e) => {
                  handleToClick(e);
                  setSearchPickOrDrop(true);
                  setPickOrDrop("drop");
                }}
                placeholder="Search Destination"
                value={formData.dropoffLocation}
                onClick={() => handleDropLocationClick("drop")}
                // error={!!errors.dropoffLocation}
                // helperText={errors.dropoffLocation}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnOutlinedIcon />
                    </InputAdornment>
                  ),
                }}
                // className="md:w-[23vw] lg:w-[23vw] w-full"
                sx={{
                  "& .MuiInputBase-root": {
                    height: "44px",
                    borderRadius: "8px",
                  },
                }}
              />

              <Popper
                id="from-popper"
                open={openTo}
                anchorEl={ToClick}
                placement="bottom-start"
              >
                <ClickAwayListener onClickAway={handleCloseTo}>
                  <Paper
                    elevation={3}
                    sx={{
                      width: "317px",
                      borderRadius: "6px",
                      backgroundColor: "white",
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                      paddingBottom: "25px",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      className="font-inter text-[#343537] text-lg pl-[24px] pt-[24px] pr-[24px]"
                    >
                      Recent Searches
                    </Typography>

                    {locations.length === 0 ? (
                      <Typography
                        sx={{
                          textAlign: "center",
                          padding: "20px",
                          color: "#777",
                        }}
                        className="font-inter"
                      >
                        No recent searches
                      </Typography>
                    ) : (
                      locations.map((location, index) => (
                        <React.Fragment key={location}>
                          <div className="flex justify-between pl-[24px] pt-[24px] pr-[24px] cursor-pointer">
                            <div
                              className="flex gap-[8px]"
                              onClick={() => handleToOptionClick(location)}
                            >
                              <div className="h-[28px] w-[28px] rounded-[4px] border border-[#FF6F1E] bg-[#FF6F1E0A] text-center">
                                <RoomOutlinedIcon
                                  className="text-[#FF6F1E]"
                                  sx={{ fontSize: "16px" }}
                                />
                              </div>
                              <p>{location}</p>
                            </div>

                            <CloseOutlinedIcon
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveOption(location);
                              }}
                              className="cursor-pointer"
                              sx={{ color: "gray" }}
                            />
                          </div>

                          {index !== locations.length - 1 && (
                            <Divider sx={{ marginTop: "15px" }} />
                          )}
                        </React.Fragment>
                      ))
                    )}
                  </Paper>
                </ClickAwayListener>
              </Popper>
            </div>

            {/* Pick Up Date */}
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="pickup-date">Pick Up Date</label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                 value={formData.pickupDate ? dayjs(formData.pickupDate) : null}
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

          {/* <-----------------Second inputs ------------------------> */}
          <div className="flex lg:flex-row flex-col justify-between items-center w-full gap-4 mt-5">
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="pick-up-time" className="mb-1">
                Pick Up Time
              </label>
              <TextField
                id="pick-up-time"
                name="pickUpTime"
                type="time"
                variant="outlined"
                size="small"
                value={times.pickUpTime}
                onChange={handleTimeChange}
                placeholder="00 : 00"
                className=" w-full"
                sx={{
                  "& .MuiInputBase-root": {
                    height: "44px",
                    borderRadius: "8px",
                  },
                }}
              />
            </div>

            <div className="flex flex-col gap-2 w-full">
              <label
                htmlFor="passenger-count"
                className="mb-1 font-medium text-sm text-gray-700"
              >
                Passengers
              </label>

              <TextField
                id="passenger-count"
                name="passengerCount"
                type="text"
                variant="outlined"
                size="small"
                value={formatPassengerCount(passengerCounts)}
                onClick={() => setOpenPassengerModal(true)}
                placeholder="Select Passengers"
                InputProps={{
                  readOnly: true, // Prevent manual edits
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
              <label htmlFor="departure-date" className="mb-1">
                Price Range
              </label>
              <TextField
                id="price"
                variant="outlined"
                size="small"
                placeholder="Enter Minimum - Maximum Price"
                value={priceRange}
                // onClick={() => setOpenNoModal(true)}
                onClick={handleOpen}
                className="w-full"
                sx={{
                  "& .MuiInputBase-root": {
                    height: "44px",
                    borderRadius: "8px",
                  },
                  "& .MuiOutlinedInput-input": {
                    padding: "8px 10px",
                    cursor: "pointer",
                  },
                }}
              />

              <PriceRange
                openClick={openClick}
                handleCloseClick={handleCloseClick}
                handlePriceChange={handlePriceChange}
                openNoModal={openNoModal}
                handleCloseNoModal={handleCloseNoModal}
                handleMaxPriceChange={handleMaxPriceChange}
                miniprice={miniprice}
                maxprice={maxprice}
                handleSubmitOffer={handleSubmitOffer}
              />
            </div>
          </div>
        </div>

        <div>
          <button
            className="bg-[#023E8A]  lg:w-[120px]  w-full text-center text-white font-inter text-base rounded-md py-3 lg:mt-14 cursor-pointer disabled:bg-gray-400 disabled:cursor-auto"
            onClick={handleSearch}
            disabled={!formFilled}
          >
            Search Taxi
          </button>
        </div>
      </div>

      {/* Modals */}

      {modals.searchPickLocation && (
        <SearchPickUpLocation
          closeDialog={() => closeModal("searchPickLocation")}
          value={formData.pickUpLocaDescription}
          setValue={handleLocationSelect}
          setExtraFields={(fields) => {
            updateField("endAddress", fields.endAddress);
            updateField("endCity", fields.endCity);
            updateField("endCountry", fields.endCountry);
            updateField("fromLat", fields.fromLat);
            updateField("fromLon", fields.fromLon);
            updateField("toLat", fields.toLat);
            updateField("toLon", fields.toLon);
          }}
          ChangeValue={(query) =>
            setFormData((prev) => ({
              ...prev,
              pickUpLocaDescription: query,
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
          // open={modals.rideType}
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
    </div>
  );
};

export default Page;
