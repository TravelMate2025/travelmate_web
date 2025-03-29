


import React, { useState, useEffect, ChangeEvent, forwardRef , Ref, ReactElement } from "react";
import { Box, TextField, InputAdornment, Popper, ClickAwayListener, Paper, Typography, Divider, MenuItem, Select, Dialog, DialogContent, IconButton, Slide } from '@mui/material';
import { DateRange, RangeKeyDict } from 'react-date-range';
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { addDays, format } from "date-fns";
import { useNavigate } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import { useMediaQuery } from "react-responsive";
import offerNot from "../../../assets/offerNot.svg"


import { SelectChangeEvent } from "@mui/material";

interface DateRangeType {
  startDate: Date;
  endDate: Date;
  key: string;
}

import { TransitionProps } from "@mui/material/transitions";
// import { m } from "framer-motion";

const Transition = forwardRef<unknown, TransitionProps & { children: ReactElement }>(
  function Transition(props, ref) {
    return <Slide direction="up" ref={ref as Ref<unknown>} {...props} />;
  }
);


const Page = () => {
    const isMobile = useMediaQuery({ maxWidth: 768 });
  

      const [, setSelectedValue] = useState<string>(() => {
        return localStorage.getItem("tripType") || "round-trip";
      });

      const [dateRange, setDateRange] = useState<DateRangeType[]>([
        {
          startDate: new Date(),
          endDate: addDays(new Date(), 0),
          key: "selection",
        },
      ]);
      
      const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    
    
        useEffect(() => {
        const savedValue = localStorage.getItem("tripType");
        if (savedValue) {
          setSelectedValue(savedValue);
        }
      }, []);
    
      const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
      };
    
     const handleClose = () => {
        setAnchorEl(null);
      };
    

        const [FromClick, setFromClick] = useState<HTMLElement | null>(null);
        const [ToClick, setToClick] = useState<HTMLElement | null>(null);

        
            const [selectedFrom, setSelectedFrom] = useState("");
            const [selectedTo, setSelectedTo] = useState("");
            const [openFrom, setOpenFrom] = useState(false);
            const [openTo, setOpenTo] = useState(false);
                
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
      
    
    const [locations, setLocations] = useState(["Ibadan, Oyo", "Abuja", "Port Harcourt"]);
    
    const handleRemoveOption = (locationToRemove: string) => {
      setLocations(locations.filter(location => location !== locationToRemove));
    };
    
      const [selectedDate, setSelectedDate] = useState<string>("");
      
    
    // const handleSelectDate = () => {
    //   const formattedDate = selectedValue === "one-way"
    //     ? format(dateRange[0].startDate, "dd MMM yyyy")
    //     : `${format(dateRange[0].startDate, "dd MMM yyyy")} - ${format(dateRange[0].endDate, "dd MMM yyyy")}`;
    
    //   setSelectedDate(formattedDate);
    //   handleClose(); 
    // };

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
   
    
    
        const navigate = useNavigate();

              const [timePeriod, setTimePeriod] = useState<string>("AM");
              const [timePeriodPM, setTimePeriodPM] = useState<string>("PM");
              

            const handleChange = (event: SelectChangeEvent) => {
            setTimePeriod(event.target.value);
             };

            const handleTimePeriodChangePM = (event: SelectChangeEvent<string>) => {
                setTimePeriodPM(event.target.value);
            };

          const [times, setTimes] = useState({
            pickUpTime: "",
            dropOffTime: "",
        });

        const handleTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
            setTimes({ ...times, [event.target.name]: event.target.value });
        };

            
        const [miniprice, setMiniPrice] = useState("");
    
    
    const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.replace(/,/g, "");
        if (!isNaN(Number(value)) && value !== "") {
            const formattedValue = new Intl.NumberFormat().format(Number(value));
            setMiniPrice(formattedValue);
        } else {
            setMiniPrice("");
        }
    };
    
    
        const [maxprice, setMaxPrice] = useState("");
     
    
    
    const handleMaxPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.replace(/,/g, "");
        if (!isNaN(Number(value)) && value !== "") {
            const formattedValue = new Intl.NumberFormat().format(Number(value));
            setMaxPrice(formattedValue);
        } else {
            setMaxPrice("");
        }
    };



     const [openNoModal, setOpenNoModal] = useState(false);
 const handleCloseNoModal = () => {
  setOpenNoModal(false);
};


const [priceRange, setPriceRange] = useState("");

