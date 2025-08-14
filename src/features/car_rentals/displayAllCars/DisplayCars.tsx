import React, { useState, ChangeEvent, useEffect } from "react";
import {
  TextField,
  InputAdornment,
  Popper,
  ClickAwayListener,
  Paper,
  Box,
  Typography,
} from "@mui/material";
import { DateRange, RangeKeyDict } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { addDays, format } from "date-fns";
import { useLocation, useNavigate } from "react-router-dom";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import { MdArrowDropDown } from "react-icons/md";
import { useMediaQuery } from "react-responsive";

import Passengers from "../carsFirstScreen/modals/Passengers";
import PriceRange from "../carsFirstScreen/modals/PriceRange";
import RideType from "../carsFirstScreen/modals/RideType";
import CarList from "./CarList";
import Navbar from "../../../pages/homePage/Navbar";
import SearchLocation from "../carsFirstScreen/modals/SearchLoaction";
import EmptyState from "./EmptyState";

interface DateRangeType {
  startDate: Date;
  endDate: Date;
  key: string;
}

interface Times {
  pickUpTime: string;
  dropOffTime: string;
}

interface PriceRangeType {
  miniprice: number; 
  maxprice: number; 
}

interface PassengerCounts {
  adults: number;
  children: number;
  infant: number;
}

interface LocationState {
  from?: string;
  to?: string;
  departureDate?: string;
  times?: {
    pickUpTime: string;
    dropOffTime?: string;
  };
  priceRange?: {
    minPrice: number; 
    maxPrice: number; 
  };
  selectedRide?: string;
  passengerCounts?: PassengerCounts;
}

interface DepartureInfo {
  from: string;
  to: string;
  departureDate: string;
  times: Times; 
  priceRange: PriceRangeType;
  selectedRide: string;
  passengerCounts: PassengerCounts;
}

// Utility functions
const formatPassengerCount = (counts: PassengerCounts): string => {
  const { adults, children, infant } = counts;
  const parts: string[] = [];

  if (adults > 0) parts.push(`${adults} adult${adults > 1 ? "s" : ""}`);
  if (children > 0) parts.push(`${children} child${children > 1 ? "ren" : ""}`);
  if (infant > 0) parts.push(`${infant} infant${infant > 1 ? "s" : ""}`);

  return parts.length ? parts.join(", ") : "Select Passengers";
};

const formatDate = (date: Date): string => format(date, "dd MMM yyyy");

const formatPriceRange = (priceRange: PriceRangeType): string => {
  const { miniprice, maxprice } = priceRange; 
  if (miniprice === 0 && maxprice === 0) {
    return "Select Price Range";
  }
  return `₦${new Intl.NumberFormat().format(
    miniprice
  )} - ₦${new Intl.NumberFormat().format(maxprice)}`;
};

