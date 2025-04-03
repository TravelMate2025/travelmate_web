

import React, { useState, useRef, useEffect, forwardRef , Ref, ReactElement  } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {Dialog, DialogContent, Radio, Slide} from "@mui/material";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import Popper from "@mui/material/Popper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { DateRange, RangeKeyDict } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { addDays, format } from "date-fns";
import FlightClassOutlinedIcon from "@mui/icons-material/FlightClassOutlined";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { Divider, IconButton } from "@mui/material";
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { useMediaQuery } from "react-responsive";
import { TransitionProps } from "@mui/material/transitions";


const Transition = forwardRef<unknown, TransitionProps & { children: ReactElement }>(
  function Transition(props, ref) {
    return <Slide direction="up" ref={ref as Ref<unknown>} {...props} />;
  }
);


interface DateRangeType {
  startDate: Date;
  endDate: Date;
  key: string;
}

type PassengerType = "adults" | "children" | "infants";

interface PassengerCounts {
  adults: number;
  children: number;
  infants: number;
}

interface Flight {
  id: number;
  from: string;
  to: string;
  date: string;
}


const RoundTrip: React.FC = () => {
 const isMobile = useMediaQuery({ maxWidth: 768 });


   const [selectedValue, setSelectedValue] = useState<string>(() => {
    return localStorage.getItem("tripType") || "round-trip";
  });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [dateRange, setDateRange] = useState<DateRangeType[]>([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);
   const [dateId, setDateId] = useState<number | null>(null);

   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setSelectedValue(newValue);
    localStorage.setItem("tripType", newValue);
  };

    useEffect(() => {
    const savedValue = localStorage.getItem("tripType");
    if (savedValue) {
      setSelectedValue(savedValue);
    }
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

 

const [passengerAnchor, setPassengerAnchor] = useState<null | HTMLElement>(null);

const handlePassenger = (event: React.MouseEvent<HTMLElement>) => {
  setPassengerAnchor(passengerAnchor ? null : event.currentTarget);
};

 const handleClose = () => {
    setAnchorEl(null);
  };

const [selectedFrom, setSelectedFrom] = useState(""); // State for selected option
const [openFrom, setOpenFrom] = useState(false);
const [FromClick, setFromClick] = useState<HTMLElement | null>(null);
 const [FromId, setFromId] = useState<number | null>(null);

   const [selectedTo, setSelectedTo] = useState<string>("");
   const [openTo, setOpenTo] = useState(false);
   const [ToClick, setToClick] = useState<HTMLElement | null>(null);
   const [ToId, setToId] = useState<number | null>(null);

    const handleToClick = (event: React.MouseEvent<HTMLElement>, id: number) => {
    setToClick(event.currentTarget);
    setOpenTo((prevOpen) => !prevOpen);
    setToId(id);
  };

    const handleToClick1 = (event: React.MouseEvent<HTMLElement>) => {
    setToClick(event.currentTarget);
    setOpenTo((prevOpen) => !prevOpen);
  };

  const handleCloseTo = () => {
    setOpenTo(false);
  };

     const handleFromClick = (event: React.MouseEvent<HTMLElement>, id: number) => {
    setFromClick(event.currentTarget);
    setOpenFrom((prevOpen) => !prevOpen);
    setFromId(id);
  };

      const handleFromClick1 = (event: React.MouseEvent<HTMLElement>) => {
    setFromClick(event.currentTarget);
    setOpenFrom((prevOpen) => !prevOpen);
  };
     const handleCloseFrom = () => {
        setOpenFrom(false);
      };

      const handleFromOptionClick = (option: string) => {
        setSelectedFrom(option);
        setOpenFrom(false); 
      };

      const handleToOptionClick = (option: string) => {
        setSelectedTo(option);
        setOpenTo(false); 
      };

  const [opened, setOpened] = useState(false);

     const handleClickDate = (event: React.MouseEvent<HTMLElement>, id: number) => {
    setAnchorEl(event.currentTarget);
    setOpened((prevOpen) => !prevOpen);
    setDateId(id);
  };

  const handleCloseDate = () => {
    setOpened(false);
  };


    const handleSelectDateFunc = () => {
    if (dateRange[0].startDate && dateRange[0].endDate && dateId) {
      const startDateStr = dateRange[0].startDate.toLocaleDateString();
      const endDateStr = dateRange[0].endDate.toLocaleDateString();
      const dateString = `${startDateStr} - ${endDateStr}`;
      setFlights(flights.map((flight) =>
        flight.id === dateId ? { ...flight, date: dateString } : flight
      ));
    }
    setOpened(false);
  };

  const open = Boolean(anchorEl);
  const id = open ? "date-range-popper" : undefined;
  

const [locations, setLocations] = useState(["Ibadan, Oyo", "Abuja", "Port Harcourt"]);

const handleRemoveOption = (locationToRemove: string) => {
  setLocations(locations.filter(location => location !== locationToRemove));
};

  const [selectedDate, setSelectedDate] = useState<string>("");

  const [counts, setCounts] = useState<PassengerCounts>({
    adults: 0,
    children: 0,
    infants: 0,
  });

  const [passengerText, setPassengerText] = useState<string>("");

  const handleIncrement = (type: PassengerType) => {
    setCounts((prevCounts) => ({
      ...prevCounts,
      [type]: prevCounts[type] + 1,
    }));
  };

 
  const handleDecrement = (type: PassengerType) => {
    setCounts((prevCounts) => ({
      ...prevCounts,
      [type]: prevCounts[type] > 0 ? prevCounts[type] - 1 : 0,
    }));
  };

  const handleDone = () => {
  const totalPassengers = counts.adults + counts.children + counts.infants;
  setPassengerText(`${totalPassengers} Passengers`);
  setPassengerAnchor(null); 
};

 const [flightClass, setFlightClass] = useState(false);
  const anchorRef = useRef(null);

   const [selectedClass, setSelectedClass] = useState("");

    const navigate = useNavigate();

 const handleSearch = () => {
  const roundtripData = {
    from: selectedFrom,
    to: selectedTo,
    departureDate: selectedDate,
    passengers: passengerText,
    flightClass: selectedClass,
  };

  sessionStorage.setItem("roundtrip", JSON.stringify(roundtripData));
  navigate("/departure-flight", { state: roundtripData });
};


      const handleSearchOneTrip = () => {
      navigate("/departure-flight-one-way", {
        state: {
          from: selectedFrom,
          to: selectedTo,
          departureDate: selectedDate,
          passengers: passengerText,
          flightClass: selectedClass
        },
      });
    };

   const location = useLocation();
   const receivedFlights = location.state?.flights as Flight[] | undefined;

  const [flights, setFlights] = useState<Flight[]>(receivedFlights || [
    { id: 1, from: '', to: '', date: '' },
    { id: 2, from: '', to: '', date: '' },
  ]);
const [, setLocate] = useState<{ [key: number]: string[] }>({});


   const handleInputChange = (id: number, field: 'from' | 'to' | 'date', value: string) => {
    setFlights(flights.map((flight) =>
      flight.id === id ? { ...flight, [field]: value } : flight
    ));
  };

  const addFlight = () => {
    setFlights([...flights, { id: flights.length + 1, from: '', to: '', date: '' }]);
  };

    const removeFlight = (id: number) => {
    setFlights(flights.filter((flight) => flight.id !== id));
    setLocate((prevLocations) => {
      const newLocations = { ...prevLocations };
      delete newLocations[id];
      return newLocations;
    });
  }


  //  const handleRemoveOptionLocate = (flightId: number, location: string) => {
  //   setLocate((prevLocations) => ({
  //     ...prevLocations,
  //     [flightId]: (prevLocations[flightId] || []).filter((item) => item !== location),
  //   }));
  // };

const handleSearchMultiTrip = () => {
  navigate('/departure-flight-multi-way', {
    state: { flights, passengers: passengerText, flightClass: selectedClass },
  });
};

 const handleDepartureSelectionFrom = (flightId: number, location: string) => {
    setFlights(flights.map((flight) =>
      flight.id === flightId ? { ...flight, from: location } : flight
    ));
    setOpenFrom(false);
    setLocate((prevLocations) => ({
      ...prevLocations,
      [flightId]: [...(prevLocations[flightId] || []), location],
    }));
  };


 const handleDestinationSelectionTo = (flightId: number, location: string) => {
    setFlights(flights.map((flight) =>
      flight.id === flightId ? { ...flight, to: location } : flight
    ));
    setOpenTo(false);
    setLocate((prevLocations) => ({
      ...prevLocations,
      [flightId]: [...(prevLocations[flightId] || []), location],
    }));
  }
     
const [showLocations, setShowLocations] = useState(false);
const handleTextFieldClick = () => {
  setShowLocations(true);
};
const [showLocationsOff, setShowLocationsOff] = useState(false);
const handleTextFieldClickOff = () => {
  setShowLocationsOff(true);
};

     const [userSelectedDate, setUserSelectedDate] = useState(false);
 const formatDate = (date: Date) => format(date, "dd MMM yyyy");
const [, setOpens] = useState(false);
const handleSelectDate= () => {
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





  return (

    
    <FormControl sx={{
      width: { xs: "100%", md: "auto" },
    }}>

    <div>
      {isMobile ? (
     <RadioGroup
  row
  aria-labelledby="trip-type-label"
  name="trip-type"
  value={selectedValue}
  onChange={handleChange}
  className="mb-8"
  sx={{
    width: { xs: "100%", sm: "100%" },
    display: "flex",
    justifyContent: { xs: "space-between" }, // Applies justify-between at 600px and above
  }}
>
  <FormControlLabel value="round-trip" control={<Radio />} label="Round Trip" />
  <FormControlLabel value="one-way" control={<Radio />} label="One Way" />
  <FormControlLabel value="multi-city" control={<Radio />} label="Multi City" />
</RadioGroup>


    ) : (
    <RadioGroup
    row
    aria-labelledby="trip-type-label"
    name="trip-type"
    value={selectedValue}
    onChange={handleChange}
    className="mb-8"
  >
    <FormControlLabel value="round-trip" control={<Radio />} label="Round Trip" />
    <FormControlLabel value="one-way" control={<Radio />} label="One Way" />
    <FormControlLabel value="multi-city" control={<Radio />} label="Multi City" />
  </RadioGroup>
  )}
  </div>

    

     {selectedValue === "round-trip" &&(
      <div>
        {isMobile ? (
         <Box sx={{ width:"100%"}}>
        
        <Box sx={{ display: "flex", flexDirection: "column" , marginBottom: "16px",  marginTop:"-10px" }}>
          <label htmlFor="from" className="mb-1 text-[16px] font-medium">From</label>
          <TextField
            id="from"
            variant="outlined"
            size="small"
            placeholder="Search Destination"
           
            value={selectedFrom}
            onClick={handleFromClick1}
            // onClick={() => handleFromOptionClick(location)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOnIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              width: "100%",
             
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
                               <p className="text-center font-medium text-[20px] mt-[-20px]">From</p>
                               </div>
       
       
                                 <TextField
                                 id="from"
                                 variant="outlined"
                                 size="small"
                                 placeholder="Search City or Airport"
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

        
        <Box sx={{ display: "flex", flexDirection: "column", marginBottom: "16px" }}>
          <label htmlFor="to" className="mb-1 text-[16px] font-medium">To</label>
          <TextField
            id="to"
            variant="outlined"
            size="small"
            value={selectedTo}
             onClick={handleToClick1}
            //  onClick={() => handleToOptionClick(location)}
            placeholder="Search Destination"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOnIcon />
                </InputAdornment>
              ),
            }}
            sx={{
               width: "100%",
             
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
                                <p className="text-center font-medium text-[20px] mt-[-20px]">To</p>
                            </div>
        
        
                        <TextField
                        id="to"
                        variant="outlined"
                        size="small"
                        //  onClick={}
                        value={selectedTo}
                        onChange={(e) => setSelectedTo(e.target.value)}
                        onClick={handleTextFieldClickOff}
                        placeholder="Search City or Airport "
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
     
        <Box sx={{ display: "flex", flexDirection: "column", marginBottom: "16px" }}>
              <label htmlFor="departure-date" className="mb-1 text-[16px] font-medium">Date</label>
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
                sx={{
                  width: "100%",
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

        
        <Box sx={{ display: "flex", flexDirection: "column", marginBottom: "16px" }}>
          <label htmlFor="passengers" className="mb-1 text-[16px] font-medium">Passengers</label>
          <TextField
            id="passengers"
            variant="outlined"
            size="small"
            placeholder="1 Passenger"
             value={passengerText}
            onClick={handlePassenger}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlineOutlinedIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              width: "100%",
             
              "& .MuiInputBase-root": { height: "44px", borderRadius:"8px", },
            }}
          />
        

            <Dialog
                              
                              open={Boolean(passengerAnchor)}
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
                  width: "100%",
                  "&::-webkit-scrollbar": { display: "none" },
                 scrollbarWidth: "none",
                }}
                  >

                <div className="absolute z-40 top-0 left-0 right-0 bg-white   border-gray-300 rounded-t-[10px] pl-6 pr-4 pb-3 pt-6">
                  <div className="flex items-center justify-center relative">
                  <IconButton sx={{ position: "absolute", left: "0px", top: "-5px" }} onClick={handleDone}>
                  <CloseOutlinedIcon className="w-[60px] h-[60px] p-[4px] font-bold bg-white border-[0.5px] border-[#EBECED] shadow-md rounded-[4px]" />
                </IconButton>
                    <p className="text-[20px] font-inter font-medium">Passenger</p>
                                   
                  </div>
                  </div>

                <div>
    
                  <div className="flex justify-between mb-3 mt-18">
                    <div>
                      <p className="text-[16px] text-[#181818] font-inter font-semibold">Adults</p>
                      <p className="text-[#818489] text-[14px] font-inter font-normal">Ages 16 and Above</p>
                    </div>
                    <div>
                      <div className="w-[95px] h-[30px] mt-1.5 rounded-[4px] border border-[#023E8A] flex justify-between gap-2 items-center px-2">
                        <RemoveOutlinedIcon
                          className="text-[#ACAEB3] cursor-pointer"
                          onClick={() => handleDecrement("adults")}
                        />
                        <div>{counts.adults}</div>
                        <AddOutlinedIcon
                          className="cursor-pointer"
                          onClick={() => handleIncrement("adults")}
                        />
                      </div>
                    </div>
                  </div>
                  <Divider sx={{ marginBottom: "20px" }} />

                  <div className="flex justify-between mb-3">
                    <div>
                      <p className="text-[16px] text-[#181818] font-inter font-semibold">Children</p>
                      <p className="text-[#818489] text-[14px] font-inter font-normal">Ages 3 - 15</p>
                    </div>
                    <div>
                      <div className="w-[95px] h-[30px] mt-1.5 rounded-[4px] border border-[#023E8A] flex justify-between gap-2 items-center px-2">
                        <RemoveOutlinedIcon
                          className="text-[#ACAEB3] cursor-pointer"
                          onClick={() => handleDecrement("children")}
                        />
                        <div>{counts.children}</div>
                        <AddOutlinedIcon
                          className="cursor-pointer"
                          onClick={() => handleIncrement("children")}
                        />
                      </div>
                    </div>
                  </div>
                  <Divider sx={{ marginBottom: " 20px" }} />

                  <div className="flex justify-between mb-3">
                    <div>
                      <p className="text-[16px] text-[#181818] font-inter font-semibold">Infant</p>
                      <p className="text-[#818489] text-[14px] font-inter font-normal">Ages 0 and 2</p>
                    </div>
                    <div>
                      <div className="w-[95px] h-[30px] mt-1.5 rounded-[4px] border border-[#023E8A] flex justify-between gap-2 items-center px-2">
                        <RemoveOutlinedIcon
                          className="text-[#ACAEB3] cursor-pointer"
                          onClick={() => handleDecrement("infants")}
                        />
                        <div>{counts.infants}</div>
                        <AddOutlinedIcon
                          className="cursor-pointer"
                          onClick={() => handleIncrement("infants")}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-16">
                  <button  onClick={handleDone} className="bg-[#023E8A] w-full h-[52px] text-white rounded-[6px] mt-[40px] font-infer text-[16px] cursor-pointer">Done</button>
                </div>
            </DialogContent>
            </Dialog>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", marginBottom: "40px" }}>
         <label htmlFor="class" className="mb-1 text-[16px] font-medium">Class</label>
          <TextField
            id="class"
            variant="outlined"
            size="small"
            placeholder="Economy"
            value={selectedClass}
            inputRef={anchorRef}
            onClick={() => setFlightClass(true)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FlightClassOutlinedIcon />
                </InputAdornment>
              ),
            }}
            sx={{
                width: "100%",
             
              "& .MuiInputBase-root": { height: "44px", borderRadius:"8px", },
            }}
          />


             <Dialog
                              
                              open={flightClass} 
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
                                  height:"40%",
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
                  width: "100%",
                  "&::-webkit-scrollbar": { display: "none" },
                 scrollbarWidth: "none",
                }}>


                <div className="absolute z-40 top-0 left-0 right-0 bg-white   border-gray-300 rounded-t-[10px] pl-6 pr-4 pb-3 pt-6">
                  <div className="flex items-center justify-center relative">
                  <IconButton sx={{ position: "absolute", left: "0px", top: "-5px" }} onClick={() => setFlightClass(false)}>
                  <CloseOutlinedIcon className="w-[60px] h-[60px] p-[4px] font-bold bg-white border-[0.5px] border-[#EBECED] shadow-md rounded-[4px]" />
                </IconButton>
                    <p className="text-[20px] font-inter font-medium">Class</p>
                                   
                  </div>
                  </div>

             <div className="w-full mt-10 pt-4 pb-4">
              <RadioGroup
                aria-labelledby="flight-class-group"
                name="flight-class"
                value={selectedClass}
                
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                }}
              >
                <FormControlLabel value="Economy" control={<Radio />} label="Economy" className="" />

                <FormControlLabel value="Business" control={<Radio />} label="Business" className="" />

                <FormControlLabel value="First Class" control={<Radio />} label="First Class" className="" />
              </RadioGroup>
            </div>

               <div className="mt-4">
                  <button  onClick={() => setFlightClass(false)} className="bg-[#023E8A] w-full h-[52px] text-white rounded-[6px] mt-[40px] font-infer text-[16px] cursor-pointer">Done</button>
                </div>

             </DialogContent>
            </Dialog>
       </Box>


          <div onClick={handleSearch}  className="bg-[#023E8A] h-[52px] w-full text-center text-white font-inter text-base rounded-[8px] pt-[14px] mt-[18px] cursor-pointer">
            <button>Search</button>
          </div>
      </Box>
        ) : (
          // web view
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2}}>
        
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <label htmlFor="from" className="mb-1">From</label>
          <TextField
            id="from"
            variant="outlined"
            size="small"
            placeholder="Search Destination"
           
            value={selectedFrom}
             onClick={handleFromClick1}
            // onClick={() => handleFromOptionClick(location)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOnIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              width: "200px",
             
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
          <label htmlFor="to" className="mb-1">To</label>
          <TextField
            id="to"
            variant="outlined"
            size="small"
            value={selectedTo}
             onClick={handleToClick1}
            //  onClick={() => handleToOptionClick(location)}
            placeholder="Search Destination"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOnIcon />
                </InputAdornment>
              ),
            }}
            sx={{
               width: "200px",
             
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
                sx={{
                  width: "200px",
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

        
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <label htmlFor="passengers" className="mb-1">Passengers</label>
          <TextField
            id="passengers"
            variant="outlined"
            size="small"
            placeholder="1 Passenger"
             value={passengerText}
            onClick={handlePassenger}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlineOutlinedIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              width: "200px",
             
              "& .MuiInputBase-root": { height: "44px", borderRadius:"8px", },
            }}
          />
        


        <Popper
            open={Boolean(passengerAnchor)}
            anchorEl={passengerAnchor}
            placement="bottom-start"
            modifiers={[
              {
                name: "preventOverflow",
                options: {
                  boundary: "window",
                },
              },
            ]}
          >
            <ClickAwayListener onClickAway={() => setPassengerAnchor(null)}>
              <Paper
                elevation={3}
                sx={{
                  width: "376px",
                  borderRadius: "6px",
                  backgroundColor: "white",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  padding: "16px",
                }}
              >

                <div>
    
                  <div className="flex justify-between mb-3">
                    <div>
                      <p className="text-[16px] text-[#181818] font-inter font-semibold">Adults</p>
                      <p className="text-[#818489] text-[14px] font-inter font-normal">Ages 16 and Above</p>
                    </div>
                    <div>
                      <div className="w-[95px] h-[30px] mt-1.5 rounded-[4px] border border-[#023E8A] flex justify-between gap-2 items-center px-2">
                        <RemoveOutlinedIcon
                          className="text-[#ACAEB3] cursor-pointer"
                          onClick={() => handleDecrement("adults")}
                        />
                        <div>{counts.adults}</div>
                        <AddOutlinedIcon
                          className="cursor-pointer"
                          onClick={() => handleIncrement("adults")}
                        />
                      </div>
                    </div>
                  </div>
                  <Divider sx={{ marginBottom: "8px" }} />

                  <div className="flex justify-between mb-3">
                    <div>
                      <p className="text-[16px] text-[#181818] font-inter font-semibold">Children</p>
                      <p className="text-[#818489] text-[14px] font-inter font-normal">Ages 3 - 15</p>
                    </div>
                    <div>
                      <div className="w-[95px] h-[30px] mt-1.5 rounded-[4px] border border-[#023E8A] flex justify-between gap-2 items-center px-2">
                        <RemoveOutlinedIcon
                          className="text-[#ACAEB3] cursor-pointer"
                          onClick={() => handleDecrement("children")}
                        />
                        <div>{counts.children}</div>
                        <AddOutlinedIcon
                          className="cursor-pointer"
                          onClick={() => handleIncrement("children")}
                        />
                      </div>
                    </div>
                  </div>
                  <Divider sx={{ marginBottom: "8px" }} />

                  <div className="flex justify-between mb-3">
                    <div>
                      <p className="text-[16px] text-[#181818] font-inter font-semibold">Infant</p>
                      <p className="text-[#818489] text-[14px] font-inter font-normal">Ages 0 and 2</p>
                    </div>
                    <div>
                      <div className="w-[95px] h-[30px] mt-1.5 rounded-[4px] border border-[#023E8A] flex justify-between gap-2 items-center px-2">
                        <RemoveOutlinedIcon
                          className="text-[#ACAEB3] cursor-pointer"
                          onClick={() => handleDecrement("infants")}
                        />
                        <div>{counts.infants}</div>
                        <AddOutlinedIcon
                          className="cursor-pointer"
                          onClick={() => handleIncrement("infants")}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <button  onClick={handleDone} className="bg-[#023E8A] w-full h-[52px] text-white rounded-[6px] mt-[40px] font-infer text-[16px] cursor-pointer">Done</button>
                </div>

              </Paper>
            </ClickAwayListener>
          </Popper>


        </Box>

        <Box sx={{ display: "flex", flexDirection: "column" }}>
         <label htmlFor="class" className="mb-1">Class</label>
          <TextField
            id="class"
            variant="outlined"
            size="small"
            placeholder="Economy"
            value={selectedClass}
            inputRef={anchorRef}
            onClick={() => setFlightClass(true)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FlightClassOutlinedIcon />
                </InputAdornment>
              ),
            }}
            sx={{
                width: "200px",
             
              "& .MuiInputBase-root": { height: "44px", borderRadius:"8px", },
            }}
          />

      <Popper open={flightClass} anchorEl={anchorRef.current} placement="bottom-start">
        <ClickAwayListener onClickAway={() => setFlightClass(false)}>
          <Paper
            elevation={3}
            sx={{
              width: "317px",
              position:"relative",
              left:"-43px",
              top:"6px",
              height:"100%",
              borderRadius: "6px",
              backgroundColor: "white",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            
            }}
          >

             <div className="w-full pt-4 pb-4">
              <RadioGroup
                aria-labelledby="flight-class-group"
                name="flight-class"
                value={selectedClass}
                
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  setFlightClass(false); 
                }}
              >
                <FormControlLabel value="Economy" control={<Radio />} label="Economy" className="pl-10" />
                <Divider sx={{ marginTop: "16px", marginBottom: "16px" }} />

                <FormControlLabel value="Business" control={<Radio />} label="Business" className="pl-10" />
                <Divider sx={{ marginTop: "16px", marginBottom: "16px" }} />

                <FormControlLabel value="First Class" control={<Radio />} label="First Class" className="pl-10" />
              </RadioGroup>
            </div>
          </Paper>
        </ClickAwayListener>
      </Popper>
       </Box>


          <div onClick={handleSearch}  className="bg-[#023E8A] h-[52px] w-[138px] text-center text-white font-inter text-base rounded-[8px] pt-[14px] mt-[18px] cursor-pointer">
            <button>Search</button>
          </div>
      </Box>
        )}
      </div>
      )}



       {selectedValue === "one-way" &&(
        <div>
          {isMobile ? (

            <Box sx={{ width:"100%"}}>
        
        <Box sx={{ display: "flex", flexDirection: "column" , marginBottom: "16px",  marginTop:"-10px" }}>
          <label htmlFor="from" className="mb-1 text-[16px] font-medium">From</label>
          <TextField
            id="from"
            variant="outlined"
            size="small"
            placeholder="Search Destination"
           
            value={selectedFrom}
             onClick={handleFromClick1}
            // onClick={() => handleFromOptionClick(location)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOnIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              width: "100%",
             
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
                               <p className="text-center font-medium text-[20px] mt-[-20px]">From</p>
                               </div>
       
       
                                 <TextField
                                 id="from"
                                 variant="outlined"
                                 size="small"
                                 placeholder="Search City or Airport"
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

        
        <Box sx={{ display: "flex", flexDirection: "column", marginBottom: "16px" }}>
          <label htmlFor="to" className="mb-1 text-[16px] font-medium">To</label>
          <TextField
            id="to"
            variant="outlined"
            size="small"
            value={selectedTo}
             onClick={handleToClick1}
            //  onClick={() => handleToOptionClick(location)}
            placeholder="Search Destination"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOnIcon />
                </InputAdornment>
              ),
            }}
            sx={{
               width: "100%",
             
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
                                <p className="text-center font-medium text-[20px] mt-[-20px]">To</p>
                            </div>
        
        
                        <TextField
                        id="to"
                        variant="outlined"
                        size="small"
                        //  onClick={}
                        value={selectedTo}
                        onChange={(e) => setSelectedTo(e.target.value)}
                        onClick={handleTextFieldClickOff}
                        placeholder="Search City or Airport "
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
     
        <Box sx={{ display: "flex", flexDirection: "column", marginBottom: "16px" }}>
              <label htmlFor="departure-date" className="mb-1 text-[16px] font-medium">Date</label>
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
                sx={{
                  width: "100%",
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

        
        <Box sx={{ display: "flex", flexDirection: "column", marginBottom: "16px" }}>
          <label htmlFor="passengers" className="mb-1 text-[16px] font-medium">Passengers</label>
          <TextField
            id="passengers"
            variant="outlined"
            size="small"
            placeholder="1 Passenger"
             value={passengerText}
            onClick={handlePassenger}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlineOutlinedIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              width: "100%",
             
              "& .MuiInputBase-root": { height: "44px", borderRadius:"8px", },
            }}
          />
        

            <Dialog
                              
                              open={Boolean(passengerAnchor)}
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
                  width: "100%",
                  "&::-webkit-scrollbar": { display: "none" },
                 scrollbarWidth: "none",
                }}
                  >

                <div className="absolute z-40 top-0 left-0 right-0 bg-white   border-gray-300 rounded-t-[10px] pl-6 pr-4 pb-3 pt-6">
                  <div className="flex items-center justify-center relative">
                  <IconButton sx={{ position: "absolute", left: "0px", top: "-5px" }} onClick={handleDone}>
                  <CloseOutlinedIcon className="w-[60px] h-[60px] p-[4px] font-bold bg-white border-[0.5px] border-[#EBECED] shadow-md rounded-[4px]" />
                </IconButton>
                    <p className="text-[20px] font-inter font-medium">Passenger</p>
                                   
                  </div>
                  </div>

                <div>
    
                  <div className="flex justify-between mb-3 mt-18">
                    <div>
                      <p className="text-[16px] text-[#181818] font-inter font-semibold">Adults</p>
                      <p className="text-[#818489] text-[14px] font-inter font-normal">Ages 16 and Above</p>
                    </div>
                    <div>
                      <div className="w-[95px] h-[30px] mt-1.5 rounded-[4px] border border-[#023E8A] flex justify-between gap-2 items-center px-2">
                        <RemoveOutlinedIcon
                          className="text-[#ACAEB3] cursor-pointer"
                          onClick={() => handleDecrement("adults")}
                        />
                        <div>{counts.adults}</div>
                        <AddOutlinedIcon
                          className="cursor-pointer"
                          onClick={() => handleIncrement("adults")}
                        />
                      </div>
                    </div>
                  </div>
                  <Divider sx={{ marginBottom: "20px" }} />

                  <div className="flex justify-between mb-3">
                    <div>
                      <p className="text-[16px] text-[#181818] font-inter font-semibold">Children</p>
                      <p className="text-[#818489] text-[14px] font-inter font-normal">Ages 3 - 15</p>
                    </div>
                    <div>
                      <div className="w-[95px] h-[30px] mt-1.5 rounded-[4px] border border-[#023E8A] flex justify-between gap-2 items-center px-2">
                        <RemoveOutlinedIcon
                          className="text-[#ACAEB3] cursor-pointer"
                          onClick={() => handleDecrement("children")}
                        />
                        <div>{counts.children}</div>
                        <AddOutlinedIcon
                          className="cursor-pointer"
                          onClick={() => handleIncrement("children")}
                        />
                      </div>
                    </div>
                  </div>
                  <Divider sx={{ marginBottom: " 20px" }} />

                  <div className="flex justify-between mb-3">
                    <div>
                      <p className="text-[16px] text-[#181818] font-inter font-semibold">Infant</p>
                      <p className="text-[#818489] text-[14px] font-inter font-normal">Ages 0 and 2</p>
                    </div>
                    <div>
                      <div className="w-[95px] h-[30px] mt-1.5 rounded-[4px] border border-[#023E8A] flex justify-between gap-2 items-center px-2">
                        <RemoveOutlinedIcon
                          className="text-[#ACAEB3] cursor-pointer"
                          onClick={() => handleDecrement("infants")}
                        />
                        <div>{counts.infants}</div>
                        <AddOutlinedIcon
                          className="cursor-pointer"
                          onClick={() => handleIncrement("infants")}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-16">
                  <button  onClick={handleDone} className="bg-[#023E8A] w-full h-[52px] text-white rounded-[6px] mt-[40px] font-infer text-[16px] cursor-pointer">Done</button>
                </div>
            </DialogContent>
            </Dialog>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", marginBottom: "40px" }}>
         <label htmlFor="class" className="mb-1 text-[16px] font-medium">Class</label>
          <TextField
            id="class"
            variant="outlined"
            size="small"
            placeholder="Economy"
            value={selectedClass}
            inputRef={anchorRef}
            onClick={() => setFlightClass(true)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FlightClassOutlinedIcon />
                </InputAdornment>
              ),
            }}
            sx={{
                width: "100%",
             
              "& .MuiInputBase-root": { height: "44px", borderRadius:"8px", },
            }}
          />


             <Dialog
                              
                              open={flightClass} 
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
                                  height:"40%",
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
                  width: "100%",
                  "&::-webkit-scrollbar": { display: "none" },
                 scrollbarWidth: "none",
                }}>


                <div className="absolute z-40 top-0 left-0 right-0 bg-white   border-gray-300 rounded-t-[10px] pl-6 pr-4 pb-3 pt-6">
                  <div className="flex items-center justify-center relative">
                  <IconButton sx={{ position: "absolute", left: "0px", top: "-5px" }} onClick={() => setFlightClass(false)}>
                  <CloseOutlinedIcon className="w-[60px] h-[60px] p-[4px] font-bold bg-white border-[0.5px] border-[#EBECED] shadow-md rounded-[4px]" />
                </IconButton>
                    <p className="text-[20px] font-inter font-medium">Class</p>
                                   
                  </div>
                  </div>

             <div className="w-full mt-10 pt-4 pb-4">
              <RadioGroup
                aria-labelledby="flight-class-group"
                name="flight-class"
                value={selectedClass}
                
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                }}
              >
                <FormControlLabel value="Economy" control={<Radio />} label="Economy" className="" />

                <FormControlLabel value="Business" control={<Radio />} label="Business" className="" />

                <FormControlLabel value="First Class" control={<Radio />} label="First Class" className="" />
              </RadioGroup>
            </div>

               <div className="mt-4">
                  <button  onClick={() => setFlightClass(false)} className="bg-[#023E8A] w-full h-[52px] text-white rounded-[6px] mt-[40px] font-infer text-[16px] cursor-pointer">Done</button>
                </div>

             </DialogContent>
            </Dialog>
       </Box>


          <div onClick={handleSearchOneTrip}  className="bg-[#023E8A] h-[52px] w-full text-center text-white font-inter text-base rounded-[8px] pt-[14px] mt-[18px] cursor-pointer">
            <button>Search</button>
          </div>
            </Box>
          ) : (

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2}}>
        
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <label htmlFor="from" className="mb-1">From</label>
          <TextField
            id="from"
            variant="outlined"
            size="small"
            placeholder="Search Destination"
           
            value={selectedFrom}
             onClick={handleFromClick1}
            // onClick={() => handleFromOptionClick(location)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOnIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              width: "200px",
             
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
          <label htmlFor="to" className="mb-1">To</label>
          <TextField
            id="to"
            variant="outlined"
            size="small"
            value={selectedTo}
             onClick={handleToClick1}
            //  onClick={() => handleToOptionClick(location)}
            placeholder="Search Destination"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOnIcon />
                </InputAdornment>
              ),
            }}
            sx={{
               width: "200px",
             
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
                sx={{
                  width: "200px",
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

        
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <label htmlFor="passengers" className="mb-1">Passengers</label>
          <TextField
            id="passengers"
            variant="outlined"
            size="small"
            placeholder="1 Passenger"
             value={passengerText}
            onClick={handlePassenger}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlineOutlinedIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              width: "200px",
             
              "& .MuiInputBase-root": { height: "44px", borderRadius:"8px", },
            }}
          />
        


        <Popper
            open={Boolean(passengerAnchor)}
            anchorEl={passengerAnchor}
            placement="bottom-start"
            modifiers={[
              {
                name: "preventOverflow",
                options: {
                  boundary: "window",
                },
              },
            ]}
          >
            <ClickAwayListener onClickAway={() => setPassengerAnchor(null)}>
              <Paper
                elevation={3}
                sx={{
                  width: "376px",
                  borderRadius: "6px",
                  backgroundColor: "white",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  padding: "16px",
                }}
              >

                <div>
    
                  <div className="flex justify-between mb-3">
                    <div>
                      <p className="text-[16px] text-[#181818] font-inter font-semibold">Adults</p>
                      <p className="text-[#818489] text-[14px] font-inter font-normal">Ages 16 and Above</p>
                    </div>
                    <div>
                      <div className="w-[95px] h-[30px] mt-1.5 rounded-[4px] border border-[#023E8A] flex justify-between gap-2 items-center px-2">
                        <RemoveOutlinedIcon
                          className="text-[#ACAEB3] cursor-pointer"
                          onClick={() => handleDecrement("adults")}
                        />
                        <div>{counts.adults}</div>
                        <AddOutlinedIcon
                          className="cursor-pointer"
                          onClick={() => handleIncrement("adults")}
                        />
                      </div>
                    </div>
                  </div>
                  <Divider sx={{ marginBottom: "8px" }} />

                  <div className="flex justify-between mb-3">
                    <div>
                      <p className="text-[16px] text-[#181818] font-inter font-semibold">Children</p>
                      <p className="text-[#818489] text-[14px] font-inter font-normal">Ages 3 - 15</p>
                    </div>
                    <div>
                      <div className="w-[95px] h-[30px] mt-1.5 rounded-[4px] border border-[#023E8A] flex justify-between gap-2 items-center px-2">
                        <RemoveOutlinedIcon
                          className="text-[#ACAEB3] cursor-pointer"
                          onClick={() => handleDecrement("children")}
                        />
                        <div>{counts.children}</div>
                        <AddOutlinedIcon
                          className="cursor-pointer"
                          onClick={() => handleIncrement("children")}
                        />
                      </div>
                    </div>
                  </div>
                  <Divider sx={{ marginBottom: "8px" }} />

                  <div className="flex justify-between mb-3">
                    <div>
                      <p className="text-[16px] text-[#181818] font-inter font-semibold">Infant</p>
                      <p className="text-[#818489] text-[14px] font-inter font-normal">Ages 0 and 2</p>
                    </div>
                    <div>
                      <div className="w-[95px] h-[30px] mt-1.5 rounded-[4px] border border-[#023E8A] flex justify-between gap-2 items-center px-2">
                        <RemoveOutlinedIcon
                          className="text-[#ACAEB3] cursor-pointer"
                          onClick={() => handleDecrement("infants")}
                        />
                        <div>{counts.infants}</div>
                        <AddOutlinedIcon
                          className="cursor-pointer"
                          onClick={() => handleIncrement("infants")}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <button  onClick={handleDone} className="bg-[#023E8A] w-full h-[52px] text-white rounded-[6px] mt-[40px] font-infer text-[16px] cursor-pointer">Done</button>
                </div>

              </Paper>
            </ClickAwayListener>
          </Popper>


        </Box>

        <Box sx={{ display: "flex", flexDirection: "column" }}>
         <label htmlFor="class" className="mb-1">Class</label>
          <TextField
            id="class"
            variant="outlined"
            size="small"
            placeholder="Economy"
            value={selectedClass}
            inputRef={anchorRef}
            onClick={() => setFlightClass(true)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FlightClassOutlinedIcon />
                </InputAdornment>
              ),
            }}
            sx={{
                width: "200px",
             
              "& .MuiInputBase-root": { height: "44px", borderRadius:"8px", },
            }}
          />

      <Popper open={flightClass} anchorEl={anchorRef.current} placement="bottom-start">
        <ClickAwayListener onClickAway={() => setFlightClass(false)}>
          <Paper
            elevation={3}
            sx={{
              width: "317px",
              position:"relative",
              left:"-43px",
              top:"6px",
              height:"100%",
              borderRadius: "6px",
              backgroundColor: "white",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            
            }}
          >

             <div className="w-full pt-4 pb-4">
              <RadioGroup
                aria-labelledby="flight-class-group"
                name="flight-class"
                value={selectedClass}
                
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  setFlightClass(false); 
                }}
              >
                <FormControlLabel value="Economy" control={<Radio />} label="Economy" className="pl-10" />
                <Divider sx={{ marginTop: "16px", marginBottom: "16px" }} />

                <FormControlLabel value="Business" control={<Radio />} label="Business" className="pl-10" />
                <Divider sx={{ marginTop: "16px", marginBottom: "16px" }} />

                <FormControlLabel value="First Class" control={<Radio />} label="First Class" className="pl-10" />
              </RadioGroup>
            </div>
          </Paper>
        </ClickAwayListener>
      </Popper>
       </Box>


          <div onClick={handleSearchOneTrip}  className="bg-[#023E8A] h-[52px] w-[138px] text-center text-white font-inter text-base rounded-[8px] pt-[14px] mt-[18px] cursor-pointer">
            <button>Search</button>
          </div>
            </Box>
        )}

      </div>
    )}


      {selectedValue === "multi-city" &&(
<div>

  {isMobile ? (

     <div>
    

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, marginTop:"-10px", width:"100%" }}>


          <Box sx={{ display: "flex", flexDirection: "column", width:"100%", marginBottom: '-8px' }}>
            <label htmlFor="passengers" className="mb-1">Passengers</label>
            <TextField
              id="passengers"
              variant="outlined"
              size="small"
              placeholder="1 Passenger"
              value={passengerText}
              onClick={handlePassenger}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineOutlinedIcon />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: "100%",

                "& .MuiInputBase-root": { height: "44px", borderRadius: "8px", },
              }} />



            <Dialog
                              
                              open={Boolean(passengerAnchor)}
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
                  width: "100%",
                  "&::-webkit-scrollbar": { display: "none" },
                 scrollbarWidth: "none",
                }}
                  >

                  <div className="absolute z-40 top-0 left-0 right-0 bg-white   border-gray-300 rounded-t-[10px] pl-6 pr-4 pb-3 pt-6">
                  <div className="flex items-center justify-center relative">
                  <IconButton sx={{ position: "absolute", left: "0px", top: "-5px" }} onClick={handleDone}>
                  <CloseOutlinedIcon className="w-[60px] h-[60px] p-[4px] font-bold bg-white border-[0.5px] border-[#EBECED] shadow-md rounded-[4px]" />
                </IconButton>
                    <p className="text-[20px] font-inter font-medium">Passenger</p>
                                   
                  </div>
                  </div>
                  <div>

                    <div className="flex justify-between mb-3 mt-18">
                      <div>
                        <p className="text-[16px] text-[#181818] font-inter font-semibold">Adults</p>
                        <p className="text-[#818489] text-[14px] font-inter font-normal">Ages 16 and Above</p>
                      </div>
                      <div>
                        <div className="w-[95px] h-[30px] mt-1.5 rounded-[4px] border border-[#023E8A] flex justify-between gap-2 items-center px-2">
                          <RemoveOutlinedIcon
                            className="text-[#ACAEB3] cursor-pointer"
                            onClick={() => handleDecrement("adults")} />
                          <div>{counts.adults}</div>
                          <AddOutlinedIcon
                            className="cursor-pointer"
                            onClick={() => handleIncrement("adults")} />
                        </div>
                      </div>
                    </div>
                    <Divider sx={{ marginBottom: "8px" }} />

                    <div className="flex justify-between mb-3">
                      <div>
                        <p className="text-[16px] text-[#181818] font-inter font-semibold">Children</p>
                        <p className="text-[#818489] text-[14px] font-inter font-normal">Ages 3 - 15</p>
                      </div>
                      <div>
                        <div className="w-[95px] h-[30px] mt-1.5 rounded-[4px] border border-[#023E8A] flex justify-between gap-2 items-center px-2">
                          <RemoveOutlinedIcon
                            className="text-[#ACAEB3] cursor-pointer"
                            onClick={() => handleDecrement("children")} />
                          <div>{counts.children}</div>
                          <AddOutlinedIcon
                            className="cursor-pointer"
                            onClick={() => handleIncrement("children")} />
                        </div>
                      </div>
                    </div>
                    <Divider sx={{ marginBottom: "8px" }} />

                    <div className="flex justify-between mb-3">
                      <div>
                        <p className="text-[16px] text-[#181818] font-inter font-semibold">Infant</p>
                        <p className="text-[#818489] text-[14px] font-inter font-normal">Ages 0 and 2</p>
                      </div>
                      <div>
                        <div className="w-[95px] h-[30px] mt-1.5 rounded-[4px] border border-[#023E8A] flex justify-between gap-2 items-center px-2">
                          <RemoveOutlinedIcon
                            className="text-[#ACAEB3] cursor-pointer"
                            onClick={() => handleDecrement("infants")} />
                          <div>{counts.infants}</div>
                          <AddOutlinedIcon
                            className="cursor-pointer"
                            onClick={() => handleIncrement("infants")} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div  className="mt-16">
                    <button onClick={handleDone} className="bg-[#023E8A] w-full h-[52px] text-white rounded-[6px] mt-[40px] font-infer text-[16px] cursor-pointer">Done</button>
                  </div>
            </DialogContent>
            </Dialog>


          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", width:"100%" }}>
            <label htmlFor="class" className="mb-1">Class</label>
            <TextField
              id="class"
              variant="outlined"
              size="small"
              placeholder="Economy"
              value={selectedClass}
              inputRef={anchorRef}
              onClick={() => setFlightClass(true)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FlightClassOutlinedIcon />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: "100%",

                "& .MuiInputBase-root": { height: "44px", borderRadius: "8px", },
              }} />
                
            <Dialog
                              
                              open={flightClass} 
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
                                  height:"40%",
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
                  width: "100%",
                  "&::-webkit-scrollbar": { display: "none" },
                 scrollbarWidth: "none",
                }}>


                <div className="absolute z-40 top-0 left-0 right-0 bg-white   border-gray-300 rounded-t-[10px] pl-6 pr-4 pb-3 pt-6">
                  <div className="flex items-center justify-center relative">
                  <IconButton sx={{ position: "absolute", left: "0px", top: "-5px" }} onClick={() => setFlightClass(false)}>
                  <CloseOutlinedIcon className="w-[60px] h-[60px] p-[4px] font-bold bg-white border-[0.5px] border-[#EBECED] shadow-md rounded-[4px]" />
                </IconButton>
                    <p className="text-[20px] font-inter font-medium">Class</p>
                                   
                  </div>
                  </div>

             <div className="w-full mt-10 pt-4 pb-4">
              <RadioGroup
                aria-labelledby="flight-class-group"
                name="flight-class"
                value={selectedClass}
                
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                }}
              >
                <FormControlLabel value="Economy" control={<Radio />} label="Economy" className="" />

                <FormControlLabel value="Business" control={<Radio />} label="Business" className="" />

                <FormControlLabel value="First Class" control={<Radio />} label="First Class" className="" />
              </RadioGroup>
            </div>

               <div className="mt-4">
                  <button  onClick={() => setFlightClass(false)} className="bg-[#023E8A] w-full h-[52px] text-white rounded-[6px] mt-[40px] font-infer text-[16px] cursor-pointer">Done</button>
                </div>

             </DialogContent>
            </Dialog>
          </Box>

      </Box>

        <div className="mt-[16px]">
       <div>
        {flights.map((flight, index) => (
        <div key={flight.id}>
          <label htmlFor={`from-${index + 1}`} className="text-[#67696D]">
            Flight {index + 1}
          </label>
          <Box sx={{ marginBottom: '16px' }}>

            <Box sx={{ display: 'flex', flexDirection: 'column', width:"100%", marginBottom: '16px', marginTop: '16px' }}>
              <label htmlFor={`from-${index + 1}`} className="mb-1">
                From
              </label>
              <TextField
                id={`from-${index + 1}`}
                variant="outlined"
                size="small"
                placeholder="Search Destination"
                value={flight.from}
                onChange={(e) => handleInputChange(flight.id, 'from', e.target.value)}
                onClick={(e) => handleFromClick(e, flight.id)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width:"100%",
                  '& .MuiInputBase-root': { height: '44px', borderRadius: '8px' },
                }}
              />

               <Dialog
                       open={openFrom && FromId === flight.id} 
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
                               <p className="text-center font-medium text-[20px] mt-[-20px]">From</p>
                               </div>
       
       
                                 <TextField
                                 id="from"
                                 variant="outlined"
                                 size="small"
                                 placeholder="Search City or Airport"
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
                                       onClick={() => handleDepartureSelectionFrom(flight.id, location)}
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
       
                                   {/* {index !== locations.length - 1 && (
                                     <Divider sx={{ marginTop: "15px" }} />
                                   )} */}
                                   {index !== locations.length - 1 && <Divider sx={{ marginTop: "15px" }} />}
                                 </React.Fragment>
                               ))
                             ))}       
           
                       </DialogContent>
              </Dialog>


            </Box>


            
            <Box sx={{ display: 'flex', flexDirection: 'column', width:"100%", marginBottom: '16px' }}>
              <label htmlFor={`to-${index + 1}`} className="mb-1">
                To
              </label>
              <TextField
                id={`to-${index + 1}`}
                variant="outlined"
                size="small"
                value={flight.to}
                onChange={(e) => handleInputChange(flight.id, 'to', e.target.value)}
                onClick={(e) => handleToClick(e, flight.id)}
                placeholder="Search Destination"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: "100%",
                  '& .MuiInputBase-root': { height: '44px', borderRadius: '8px' },
                }}
              />
              
              {/* <Popper id="from-popper"  open={openTo && ToId === flight.id} anchorEl={ToClick} placement="bottom-start">
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
                            <div className="flex gap-[8px]" onClick={() => handleDestinationSelectionTo(flight.id, location)}>
                              <div className="h-[28px] w-[28px] rounded-[4px] border border-[#FF6F1E] bg-[#FF6F1E0A] text-center">
                                <RoomOutlinedIcon className="text-[#FF6F1E]" sx={{ fontSize: "16px" }} />
                              </div>
                              <p>{location}</p>
                            </div>


                            <CloseOutlinedIcon
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveOption(location);
                              } }
                              className="cursor-pointer"
                              sx={{ color: "gray" }} />
                          </div>

                          {index !== locations.length - 1 && <Divider sx={{ marginTop: "15px" }} />}
                        </React.Fragment>
                      ))
                    )}

                  </Paper>
                </ClickAwayListener>
              </Popper> */}

              <Dialog
                        open={openTo && ToId === flight.id}
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
                                <p className="text-center font-medium text-[20px] mt-[-20px]">To</p>
                            </div>
        
        
                        <TextField
                        id="to"
                        variant="outlined"
                        size="small"
                        //  onClick={}
                        value={selectedTo}
                        onChange={(e) => setSelectedTo(e.target.value)}
                        onClick={handleTextFieldClickOff}
                        placeholder="Search City or Airport "
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
                                        onClick={() => handleDestinationSelectionTo(flight.id, location)}
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


            <Box sx={{ display: 'flex', flexDirection: 'column', width:"100%", marginBottom: '16px' }}>
           <label htmlFor={`date-${index + 1}`} className="mb-1">
                  Date
              </label>
              <TextField
                id={`date-${index + 1}`}
                variant="outlined"
                size="small"
                value={flight.date}
                onClick={(e) => handleClickDate(e, flight.id)}
                placeholder="Select Date"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarMonthOutlinedIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: "100%",
                  '& .MuiInputBase-root': { height: '44px', borderRadius: '8px' },
                }}
              />
          

                {/* <Popper id={id} open={opened && dateId === flight.id} anchorEl={anchorEl} placement="bottom-start">
    <ClickAwayListener onClickAway={handleCloseDate}>
      <Paper
        elevation={3}
        sx={{
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: "20px",
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
            months={2}
            direction="horizontal"
            showDateDisplay={false}
            className="w-full h-full"
          />
          <div className="w-[96%] m-auto">
            <button
              className="w-full h-[52px] rounded-[4px] font-inter text-[14px] cursor-pointer"
              style={{
                backgroundColor: "#023E8A",
                color: "white",
                marginTop: 2,
              }}
              onClick={handleSelectDateFunc}
            >
              Select Date
            </button>
          </div>
        </div>
      </Paper>
    </ClickAwayListener>
              </Popper> */}

              <Dialog
                              open={opened && dateId === flight.id}
                              TransitionComponent={Transition}
                              keepMounted
                              fullScreen
                              onClose={handleCloseDate}
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
                                      <IconButton sx={{ position: "absolute", left: "28px", top: "15px" }} className="w-[40px] h-[40px] p-[8px] "   onClick={handleCloseDate}>
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
                                          onClick={handleSelectDateFunc}
                                        >
                                          Select Dates
                                        </button>
                                      </div>
              
              
                                      </div>
                  
                                  </DialogContent>
            </Dialog>
            </Box>
         

             
            <div>
            {index > 1 && (
            <IconButton onClick={() => removeFlight(flight.id)} sx={{display: "flex", color:"#023E8A", gap:"4px", marginTop:"20px", fontSize:"14px"}}>
            <CloseOutlinedIcon />
              <p>Remove</p>
            </IconButton>
            )}
                            </div>

          </Box>
        </div>
      ))}
           <div className="flex justify-end">
                    <div className="flex mt-[10px] text-[#023E8A] cursor-pointer" onClick={addFlight}>
                          <AddOutlinedIcon />
                          <p>Add Flight</p>
                      </div>
           </div>
                  
                    <div className="bg-[#023E8A] h-[45px] w-[100%] text-center text-white font-inter text-base rounded-[8px] pt-[10px] mt-[3rem]">
                      <button onClick={handleSearchMultiTrip} >Search</button>
                    </div>
              
       
      </div>       
        </div>



  </div>

      ) : (

        // web view

      <div>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, marginTop:"-10px" }}>


          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <label htmlFor="passengers" className="mb-1">Passengers</label>
            <TextField
              id="passengers"
              variant="outlined"
              size="small"
              placeholder="1 Passenger"
              value={passengerText}
              onClick={handlePassenger}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineOutlinedIcon />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: "42vw",

                "& .MuiInputBase-root": { height: "44px", borderRadius: "8px", },
              }} />



            <Popper
              open={Boolean(passengerAnchor)}
              anchorEl={passengerAnchor}
              placement="bottom-start"
              modifiers={[
                {
                  name: "preventOverflow",
                  options: {
                    boundary: "window",
                  },
                },
              ]}
            >
              <ClickAwayListener onClickAway={() => setPassengerAnchor(null)}>
                <Paper
                  elevation={3}
                  sx={{
                    width: "376px",
                    borderRadius: "6px",
                    backgroundColor: "white",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    padding: "16px",
                  }}
                >

                  <div>

                    <div className="flex justify-between mb-3">
                      <div>
                        <p className="text-[16px] text-[#181818] font-inter font-semibold">Adults</p>
                        <p className="text-[#818489] text-[14px] font-inter font-normal">Ages 16 and Above</p>
                      </div>
                      <div>
                        <div className="w-[95px] h-[30px] mt-1.5 rounded-[4px] border border-[#023E8A] flex justify-between gap-2 items-center px-2">
                          <RemoveOutlinedIcon
                            className="text-[#ACAEB3] cursor-pointer"
                            onClick={() => handleDecrement("adults")} />
                          <div>{counts.adults}</div>
                          <AddOutlinedIcon
                            className="cursor-pointer"
                            onClick={() => handleIncrement("adults")} />
                        </div>
                      </div>
                    </div>
                    <Divider sx={{ marginBottom: "8px" }} />

                    <div className="flex justify-between mb-3">
                      <div>
                        <p className="text-[16px] text-[#181818] font-inter font-semibold">Children</p>
                        <p className="text-[#818489] text-[14px] font-inter font-normal">Ages 3 - 15</p>
                      </div>
                      <div>
                        <div className="w-[95px] h-[30px] mt-1.5 rounded-[4px] border border-[#023E8A] flex justify-between gap-2 items-center px-2">
                          <RemoveOutlinedIcon
                            className="text-[#ACAEB3] cursor-pointer"
                            onClick={() => handleDecrement("children")} />
                          <div>{counts.children}</div>
                          <AddOutlinedIcon
                            className="cursor-pointer"
                            onClick={() => handleIncrement("children")} />
                        </div>
                      </div>
                    </div>
                    <Divider sx={{ marginBottom: "8px" }} />

                    <div className="flex justify-between mb-3">
                      <div>
                        <p className="text-[16px] text-[#181818] font-inter font-semibold">Infant</p>
                        <p className="text-[#818489] text-[14px] font-inter font-normal">Ages 0 and 2</p>
                      </div>
                      <div>
                        <div className="w-[95px] h-[30px] mt-1.5 rounded-[4px] border border-[#023E8A] flex justify-between gap-2 items-center px-2">
                          <RemoveOutlinedIcon
                            className="text-[#ACAEB3] cursor-pointer"
                            onClick={() => handleDecrement("infants")} />
                          <div>{counts.infants}</div>
                          <AddOutlinedIcon
                            className="cursor-pointer"
                            onClick={() => handleIncrement("infants")} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <button onClick={handleDone} className="bg-[#023E8A] w-full h-[52px] text-white rounded-[6px] mt-[40px] font-infer text-[16px] cursor-pointer">Done</button>
                  </div>

                </Paper>
              </ClickAwayListener>
            </Popper>


          </Box>

          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <label htmlFor="class" className="mb-1">Class</label>
            <TextField
              id="class"
              variant="outlined"
              size="small"
              placeholder="Economy"
              value={selectedClass}
              inputRef={anchorRef}
              onClick={() => setFlightClass(true)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FlightClassOutlinedIcon />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: "42vw",

                "& .MuiInputBase-root": { height: "44px", borderRadius: "8px", },
              }} />

            <Popper open={flightClass} anchorEl={anchorRef.current} placement="bottom-start">
              <ClickAwayListener onClickAway={() => setFlightClass(false)}>
                <Paper
                  elevation={3}
                  sx={{
                    width: "317px",
                    position: "relative",
                    left: "-43px",
                    top: "6px",
                    height: "100%",
                    borderRadius: "6px",
                    backgroundColor: "white",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  }}
                >

                  <div className="w-full pt-4 pb-4">
                    <RadioGroup
                      aria-labelledby="flight-class-group"
                      name="flight-class"
                      value={selectedClass}

                      onChange={(e) => {
                        setSelectedClass(e.target.value);
                        setFlightClass(false);
                      } }
                    >
                      <FormControlLabel value="Economy" control={<Radio />} label="Economy" className="pl-10" />
                      <Divider sx={{ marginTop: "16px", marginBottom: "16px" }} />

                      <FormControlLabel value="Business" control={<Radio />} label="Business" className="pl-10" />
                      <Divider sx={{ marginTop: "16px", marginBottom: "16px" }} />

                      <FormControlLabel value="First Class" control={<Radio />} label="First Class" className="pl-10" />
                    </RadioGroup>
                  </div>
                </Paper>
              </ClickAwayListener>
            </Popper>
          </Box>

      </Box>

        <div className="mt-[16px]">
       <div>
        {flights.map((flight, index) => (
        <div key={flight.id}>
          <label htmlFor={`from-${index + 1}`} className="text-[#67696D]">
            Flight {index + 1}
          </label>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: '16px' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <label htmlFor={`from-${index + 1}`} className="mb-1">
                From
              </label>
              <TextField
                id={`from-${index + 1}`}
                variant="outlined"
                size="small"
                placeholder="Search Destination"
                value={flight.from}
                onChange={(e) => handleInputChange(flight.id, 'from', e.target.value)}
                onClick={(e) => handleFromClick(e, flight.id)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: index < 2 ? '26.9vw' : '24.5vw',
                  '& .MuiInputBase-root': { height: '44px', borderRadius: '8px' },
                }}
              />

                <Popper id="from-popper" open={openFrom && FromId === flight.id} anchorEl={FromClick} placement="bottom-start">
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
                            <div className="flex gap-[8px]" onClick={() => handleDepartureSelectionFrom(flight.id, location)}>
                              <div className="h-[28px] w-[28px] rounded-[4px] border border-[#FF6F1E] bg-[#FF6F1E0A] text-center">
                                <RoomOutlinedIcon className="text-[#FF6F1E]" sx={{ fontSize: "16px" }} />
                              </div>
                              <p>{location}</p>
                            </div>


                            <CloseOutlinedIcon
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveOption(location);
                              } }
                              className="cursor-pointer"
                              sx={{ color: "gray" }} />
                          </div>

                          {index !== locations.length - 1 && <Divider sx={{ marginTop: "15px" }} />}
                        </React.Fragment>
                      ))
                    )}

                  </Paper>
                </ClickAwayListener>
              </Popper>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <label htmlFor={`to-${index + 1}`} className="mb-1">
                To
              </label>
              <TextField
                id={`to-${index + 1}`}
                variant="outlined"
                size="small"
                value={flight.to}
                onChange={(e) => handleInputChange(flight.id, 'to', e.target.value)}
                onClick={(e) => handleToClick(e, flight.id)}
                placeholder="Search Destination"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: index < 2 ? '26.9vw' : '24.5vw',
                  '& .MuiInputBase-root': { height: '44px', borderRadius: '8px' },
                }}
              />
              
              <Popper id="from-popper"  open={openTo && ToId === flight.id} anchorEl={ToClick} placement="bottom-start">
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
                            <div className="flex gap-[8px]" onClick={() => handleDestinationSelectionTo(flight.id, location)}>
                              <div className="h-[28px] w-[28px] rounded-[4px] border border-[#FF6F1E] bg-[#FF6F1E0A] text-center">
                                <RoomOutlinedIcon className="text-[#FF6F1E]" sx={{ fontSize: "16px" }} />
                              </div>
                              <p>{location}</p>
                            </div>


                            <CloseOutlinedIcon
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveOption(location);
                              } }
                              className="cursor-pointer"
                              sx={{ color: "gray" }} />
                          </div>

                          {index !== locations.length - 1 && <Divider sx={{ marginTop: "15px" }} />}
                        </React.Fragment>
                      ))
                    )}

                  </Paper>
                </ClickAwayListener>
              </Popper>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
           <label htmlFor={`date-${index + 1}`} className="mb-1">
                  Date
              </label>
              <TextField
                id={`date-${index + 1}`}
                variant="outlined"
                size="small"
                value={flight.date}
                onClick={(e) => handleClickDate(e, flight.id)}
                placeholder="Select Date"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarMonthOutlinedIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: index < 2 ? '26.9vw' : '24.5vw',
                  '& .MuiInputBase-root': { height: '44px', borderRadius: '8px' },
                }}
              />
          

                <Popper id={id} open={opened && dateId === flight.id} anchorEl={anchorEl} placement="bottom-start">
    <ClickAwayListener onClickAway={handleCloseDate}>
      <Paper
        elevation={3}
        sx={{
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: "20px",
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
            months={2}
            direction="horizontal"
            showDateDisplay={false}
            className="w-full h-full"
          />
          <div className="w-[96%] m-auto">
            <button
              className="w-full h-[52px] rounded-[4px] font-inter text-[14px] cursor-pointer"
              style={{
                backgroundColor: "#023E8A",
                color: "white",
                marginTop: 2,
              }}
              onClick={handleSelectDateFunc}
            >
              Select Date
            </button>
          </div>
        </div>
      </Paper>
    </ClickAwayListener>
              </Popper>
            </Box>
         

             
            <div>
            {index > 1 && (
            <IconButton onClick={() => removeFlight(flight.id)} sx={{display: "flex", color:"#023E8A", gap:"4px", marginTop:"20px", fontSize:"14px"}}>
            <CloseOutlinedIcon />
              <p>Remove</p>
            </IconButton>
            )}
                            </div>

          </Box>
        </div>
      ))}
           <div className="flex justify-between">
                    <div className="flex mt-[28px] text-[#023E8A] cursor-pointer" onClick={addFlight}>
                          <AddOutlinedIcon />
                          <p>Add Flight</p>
                      </div>
          
                  
                    <div className="bg-[#023E8A] h-[45px] w-[130px] text-center text-white font-inter text-base rounded-[8px] pt-[10px] mt-[18px]">
                      <button onClick={handleSearchMultiTrip} >Search</button>
                    </div>
              
        </div>
      </div>       
        </div>
          
      </div>

    )}
      </div>

      )}
      


    </FormControl>
  );
};

export default RoundTrip;