const handleSubmitOffer = () => {
  const numericMinPrice = parseInt(miniprice.replace(/,/g, ""), 10) || 0;
  const numericMaxPrice = parseInt(maxprice.replace(/,/g, ""), 10) || 0;

  if (numericMinPrice < 6000 || numericMaxPrice < 6000) {
     setOpenNoModal(true);
  } else {
    const formattedPriceRange = `${new Intl.NumberFormat().format(numericMinPrice)} - ${new Intl.NumberFormat().format(numericMaxPrice)}`;
    setPriceRange(formattedPriceRange);
    handleCloseClick();
  }
};





          const handleSearch = () => {
             const priceRange = `${miniprice} - ${maxprice}`;
            navigate("/display-cars", {
            state: { from: selectedFrom, to: selectedTo, departureDate: selectedDate, timePeriod, times, priceRange },
            });
        };

          const [openClick, setOpenClick] = useState<boolean>(false);

         const handleOpen = () => {
      
      // setSelectedCarId(car.id);
            setOpenClick(true);
        };

            
      const handleCloseClick = () => {
      setOpenClick(false);
      // setSelectedCarId(null);
    };



     const [userSelectedDate, setUserSelectedDate] = useState(false);
     
const [showLocations, setShowLocations] = useState(false);
const handleTextFieldClick = () => {
  setShowLocations(true);
};

