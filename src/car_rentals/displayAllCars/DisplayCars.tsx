import React, { useState, ChangeEvent } from "react";
import {
  TextField,
  InputAdornment,
  Popper,
  ClickAwayListener,
  Paper,
} from "@mui/material";
import { DateRange, RangeKeyDict } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { addDays, format } from "date-fns";
import { useLocation, useNavigate } from "react-router-dom";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
// import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";
// import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import { MdArrowDropDown } from "react-icons/md";
import Passengers from "../carsFirstScreen/modals/Passengers";
import PriceRange from "../carsFirstScreen/modals/PriceRange";
import RideType from "../carsFirstScreen/modals/RideType";
import CarList from "./CarList";
import Navbar from "../../pages/homePage/Navbar";
import SearchLocation from "../carsFirstScreen/modals/SearchLoaction";
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

import { useMediaQuery } from "react-responsive";
import EmptyState from "./EmptyState";

interface DateRangeType {
  startDate: Date;
  endDate: Date;
  key: string;
}

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
  const [form, setForm] = useState(isMobile ? false : true);
  const {
    from: stateFrom = "",
    to: stateTo = "",
    departureDate: stateDepartureDate = "",
    times: stateTimes = { pickUpTime: "", dropOffTime: "" },
    priceRange: statePriceRange = { miniprice: 0, maxprice: 0 },
    selectedRide: stateRide = "",
    passengerCounts: statePassengers = { adults: 0, children: 0, infant: 0 },
  } = (state || {}) as LocationState;

  const [from, setFrom] = useState(stateFrom);
  const [to, setTo] = useState(stateTo);
  const [departureDate, setDepartureDate] = useState(stateDepartureDate);
  const [times, setTimes] = useState(stateTimes);
  const [priceRange, setPriceRange] = useState(statePriceRange);
  const [selectedRide, setSelectedRide] = useState(stateRide);
  const [passengerCounts, setPassengerCounts] = useState(statePassengers);

  const [openPassengerModal, setOpenPassengerModal] = useState(false);
  const [rideTypeModal, setRideTypeModal] = useState(false);
  const [openClick, setOpenClick] = useState(false);
  const [openNoModal, setOpenNoModal] = useState(false);

  const [searchPickOrDrop, setSearchPickOrDrop] = useState(false);
  const [pickOrDrop, setPickOrDrop] = useState<"pick" | "drop">("pick");

  const [locations, setLocations] = useState([
    "Ibadan, Oyo",
    "Abuja",
    "Port Harcourt",
  ]);

  const handleRemoveOption = (locationToRemove: string) => {
    setLocations(locations.filter((location) => location !== locationToRemove));
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dateRange, setDateRange] = useState<DateRangeType[]>([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 0),
      key: "selection",
    },
  ]);

  const open = Boolean(anchorEl);
  const id = open ? "date-range-popper" : undefined;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectDate = () => {
    const start = dateRange[0].startDate;
    const end = dateRange[0].endDate;
    const display =
      formatDate(start) === formatDate(end)
        ? formatDate(start)
        : `${formatDate(start)} - ${formatDate(end)}`;
    setDepartureDate(display);
    setAnchorEl(null);
  };

  const handleTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTimes({ ...times, [e.target.name]: e.target.value });
  };

  const handleSubmitOffer = () => {
    if (priceRange.miniprice < 6000 || priceRange.maxprice < 6000) {
      setOpenNoModal(true);
    } else {
      setOpenClick(false);
    }
  };

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
                  value={from}
                  onChange={(e) => {
                    setFrom(e.target.value);
                    setSearchPickOrDrop(true);
                    setPickOrDrop("pick");
                  }}
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

              {/* To */}
              <div className="flex flex-col gap-2 w-full">
                <label>Drop Off</label>
                <TextField
                  variant="outlined"
                  size="small"
                  className="w-full lg:w-auto"
                  placeholder="Enter Drop Off Location"
                  value={to}
                  onChange={(e) => {
                    setTo(e.target.value);
                    setSearchPickOrDrop(true);
                    setPickOrDrop("drop");
                  }}
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
                <label>Pick Up Date</label>
                <TextField
                  variant="outlined"
                  size="small"
                  className="w-full lg:w-auto"
                  value={departureDate}
                  onClick={handleClick}
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
                    },
                    "& .MuiOutlinedInput-input": {
                      cursor: "pointer",
                    },
                  }}
                />
                <Popper
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  placement="bottom-start"
                >
                  <ClickAwayListener onClickAway={handleClose}>
                    <Paper elevation={3} sx={{ p: 2, maxWidth: 850 }}>
                      <DateRange
                        editableDateInputs
                        onChange={(item: RangeKeyDict) => {
                          setDateRange([
                            {
                              startDate: item.selection.startDate ?? new Date(),
                              endDate: item.selection.endDate ?? new Date(),
                              key: item.selection.key ?? "selection",
                            },
                          ]);
                        }}
                        moveRangeOnFirstSelection={false}
                        ranges={dateRange}
                        rangeColors={["#FF6F1E"]}
                        months={2}
                        direction="horizontal"
                        showDateDisplay={false}
                      />
                      <button
                        className="mt-4 w-full h-[44px] bg-[#023E8A] text-white rounded-md"
                        onClick={handleSelectDate}
                      >
                        Select Date
                      </button>
                    </Paper>
                  </ClickAwayListener>
                </Popper>
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
      {rideTypeModal && (
        <RideType
          rideTypeModal={rideTypeModal}
          closeModal={() => setRideTypeModal(false)}
          selectedRide={selectedRide}
          handleSelectRide={setSelectedRide}
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
        />
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

export default DisplayCars;