const DisplayCars: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const {
    from: stateFrom = "",
    to: stateTo = "",
    departureDate: stateDepartureDate = "",
    times: stateTimes = { pickUpTime: "", dropOffTime: "" },
    priceRange: statePriceRange = { minPrice: 0, maxPrice: 0 },
    selectedRide: stateRide = "",
    passengerCounts: statePassengers = { adults: 0, children: 0, infant: 0 },
  } = (state || {}) as LocationState;

  // Form visibility state
  const [form, setForm] = useState<boolean>(isMobile ? false : true);

  // Form data states
  const [from, setFrom] = useState<string>(stateFrom);
  const [to, setTo] = useState<string>(stateTo);
  const [departureDate, setDepartureDate] =
    useState<string>(stateDepartureDate);
  const [times, setTimes] = useState<Times>({
    pickUpTime: stateTimes.pickUpTime || "",
    dropOffTime: stateTimes.dropOffTime || "",
  });
  const [priceRange, setPriceRange] = useState<PriceRangeType>({
    miniprice: statePriceRange.minPrice || 0,
    maxprice: statePriceRange.maxPrice || 0,
  });
  const [selectedRide, setSelectedRide] = useState<string>(stateRide);
  const [passengerCounts, setPassengerCounts] =
    useState<PassengerCounts>(statePassengers);

  // Modal states
  const [openPassengerModal, setOpenPassengerModal] = useState<boolean>(false);
  const [rideTypeModal, setRideTypeModal] = useState<boolean>(false);
  const [openClick, setOpenClick] = useState<boolean>(false);
  const [openNoModal, setOpenNoModal] = useState<boolean>(false);
  const [searchPickOrDrop, setSearchPickOrDrop] = useState<boolean>(false);
  const [pickOrDrop, setPickOrDrop] = useState<"pick" | "drop">("pick");

  useEffect(() => {
    const loadFormData = () => {
      if (state && (stateFrom || stateTo || stateDepartureDate)) {
        setFrom(stateFrom);
        setTo(stateTo);
        setDepartureDate(stateDepartureDate);
        setTimes({
          pickUpTime: stateTimes.pickUpTime || "",
          dropOffTime: stateTimes.dropOffTime || "",
        });
        setPriceRange({
          miniprice: statePriceRange.minPrice || 0,
          maxprice: statePriceRange.maxPrice || 0,
        });
        setSelectedRide(stateRide);
        setPassengerCounts(statePassengers);

        const formData = {
          from: stateFrom,
          to: stateTo,
          departureDate: stateDepartureDate,
          times: stateTimes,
          priceRange: statePriceRange,
          selectedRide: stateRide,
          passengerCounts: statePassengers,
        };
        localStorage.setItem("displayCarsForm", JSON.stringify(formData));
      } else {
        const savedForm = localStorage.getItem("displayCarsForm");
        if (savedForm) {
          try {
            const parsedForm = JSON.parse(savedForm);
            setFrom(parsedForm.from || "");
            setTo(parsedForm.to || "");
            setDepartureDate(parsedForm.departureDate || "");
            setTimes({
              pickUpTime: parsedForm.times?.pickUpTime || "",
              dropOffTime: parsedForm.times?.dropOffTime || "",
            });
            setPriceRange({
              miniprice: parsedForm.priceRange?.minPrice || 0,
              maxprice: parsedForm.priceRange?.maxPrice || 0,
            });
            setSelectedRide(parsedForm.selectedRide || "");
            setPassengerCounts(
              parsedForm.passengerCounts || {
                adults: 0,
                children: 0,
                infant: 0,
              }
            );
          } catch (error) {
            console.error("Error parsing saved display cars form data:", error);
          }
        }
      }
    };

    loadFormData();
  }, []);

  useEffect(() => {
    if (from || to || selectedRide || departureDate) {
      const formData = {
        from,
        to,
        departureDate,
        times,
        priceRange: {
          minPrice: priceRange.miniprice,
          maxPrice: priceRange.maxprice,
        },
        selectedRide,
        passengerCounts,
      };
      localStorage.setItem("displayCarsForm", JSON.stringify(formData));
    }
  }, [
    from,
    to,
    departureDate,
    times,
    priceRange,
    selectedRide,
    passengerCounts,
  ]);

  // Date picker states
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [dateRange, setDateRange] = useState<DateRangeType[]>([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 0),
      key: "selection",
    },
  ]);

  const open = Boolean(anchorEl);
  const id = open ? "date-range-popper" : undefined;

  // Event handlers
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectDate = () => {
    if (dateRange[0].startDate) {
      const start = dateRange[0].startDate;
      const end = dateRange[0].endDate;
      const display =
        formatDate(start) === formatDate(end)
          ? formatDate(start)
          : `${formatDate(start)} - ${formatDate(end)}`;
      setDepartureDate(display);
      setAnchorEl(null);
    }
  };

  const handleTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTimes({ ...times, [e.target.name]: e.target.value });
  };

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const numValue = Number(value) || 0;
    setPriceRange((prev) => ({ ...prev, miniprice: numValue }));
  };

  const handleMaxPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const numValue = Number(value) || 0;
    setPriceRange((prev) => ({ ...prev, maxprice: numValue }));
  };

  const handleSubmitOffer = () => {
    if (priceRange.miniprice < 6000 || priceRange.maxprice < 6000) {
      setOpenNoModal(true);
    } else {
      setOpenClick(false);
    }
  };

  const handleSelectRide = (ride: string) => {
    setSelectedRide(ride);
  };

  const handlePassengersUpdate = (newCounts: PassengerCounts) => {
    setPassengerCounts(newCounts);
  };

  const handleUpdateSearch = () => {
    if (isMobile) {
      setForm(false);
    } else {
      const navigationState = {
        from,
        to,
        departureDate,
        times,
        priceRange: {
          minPrice: priceRange.miniprice,
          maxPrice: priceRange.maxprice,
        },
        selectedRide,
        passengerCounts,
      };
      localStorage.setItem("displayCarsForm", JSON.stringify(navigationState));
      navigate("/cars-searchResults", {
        state: navigationState,
      });
    }
  };

  // Form validation
  const isFormValid = !!(
    from &&
    to &&
    selectedRide &&
    times.pickUpTime &&
    departureDate &&
    priceRange.maxprice > 0 &&
    priceRange.miniprice > 0 &&
    (passengerCounts.adults > 0 ||
      passengerCounts.children > 0 ||
      passengerCounts.infant > 0)
  );

  return (
    <div className="">
      <Navbar />

      {/* Search Location Modal */}
      {searchPickOrDrop && (
        <SearchLocation
          searchPickOrDrop={searchPickOrDrop}
          closeDialog={() => setSearchPickOrDrop(false)}
          handleFromClick={() => {}}
          pickOrDrop={pickOrDrop}
          value={pickOrDrop === "pick" ? from : to}
          setValue={pickOrDrop === "pick" ? setFrom : setTo}
        />
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
                  value={selectedRide || "Select Ride Type"}
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
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  onClick={() => {
                    setSearchPickOrDrop(true);
                    setPickOrDrop("pick");
                  }}
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
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  onClick={() => {
                    setSearchPickOrDrop(true);
                    setPickOrDrop("drop");
                  }}
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
                <TextField
                  variant="outlined"
                  size="small"
                  className="w-full lg:w-auto"
                  value={departureDate || "Select Date"}
                  onClick={handleClick}
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
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  placement="bottom-start"
                  modifiers={[
                    {
                      name: "offset",
                      options: {
                        offset: [0, 10],
                      },
                    },
                  ]}
                >
                  <ClickAwayListener onClickAway={handleClose}>
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
                          onChange={(item: RangeKeyDict) => {
                            setDateRange([
                              {
                                startDate:
                                  item.selection.startDate ?? new Date(),
                                endDate: item.selection.endDate ?? new Date(),
                                key: item.selection.key ?? "selection",
                              },
                            ]);
                          }}
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

              {/* Passengers */}
              <div className="flex flex-col gap-2 w-full">
                <label className="font-medium text-sm text-gray-700">
                  Passengers
                </label>
                <TextField
                  size="small"
                  className="w-full lg:w-auto"
                  value={formatPassengerCount(passengerCounts)}
                  onClick={() => setOpenPassengerModal(true)}
                  placeholder="Select Passengers"
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

              {/* Price Range */}
              <div className="flex flex-col gap-2 w-full">
                <label className="font-medium text-sm text-gray-700">
                  Price Range
                </label>
                <TextField
                  size="small"
                  className="w-full lg:w-auto"
                  value={formatPriceRange(priceRange)}
                  onClick={() => setOpenClick(true)}
                  placeholder="Select Price Range"
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
              </div>
            </div>
          </div>

          {/* Update Button */}
          <button
            className="bg-[#023E8A] lg:w-[120px] w-full text-center text-white font-inter text-base rounded-md py-3 lg:mt-14 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={handleUpdateSearch}
            disabled={!isFormValid}
          >
            Update
          </button>
        </div>
      )}

      {/* Modals */}
      {rideTypeModal && (
        <RideType
          rideTypeModal={rideTypeModal}
          closeModal={() => setRideTypeModal(false)}
          selectedRide={selectedRide}
          handleSelectRide={handleSelectRide}
        />
      )}

      {openPassengerModal && (
        <Passengers
          openPassengerModal={openPassengerModal}
          closeModal={() => setOpenPassengerModal(false)}
          initialValues={passengerCounts}
          handlePassengersUpdate={handlePassengersUpdate}
        />
      )}

      {/* Price Range Modal */}
      <PriceRange
        openClick={openClick}
        handleCloseClick={() => setOpenClick(false)}
        handlePriceChange={handlePriceChange}
        handleMaxPriceChange={handleMaxPriceChange}
        openNoModal={openNoModal}
        handleCloseNoModal={() => setOpenNoModal(false)}
        miniprice={String(priceRange.miniprice)}
        maxprice={String(priceRange.maxprice)}
        handleSubmitOffer={handleSubmitOffer}
      />

      {/* Car Results or Empty State */}
      {isFormValid ? (
        <CarList
          departureInfo={{
            from,
            to,
            departureDate,
            times: {
              pickUpTime: times.pickUpTime,
              dropOffTime: times.dropOffTime || "", // Ensure dropOffTime is never undefined
            },
            priceRange,
            selectedRide,
            passengerCounts,
          }}
          OpenForm={() => setForm(true)}
        />
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

export default DisplayCars;