const [showLocationsOff, setShowLocationsOff] = useState(false);
const handleTextFieldClickOff = () => {
  setShowLocationsOff(true);
};




  return (
    <div> 

      {isMobile ? (

          <div className="flex flex-col md:flex-row md:justify-between md:gap-[24px] lg:gap-[24px] md:flex-wrap lg:flex-wrap lg:flex-row lg:justify-between">

        <div>
        <div className="flex flex-col md:flex-row md:justify-between md:flex-wrap lg:flex-wrap lg:flex-row lg:justify-between gap-[24px]">
            
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor="from" className="mb-1">Pick Up</label>
              <TextField
                id="from"
                variant="outlined"
                size="small"
                placeholder="Search Location"
                value={selectedFrom}
                onChange={(e) => setSelectedFrom(e.target.value)}
                onClick={handleFromClick}
                InputProps={{
                   readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnIcon />
                    </InputAdornment>
                  ),
                }}
                className="md:w-[23vw] lg:w-[23vw] w-full"
                sx={{
                  "& .MuiInputBase-root": { height: "44px", borderRadius:"8px", },
                }}
              />
    

              <Dialog
                open={openFrom} 
                TransitionComponent={Transition}
                keepMounted
                fullScreen
                // onClick={handleCloseFrom}
                sx={{
                  "& .MuiBackdrop-root": {
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                  },
                  "& .MuiPaper-root": {
                    backgroundColor: "white",
                    display: "flex",
                    flexDirection: "column",
                    animation: "slideUp 0.3s ease-out forwards",
                    width:"100%",
                    height:"95vh",
                    position:"fixed",
                    borderRadius: "20px 20px 0 0",
                    bottom:"0px",
                    marginBottom:"0px",
                    marginTop:"0px",
                    paddingTop:"20px"

                  },
                  "@keyframes slideUp": {
                    from: { transform: "translateY(100%)" },
                    to: { transform: "translateY(0)" },
                  },
                }}
                >
                  <DialogContent
                    sx={{
                      overflowY: "auto",
                      width: "100%",
                      height:"100%",
                      "&::-webkit-scrollbar": { display: "none" },
                      scrollbarWidth: "none",
                    }}
                  >
                  <div className="mb-6">
                        <IconButton sx={{ position: "absolute", left: "28px", top: "15px" }} className="w-[40px] h-[40px] p-[8px] "  onClick={handleCloseFrom}>
                          <CloseOutlinedIcon className="font-bold bg-white border-[0.5px] border-[#EBECED] shadow-md rounded-[4px]" />
                        </IconButton>
                        <p className="text-center font-medium text-[20px] mt-[-20px]">Pick Up</p>
                        </div>


                          <TextField
                          id="from"
                          variant="outlined"
                          size="small"
                          placeholder="Search Location"
                          value={selectedFrom}
                          onChange={(e) => setSelectedFrom(e.target.value)}
                          onClick={handleTextFieldClick}

                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LocationOnIcon />
                              </InputAdornment>
                            ),
                          }}
                          className="md:w-[23vw] lg:w-[23vw] w-full"
                          sx={{
                            "& .MuiInputBase-root": { height: "44px", borderRadius:"8px", },
                          }}
                        />
    
    
                        {showLocations &&
                      (locations.length === 0 ? (
                        <Typography
                          sx={{ textAlign: "center", padding: "20px", color: "#777" }}
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
                      ))}       
    
                </DialogContent>
              </Dialog>
    
            </Box>
    
            
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor="to" className="mb-1">Drop Off</label>
              <TextField
                id="to"
                variant="outlined"
                size="small"
                //  onClick={}
                value={selectedTo}
                onChange={(e) => setSelectedTo(e.target.value)}
                onClick={handleToClick}
                placeholder="Search Location"
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnIcon />
                    </InputAdornment>
                  ),
                }}
                 className="md:w-[23vw] lg:w-[23vw] w-full"
                sx={{
                
                "& .MuiInputBase-root": { height: "44px", borderRadius:"8px", },
                }}
              />

                  <Dialog
                 open={openTo}
                  // onClick={handleCloseTo}
                TransitionComponent={Transition}
                keepMounted
                fullScreen
                sx={{
                  "& .MuiBackdrop-root": {
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                  },
                  "& .MuiPaper-root": {
                    backgroundColor: "white",
                    display: "flex",
                    flexDirection: "column",
                    animation: "slideUp 0.3s ease-out forwards",
                    width:"100%",
                    height:"95vh",
                    position:"fixed",
                    borderRadius: "20px 20px 0 0",
                    bottom:"0px",
                    marginBottom:"0px",
                    marginTop:"0px",
                    paddingTop:"20px"

                  },
                  "@keyframes slideUp": {
                    from: { transform: "translateY(100%)" },
                    to: { transform: "translateY(0)" },
                  },
                }}
                >
                  <DialogContent
                    sx={{
                      overflowY: "auto",
                      width: "100%",
                      height:"100%",
                      "&::-webkit-scrollbar": { display: "none" },
                      scrollbarWidth: "none",
                    }}
                  >
               <div className="mb-6">
                
                        <IconButton sx={{ position: "absolute", left: "28px", top: "15px" }} className="w-[40px] h-[40px] p-[8px] "  onClick={handleCloseTo}>
                          <CloseOutlinedIcon className="font-bold bg-white border-[0.5px] border-[#EBECED] shadow-md rounded-[4px]" />
                        </IconButton>
                        <p className="text-center font-medium text-[20px] mt-[-20px]">Drop Off</p>
                        </div>


                <TextField
                id="to"
                variant="outlined"
                size="small"
                //  onClick={}
                value={selectedTo}
                onChange={(e) => setSelectedTo(e.target.value)}
                onClick={handleTextFieldClickOff}
                placeholder="Search Location"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnIcon />
                    </InputAdornment>
                  ),
                }}
                 className="md:w-[23vw] lg:w-[23vw] w-full"
                sx={{
                
                "& .MuiInputBase-root": { height: "44px", borderRadius:"8px", },
                }}
              />
    
               
                    {showLocationsOff &&
                      (locations.length === 0 ? (
                        <Typography
                          sx={{ textAlign: "center", padding: "20px", color: "#777" }}
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
                      ))}       
    
    
            </DialogContent>
              </Dialog>
    
            </Box>
    
    
            <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <label htmlFor="departure-date" className="mb-1">Pick Up Date</label>
                  <TextField
                    id="departure-date"
                    variant="outlined"
                    size="small"
                    placeholder="Select Date"
                    value={selectedDate} 
                    onClick={handleClick} 
                    InputProps={{
                         readOnly: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarMonthOutlinedIcon />
                        </InputAdornment>
                      ),
                    }}
                    className="md:w-[23vw] lg:w-[23vw] w-full"
                    sx={{
                      
                      "& .MuiInputBase-root": { height: "44px", borderRadius:"8px" },
                      "& .MuiOutlinedInput-input": { padding: "8px 10px", cursor: "pointer" },
                    }}
                  />
    

                <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                fullScreen
                onClose={handleClose}
                sx={{
                  "& .MuiBackdrop-root": {
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                  },
                  "& .MuiPaper-root": {
                    backgroundColor: "white",
                    display: "flex",
                    flexDirection: "column",
                    animation: "slideUp 0.3s ease-out forwards",
                    width:"100%",
                    height:"100vh",
                    position:"fixed",
                    bottom:"0px",
                    marginBottom:"0px",
                    // paddingBottom:"50px",
                    marginTop:"0px",
                    paddingTop:"20px"

                  },
                  "@keyframes slideUp": {
                    from: { transform: "translateY(100%)" },
                    to: { transform: "translateY(0)" },
                  },
                }}
                >
                  <DialogContent
                    sx={{
                      overflowY: "auto",
                      width: "100%",
                      height:"100%",
                      "&::-webkit-scrollbar": { display: "none" },
                      scrollbarWidth: "none",
                    }}
                  >
                        <div style={{ width: "100%" }}>
                        <div className="mb-6">
                        <IconButton sx={{ position: "absolute", left: "28px", top: "15px" }} className="w-[40px] h-[40px] p-[8px] "   onClick={handleClose}>
                          <CloseOutlinedIcon className="font-bold bg-white border-[0.5px] border-[#EBECED] shadow-md rounded-[4px]" />
                        </IconButton>
                        <p className="text-center font-medium text-[20px] mt-[-20px]">Choose Date</p>
                        </div>
                          <DateRange
                            editableDateInputs={true}
                              onChange={(item: RangeKeyDict) => {
                            if (item.selection.startDate) {
                              setDateRange([
                                {
                                  startDate: item.selection.startDate,
                                  endDate: item.selection.endDate ?? item.selection.startDate,
                                  key: item.selection.key ?? "selection",
                                },
                              ]);
                              setUserSelectedDate(true);
                            }
                          }}
                          
                            moveRangeOnFirstSelection={false}
                            ranges={dateRange}
                            rangeColors={["#FF6F1E"]}
                            months={2} 
                            direction="vertical"
                            showDateDisplay={false} 
                            className="w-[100%] h-[100%]"
                           
                          />
    

                             <Divider style={{marginTop:"40px", marginBottom:"20px"}}/>

                        <div className="w-[100%] pb-20">
                            <p className="text-center mb-[20px] font-bold font-inter">
                            {dateRange[0].startDate ? formatDate(dateRange[0].startDate) + (dateRange[0].endDate ? ` - ${formatDate(dateRange[0].endDate)}` : "") : "Pick a date"}
                          </p>
                          <button
                            className="w-[100%] h-[52px] rounded-[4px] font-inter font-medium text-[18px]"
                            style={{
                              backgroundColor: dateRange[0].startDate ? "#023E8A" : "#B0B0B0",
                              color: "white",
                              marginTop: 2,
                              cursor: dateRange[0].startDate ? "pointer" : "not-allowed",
                            }}
                            disabled={!userSelectedDate}
                            onClick={handleSelectDate}
                          >
                            Select Dates
                          </button>
                        </div>


                        </div>
    
                    </DialogContent>
                    </Dialog>
    
                </Box>
                </div>

        <div  className="flex flex-col md:flex-row md:justify-between md:flex-wrap lg:flex-wrap lg:flex-row lg:justify-between gap-[24px] mt-[24px]">
        <div className="flex w-full gap-2">
          <Box sx={{ display: "flex", flexDirection: "column", flex: 4 }}>
            <label htmlFor="pick-up-time" className="mb-1">Pick Up Time</label>
            <TextField
              id="pick-up-time"
              name="pickUpTime"
              type="time"
              variant="outlined"
              size="small"
              value={times.pickUpTime}
              onChange={handleTimeChange}
              placeholder="00 : 00"
              sx={{
                width: "100%", // Makes it take full space of the Box
                "& .MuiInputBase-root": { height: "44px", borderRadius: "8px" },
              }}
            />
          </Box>

          <Select
            labelId="time-period-label"
            value={timePeriod}
            onChange={handleChange}
            displayEmpty
            className="mt-7"
            sx={{
              flex: 1, // Takes 20% width
              height: "44px",
              borderRadius: "8px",
              "& .MuiOutlinedInput-root": {
                height: "44px",
                borderRadius: "8px",
                padding: "0px",

              },
              "& .MuiSelect-select": {
                height: "100%",
                display: "flex",
                alignItems: "center",
                padding: "10px",
              },
            }}
          >
            <MenuItem value="AM">AM</MenuItem>
            <MenuItem value="PM">PM</MenuItem>
          </Select>
        </div>

        <div className="flex w-full gap-2">
          <Box sx={{ display: "flex", flexDirection: "column", flex: 4 }}>
            <label htmlFor="drop-off-time" className="mb-1">Drop Off Time</label>
            <TextField
              id="drop-off-time"
              name="dropOffTime"
              type="time"
              variant="outlined"
              size="small"
              value={times.dropOffTime}
              onChange={handleTimeChange}
              placeholder="00 : 00"
              sx={{
                width: "100%", // Makes it take full space of the Box
                "& .MuiInputBase-root": { height: "44px", borderRadius: "8px" },
              }}
            />
          </Box>

          <Select
            labelId="time-period-label"
            value={timePeriodPM}
            onChange={handleTimePeriodChangePM}
            displayEmpty
            className="mt-7"
            sx={{
              flex: 1, // Takes 20% width
              height: "44px",
              borderRadius: "8px",
              "& .MuiOutlinedInput-root": {
                height: "44px",
                borderRadius: "8px",
                padding: "0px",
              },
              "& .MuiSelect-select": {
                height: "100%",
                display: "flex",
                alignItems: "center",
                padding: "10px",
              },
            }}
          >
            <MenuItem value="AM">PM</MenuItem>
            <MenuItem value="PM">AM</MenuItem>
          </Select>
        </div>

        </div>
        </div>

        <Box sx={{ display: "flex", flexDirection: "column", marginTop:"20px" }}>
                  <label htmlFor="departure-date" className="mb-1">Price Range</label>
                  <TextField
                    id="price"
                    variant="outlined"
                    size="small"
                    placeholder="Enter Minimum - Maximum Price"
                    value={priceRange}
                    // onClick={() => setOpenNoModal(true)} 
                    onClick={handleOpen}  
                    
                    className="md:w-[23vw] lg:w-[23vw] w-full"
                    sx={{
                      
                      "& .MuiInputBase-root": { height: "44px", borderRadius:"8px" },
                      "& .MuiOutlinedInput-input": { padding: "8px 10px", cursor: "pointer" },
                    }}
                  />
    
                  <Dialog
                open={openClick}
                onClose={handleCloseClick}
                TransitionComponent={Transition}
                keepMounted
                sx={{
                  "& .MuiBackdrop-root": {
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                  },
                  "& .MuiPaper-root": {
                    backgroundColor: "white",
                    borderRadius: "20px 20px 0 0",
                    display: "flex",
                    flexDirection: "column",
                    animation: "slideUp 0.3s ease-out forwards",
                    width:"100%",
                    height:"50%",
                    position:"fixed",
                    bottom:"0px",
                    marginBottom:"0px",
                    paddingBottom:"0px"

                  },
                  "@keyframes slideUp": {
                    from: { transform: "translateY(100%)" },
                    to: { transform: "translateY(0)" },
                  },
                }}
                >
                  <DialogContent
                    sx={{
                      overflowY: "auto",
                      // maxHeight: "80vh",
                      // paddingBottom: "5px",
                      width: "100%",
                      "&::-webkit-scrollbar": { display: "none" },
                      scrollbarWidth: "none",
                    }}
                  >
                    <div className="absolute z-40 top-0 left-0 right-0 bg-white  border-gray-300 rounded-t-[10px] pl-6 pr-4 pb-3 pt-4">
                      <div className="flex items-center justify-center relative">
                           <IconButton sx={{ position: "absolute", left: "0px", top: "-5px" }} onClick={handleCloseClick}>
                          <CloseOutlinedIcon className="w-[40px] h-[40px] p-[4px] font-bold bg-white border-[0.5px] border-[#EBECED] shadow-md rounded-[4px]" />
                        </IconButton>
                        <p className="text-[22px] font-inter font-medium">Price Range</p>
                     
                      </div>
                    </div>

    <div className="mt-[75px]">
      <p className="mt-[24px] text-[#181818] font-medium text-[18px] font-inter">Minimum Price</p>
      <TextField
        id="minPrice"
        variant="outlined"
        type="text"
        size="small"
        placeholder="Enter your price"
        value={miniprice}
        onChange={handlePriceChange}
        sx={{
          width: "100%",
          mt: "10px",
          mb: "24px",
          "& .MuiInputBase-root": {
            height: "44px",
            borderRadius: "8px",
          },
          "& .MuiInputBase-input::placeholder": { fontSize: "14px" },
        }}
      />

      <p className="text-[#181818] font-medium text-[18px] font-inter">Maximum Price</p>
      <TextField
        id="maxPrice"
        variant="outlined"
        type="text"
        size="small"
        placeholder="Enter your price"
        value={maxprice}
        onChange={handleMaxPriceChange}
        sx={{
          width: "100%",
          mt: "10px",
          mb: "24px",
          "& .MuiInputBase-root": {
            height: "44px",
            borderRadius: "8px",
          },
          "& .MuiInputBase-input::placeholder": { fontSize: "14px" },
        }}
      />
    </div>

                     <Dialog
                      open={openNoModal}
                    onClose={handleCloseNoModal}
                TransitionComponent={Transition}
                keepMounted
                sx={{
                  "& .MuiBackdrop-root": {
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                  },
                  "& .MuiPaper-root": {
                    backgroundColor: "white",
                    borderRadius: "20px 20px 0 0",
                    display: "flex",
                    flexDirection: "column",
                    animation: "slideUp 0.3s ease-out forwards",
                    width:"100%",
                    height:"50%",
                    position:"fixed",
                    bottom:"0px",
                    marginBottom:"0px",
                    paddingBottom:"0px"

                  },
                  "@keyframes slideUp": {
                    from: { transform: "translateY(100%)" },
                    to: { transform: "translateY(0)" },
                  },
                }}
                >
                  <DialogContent
                    sx={{
                      overflowY: "auto",
                      // maxHeight: "80vh",
                      // paddingBottom: "5px",
                      width: "100%",
                      "&::-webkit-scrollbar": { display: "none" },
                      scrollbarWidth: "none",
                    }}
                  >
                    <div style={{ textAlign: "center", fontSize: "24px", fontWeight: "bold", height:"100%" }}>
                        <div className="w-[100%]">
                          <div className="flex justify-end">
                           <IconButton>
                              <CloseOutlinedIcon  onClick={handleCloseNoModal}  className="w-[32px] h-[32px] p-[4px] font-bold bg-white border-[0.5px] border-[#EBECED] shadow-[0px_4px_4px_rgba(0,0,0,0.06)] rounded-[4px]" />
                            </IconButton>
                            </div>
                            <div className="flex justify-center mt-[30px]">
                             
                                <img src={offerNot} alt="" />
                                
                            </div>
                            <p className="text-[#181818] font-medium text-[20px] font-inter mt-[20px] text-center">
                                No Cars Available in Your Price Range
                            </p>
                            <p className="text-[#67696D] font-normal text-[16px] mt-[16px] mb-[25px] text-center">
                                Please increase your minimum price or adjust your maximum price to see available options.
                            </p>
                        </div>
                    </div>
                  </DialogContent>
                  </Dialog>

