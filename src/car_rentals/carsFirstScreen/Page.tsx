import React, { useState, useEffect, ChangeEvent } from "react";
import {
  TextField,
  InputAdornment,
  Popper,
  ClickAwayListener,
  Paper,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import { DateRange, RangeKeyDict } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { addDays, format } from "date-fns";
import { useNavigate } from "react-router-dom";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";

interface DateRangeType {
  startDate: Date;
  endDate: Date;
  key: string;
}

import SearchLoaction from "./modals/SearchLoaction";
import Passengers from "./modals/Passengers";
import PriceRange from "./modals/PriceRange";
import { MdArrowDropDown } from "react-icons/md";
import RideType from "./modals/RideType";
import { Info } from "lucide-react";
const Page = () => {
  const navigate = useNavigate();

  const [, setSelectedValue] = useState<string>(() => {
    return localStorage.getItem("tripType") || "round-trip";
  });
  const [FromClick, setFromClick] = useState<HTMLElement | null>(null);
  const [ToClick, setToClick] = useState<HTMLElement | null>(null);

  const [selectedFrom, setSelectedFrom] = useState("");
  const [selectedTo, setSelectedTo] = useState("");

  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedRide, setSelectedRide] = useState("");
  // const [selected]

  const [maxprice, setMaxPrice] = useState("");
  const [miniprice, setMiniPrice] = useState("");
  const [priceRange, setPriceRange] = useState("");
  // const [rideOptions, setRideOptions]

  const [searchPickOrDrop, setSearchPickOrDrop] = useState(false);
  const [openPassengerModal, setOpenPassengerModal] = useState(false);
  const [rideTypeModal, setRideTypeModal] = useState(false);

  const [openClick, setOpenClick] = useState<boolean>(false);
  const [openNoModal, setOpenNoModal] = useState(false);

  const [times, setTimes] = useState({
    pickUpTime: "",
    dropOffTime: "",
  });
  const [passengerCounts, setPassengerCounts] = useState({
    adults: 0,
    children: 0,
    infant: 0,
  });
  useEffect(() => {
    const savedValue = localStorage.getItem("tripType");
    if (savedValue) {
      setSelectedValue(savedValue);
    }
  }, []);

  const [dateRange, setDateRange] = useState<DateRangeType[]>([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 0),
      key: "selection",
    },
  ]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [pickOrDrop, setPickOrDrop] = useState<"pick" | "drop">("pick");
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleToClick = (event: React.MouseEvent<HTMLElement>) => {
    setOpenTo((prev) => !prev);
    setToClick(event.currentTarget);
  };

  const handleCloseTo = () => {
    setOpenTo(false);
  };

  const handleFromClick = (event: React.MouseEvent<HTMLElement>) => {
    setOpenFrom((prev) => !prev);
    setFromClick(event.currentTarget);
  };

  const handleFromOptionClick = (option: string) => {
    setSelectedFrom(option);
    setOpenFrom(false);
  };

  const handleToOptionClick = (option: string) => {
    setSelectedTo(option);
    setOpenTo(false);
  };

  const handleCloseFrom = () => {
    setOpenFrom(false);
  };

  const open = Boolean(anchorEl);
  const id = open ? "date-range-popper" : undefined;

  const [locations, setLocations] = useState([
    "Ibadan, Oyo",
    "Abuja",
    "Port Harcourt",
  ]);

  const handleRemoveOption = (locationToRemove: string) => {
    setLocations(locations.filter((location) => location !== locationToRemove));
  };
  const handleSelectRide = (value: string) => {
    setSelectedRide(value);
  };

  const formatDate = (date: Date) => format(date, "dd MMM yyyy");

  const [, setOpens] = useState(false);

  const handleSelectDate = () => {
    if (dateRange[0].startDate) {
      const startDateFormatted = formatDate(dateRange[0].startDate);
      const endDateFormatted = dateRange[0].endDate
        ? formatDate(dateRange[0].endDate)
        : startDateFormatted;

      const displayText =
        startDateFormatted === endDateFormatted
          ? startDateFormatted
          : `${startDateFormatted} - ${endDateFormatted}`;

      setSelectedDate(displayText);
      setOpens(false);
      handleClose();
    }
  };

  const handleTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTimes({ ...times, [event.target.name]: event.target.value });
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/,/g, "");
    if (!isNaN(Number(value)) && value !== "") {
      const formattedValue = new Intl.NumberFormat().format(Number(value));
      setMiniPrice(formattedValue);
    } else {
      setMiniPrice("");
    }
  };

  const handleMaxPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/,/g, "");
    if (!isNaN(Number(value)) && value !== "") {
      const formattedValue = new Intl.NumberFormat().format(Number(value));
      setMaxPrice(formattedValue);
    } else {
      setMaxPrice("");
    }
  };

  const handleCloseNoModal = () => {
    setOpenNoModal(false);
  };
  const handleSubmitOffer = () => {
    const numericMinPrice = parseInt(miniprice.replace(/,/g, ""), 10) || 0;
    const numericMaxPrice = parseInt(maxprice.replace(/,/g, ""), 10) || 0;

    if (numericMinPrice < 6000 || numericMaxPrice < 6000) {
      setOpenNoModal(true);
    } else {
      const formattedPriceRange = `${new Intl.NumberFormat().format(
        numericMinPrice
      )} - ${new Intl.NumberFormat().format(numericMaxPrice)}`;
      setPriceRange(formattedPriceRange);
      handleCloseClick();
    }
  };

  const handleSearch = () => {
    const priceRange = `${miniprice} - ${maxprice}`;
    const numericMinPrice = parseInt(miniprice.replace(/,/g, ""), 10) || 0;
    const numericMaxPrice = parseInt(maxprice.replace(/,/g, ""), 10) || 0;

    const formattedPriceRange = {
      miniprice: numericMinPrice,
      maxprice: numericMaxPrice,
    };
    navigate("/cars-searchResults", {
      state: {
        from: selectedFrom,
        to: selectedTo,
        departureDate: selectedDate,
        times,
        priceRange: formattedPriceRange,
        selectedRide,
        passengerCounts,
      },
    });
  };
  const formData=  {
        from: selectedFrom,
        to: selectedTo,
        departureDate: selectedDate,
        times,
        priceRange,
        selectedRide,
        passengerCounts,
      }