<div className="mt-18">
    <button
      onClick={handleSubmitOffer}
      disabled={!miniprice.trim() || !maxprice.trim()}
      className={`w-full h-[52px] rounded-[6px] text-white cursor-pointer ${
        miniprice.trim() && maxprice.trim() ? "bg-[#023E8A]" : "bg-[#023E8A] cursor-not-allowed opacity-50"
      }`}
    >
      Submit Offer
    </button>
    </div>
                  </DialogContent>
                  </Dialog>

    
        </Box>
    
        <div onClick={handleSearch}  className="bg-[#023E8A] h-[52px] md:w-[138px] lg:w-[138px]  w-full text-center text-white font-inter text-base rounded-[8px] pt-[14px] mt-14 cursor-pointer">
            <button>Search</button>
        </div>
        
        </div>

        ) : (

          // web view

        <div className="flex flex-col md:flex-row md:justify-between md:gap-[24px] lg:gap-[24px] md:flex-wrap lg:flex-wrap lg:flex-row lg:justify-between">

        <div>
        <div className="flex flex-col md:flex-row md:justify-between md:flex-wrap lg:flex-wrap lg:flex-row lg:justify-between gap-[24px]">
            
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor="from" className="mb-1">Pick Up</label>
              <TextField
                id="from"
                variant="outlined"
                size="small"
                placeholder="Search Destination"
                value={selectedFrom}
                onChange={(e) => setSelectedFrom(e.target.value)}
                onClick={handleFromClick}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnIcon />
                    </InputAdornment>
                  ),
                }}
                className="md:w-[23vw] lg:w-[23vw] w-full"
                sx={{
                  "& .MuiInputBase-root": { height: "44px", borderRadius:"8px", },
                }}
              />
    
              <Popper id="from-popper" open={openFrom} anchorEl={FromClick} placement="bottom-start">
              <ClickAwayListener onClickAway={handleCloseFrom}>
                <Paper
                  elevation={3}
                  sx={{
                    width: "317px",
                    borderRadius: "6px",
                    backgroundColor: "white",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    paddingBottom:"25px",
                  }}
                >
                  <Typography variant="subtitle1" className="font-inter text-[#343537] text-lg pl-[24px] pt-[24px] pr-[24px]">
                    Recent Searches
                  </Typography>
    
                    {locations.length === 0 ? (
                      <Typography sx={{ textAlign: "center", padding: "20px", color: "#777" }} className="font-inter">
                        No recent searches
                      </Typography>
                    ) : (
                    locations.map((location, index) => (
                      <React.Fragment key={location}>
                        <div className="flex justify-between pl-[24px] pt-[24px] pr-[24px] cursor-pointer">
                          <div className="flex gap-[8px]" onClick={() => handleFromOptionClick(location)}>
                            <div className="h-[28px] w-[28px] rounded-[4px] border border-[#FF6F1E] bg-[#FF6F1E0A] text-center">
                              <RoomOutlinedIcon className="text-[#FF6F1E]" sx={{ fontSize: "16px" }} />
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
    
                        {index !== locations.length - 1 && <Divider sx={{ marginTop: "15px" }} />}
                      </React.Fragment>
                    ))
                  )}
    
                </Paper>
              </ClickAwayListener>
            </Popper>
            </Box>
    
            
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor="to" className="mb-1">Drop Off</label>
              <TextField
                id="to"
                variant="outlined"
                size="small"
                //  onClick={}
                value={selectedTo}
                onChange={(e) => setSelectedTo(e.target.value)}
                onClick={handleToClick}
                placeholder="Search Destination"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnIcon />
                    </InputAdornment>
                  ),
                }}
                 className="md:w-[23vw] lg:w-[23vw] w-full"
                sx={{
                
                "& .MuiInputBase-root": { height: "44px", borderRadius:"8px", },
                }}
              />
    
          <Popper id="from-popper" open={openTo} anchorEl={ToClick} placement="bottom-start">
          <ClickAwayListener onClickAway={handleCloseTo}>
            <Paper
              elevation={3}
              sx={{
                width: "317px",
                borderRadius: "6px",
                backgroundColor: "white",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                paddingBottom:"25px",
              }}
            >
              <Typography variant="subtitle1" className="font-inter text-[#343537] text-lg pl-[24px] pt-[24px] pr-[24px]">
                Recent Searches
              </Typography>
    
                {locations.length === 0 ? (
                  <Typography sx={{ textAlign: "center", padding: "20px", color: "#777" }} className="font-inter">
                    No recent searches
                  </Typography>
                ) : (
                locations.map((location, index) => (
                  <React.Fragment key={location}>
                    <div className="flex justify-between pl-[24px] pt-[24px] pr-[24px] cursor-pointer">
                      <div className="flex gap-[8px]"  onClick={() => handleToOptionClick(location)}>
                        <div className="h-[28px] w-[28px] rounded-[4px] border border-[#FF6F1E] bg-[#FF6F1E0A] text-center">
                          <RoomOutlinedIcon className="text-[#FF6F1E]" sx={{ fontSize: "16px" }} />
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
    
                    {index !== locations.length - 1 && <Divider sx={{ marginTop: "15px" }} />}
                  </React.Fragment>
                ))
              )}
    
            </Paper>
          </ClickAwayListener>
          </Popper>
            </Box>
    
    
            <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <label htmlFor="departure-date" className="mb-1">Date</label>
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
                    className="md:w-[23vw] lg:w-[23vw] w-full"
                    sx={{
                      
                      "& .MuiInputBase-root": { height: "44px", borderRadius:"8px" },
                      "& .MuiOutlinedInput-input": { padding: "8px 10px", cursor: "pointer" },
                    }}
                  />
    
    
    
                  <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom-start">
                    <ClickAwayListener onClickAway={handleClose}>
                      <Paper
                        elevation={3}
                        sx={{
                          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                          // width: "867px", // Ensures full width
                          // height: "555px", // Ensures full height
                          overflow: "hidden", // Prevents content overflow
                          display: "flex",
                          justifyContent: "center", // Centers content
                          alignItems: "center",
                          paddingBottom:"20px",
                        }}
                      >
                        <div style={{ width: "100%", height: "100%" }}>
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
                            months={2} // Show 2 calendars side by side
                            direction="horizontal" // Arrange them in a row
                            showDateDisplay={false} // Optional: Hide input fields
                            className="w-full h-full" // Tailwind (if used)
                          />
    
                        <div className="w-[96%] m-auto">
                             <p className="text-center mb-[20px] font-bold font-inter">
                            {dateRange[0].startDate ? formatDate(dateRange[0].startDate) + (dateRange[0].endDate ? ` - ${formatDate(dateRange[0].endDate)}` : "") : "Pick a date"}
                          </p>
                            <button
                                className="w-full h-[52px] rounded-[4px] font-inter text-[14px] cursor-pointer"
                                style={{
                                  backgroundColor: "#023E8A",
    
                                  color: "white",
                                  marginTop: 2,
                                  // "&:hover": { backgroundColor: "#012A5A" },
                                }}
                                onClick={handleSelectDate}
                              >
                                Select Date
                              </button>
                        </div>
                        </div>
    
                  
    
                      </Paper>
                    </ClickAwayListener>
                  </Popper>
    
            </Box>
        </div>

        <div  className="flex flex-col md:flex-row md:justify-between md:flex-wrap lg:flex-wrap lg:flex-row lg:justify-between gap-[24px] mt-[24px]">
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor="pick-up-time" className="mb-1">Pick Up Time</label>
              <TextField
                id="pick-up-time"
                name="pickUpTime"
                type="time"
                variant="outlined"
                size="small"
                value={times.pickUpTime}
                onChange={handleTimeChange}
                placeholder="00 : 00"
                 className="md:w-[27.7vw] lg:w-[27.7vw] w-full"
                sx={{
                  "& .MuiInputBase-root": { height: "44px", borderRadius:"8px", },
                }}
              />
    
            </Box>

            <Select
            labelId="time-period-label"
            value={timePeriod}
            onChange={handleChange}
            displayEmpty
            className="md:w-[6vw] lg:w-[6vw] w-full md:mt-[28px] lg:mt-[28px] mt-[7px]"
            sx={{
                height: "44px",
                borderRadius: "8px",
                "& .MuiOutlinedInput-root": {
                height: "44px",
                borderRadius: "8px",
                padding: "0px",
                },
                "& .MuiSelect-select": {
                height: "100%",
                display: "flex",
                alignItems: "center",
                padding: "10px", 
                },
            }}

            >
            {/* <MenuItem value="" disabled sx={{color:"grey"}}>
                AM
            </MenuItem> */}
            <MenuItem value="AM">AM</MenuItem>
            <MenuItem value="PM">PM</MenuItem>
            </Select>

              <Box sx={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor="drop-off-time" className="mb-1">Drop Off Time</label>
              <TextField
                id="drop-off-time"
                name="dropOffTime"
                type="time"
                variant="outlined"
                size="small"
                value={times.dropOffTime}
                onChange={handleTimeChange}
                placeholder="00 : 00"
                className="md:w-[27.7vw] lg:w-[27.7vw] w-full"
                sx={{
                  "& .MuiInputBase-root": { height: "44px", borderRadius:"8px", },
                }}
              />
    
            </Box>

           <Select
            labelId="time-period-label"
            value={timePeriodPM}
            onChange={handleTimePeriodChangePM}
            displayEmpty
            className="md:w-[6vw] lg:w-[6vw] w-full md:mt-[28px] lg:mt-[28px] mt-[7px]"

            sx={{
                height: "44px",
                borderRadius: "8px",
                "& .MuiOutlinedInput-root": {
                height: "44px",
                borderRadius: "8px",
                padding: "0px",
                },
                "& .MuiSelect-select": {
                height: "100%",
                display: "flex",
                alignItems: "center",
                padding: "10px", 
                },
            }}

            >
            {/* <MenuItem value="" disabled sx={{color:"grey"}}>
                PM
            </MenuItem> */}
            <MenuItem value="AM">PM</MenuItem>
            <MenuItem value="PM">AM</MenuItem>
            </Select>
        </div>
        </div>
    
        <div onClick={handleSearch}  className="bg-[#023E8A] h-[52px] md:w-[138px] lg:w-[138px]  w-full text-center text-white font-inter text-base rounded-[8px] pt-[14px] mt-14 cursor-pointer">
            <button>Search</button>
        </div>
        
        </div>
         )}
    </div>
  )
}

export default Page