useEffect(()=> {
 localStorage.setItem( 'form', JSON.stringify(formData))
})
  const handleOpen = () => {
    // setSelectedCarId(car.id);
    setOpenClick(true);
  };

  const handleCloseClick = () => {
    setOpenClick(false);
  };

  const formatPassengerCount = (counts: {
    adults: number;
    children: number;
    infant: number;
  }) => {
    const { adults, children, infant } = counts;
    const parts = [];

    if (adults > 0) parts.push(`${adults} adult${adults > 1 ? "s" : ""}`);
    if (children > 0)
      parts.push(`${children} child${children > 1 ? "ren" : ""}`);
    if (infant > 0) parts.push(`${infant} infant${infant > 1 ? "s" : ""}`);

    return parts.length > 0 ? parts.join(", ") : "Select Passengers";
  };

  const formFilled =
    (!!selectedFrom &&
      !!selectedTo &&
      !!selectedDate &&
      !!times.pickUpTime &&
      !!priceRange &&
      !!selectedRide &&
      passengerCounts.adults > 0) ||
    passengerCounts.children > 0 ||
    passengerCounts.infant > 0;

  console.log(formFilled);
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
                value={selectedRide}
                onChange={(e) => {
                  setSelectedRide(e.target.value);
                }}
                onClick={() => setRideTypeModal(true)}
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
                value={selectedFrom}
                onChange={(e) => {
                  setSelectedFrom(e.target.value);
                }}
                onClick={(e) => {
                  handleFromClick(e);
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

            <div className="flex flex-col gap-2">
              <label htmlFor="departure-date" className="mb-1">
                Pick Up Date
              </label>
              <TextField
                id="departure-date"
                variant="outlined"
                size="small"
                placeholder="Select Date"
                value={selectedDate}
                onClick={handleClick}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarMonthOutlinedIcon />
                    </InputAdornment>
                  ),
                }}
                // className="md:w-[23vw] lg:w-[23vw] w-full"
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
                        xs: "90vw", // Small screens
                        sm: "500px", // Tablets
                        md: "650px", // Medium screens
                        lg: "850px", // Large screens
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
                              startDate: item.selection.startDate ?? new Date(),
                              endDate: item.selection.endDate ?? new Date(),
                              key: item.selection.key ?? "selection",
                            },
                          ]);
                        }}
                        moveRangeOnFirstSelection={false}
                        ranges={dateRange}
                        rangeColors={["#FF6F1E"]}
                        months={window.innerWidth < 768 ? 1 : 2} // 1 month on small screens
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
    </div>
  );
};

export default Page;
