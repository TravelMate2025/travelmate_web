import Navbar from '../../homePage/Navbar'
import React, { useState, useRef, useEffect, useMemo } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
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
import { Divider, IconButton, MenuItem, Select } from "@mui/material";
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Link } from "react-router-dom";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import TravelmateApp from '../../homePage/TravelmateApp';
import Footer from '../../homePage/Footer';
import airlogo from "../../../assets/airlogo.svg"
import CircleIcon from '@mui/icons-material/Circle';
import Line from "../../../assets/Line.svg"
import { Stack, Pagination, Dialog, DialogContent } from '@mui/material';
import { useLocation } from 'react-router-dom';
import TuneIcon from '@mui/icons-material/Tune';
import SortIcon from '@mui/icons-material/Sort';
import line2 from "../../../assets/line2.svg";
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LuggageOutlinedIcon from '@mui/icons-material/LuggageOutlined';
import AirlineSeatReclineExtraOutlinedIcon from '@mui/icons-material/AirlineSeatReclineExtraOutlined';

interface DateRangeType {
  startDate: Date;
  endDate: Date;
  key: string;
}

interface Departure {
  id: number;
  planeName: string;
  image: string;
  spaceleft: string;
  class: string;
  timefrom: string;
  placefrom: string;
  timelong: string;
  non: string;
  flightcode: string;
  timeto: string;
  placeto: string;
  refundable: string;
  price: string;
  passenger: string;
  tax: string;
}

interface DepartureListProps {
  departureInfo: Departure[];
}


const ReturnPage: React.FC<DepartureListProps> = () => {

          const [selectedValue] = useState<string>("round-trip");
      const [dateRange, setDateRange] = useState<DateRangeType[]>([
        {
          startDate: new Date(),
          endDate: addDays(new Date(), 7),
          key: "selection",
        },
      ]);
      const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    
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


    const location = useLocation();

    console.log("Location state:", location.state);


    const { from: initialFrom, to: initialTo, departureDate: initialDepart,  passengers: initialPassenger, flightClass: initialFlight } = location.state || {};
    const [from, setFrom] = useState(initialFrom || "");
     const [to, setTo] = useState<string>(initialTo || "");
    const [departureDate, setDepartureDate] = useState(initialDepart || "");
    const [passengers, setPassengers] = useState(initialPassenger || "");
     const [selectedClass, setSelectedClass] = useState(initialFlight || "");
    const [flightClasses, setFlightClasses] = useState(false);
    const anchorRef = useRef(null);

    useEffect(() => {
        if (initialFlight) {
        setSelectedClass(initialFlight);
        }
    }, [initialFlight]);
    

    const [openFrom, setOpenFrom] = useState(false);
    const [FromClick, setFromClick] = useState<HTMLElement | null>(null);
         const [openTo, setOpenTo] = useState(false);
         const [ToClick, setToClick] = useState<HTMLElement | null>(null);
      
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

    const handleOptionClick = (selectedLocation: string, isFrom: boolean) => {
    if (isFrom) {
        setFrom(selectedLocation);
        setOpenFrom(false);
    } else {
        setTo(selectedLocation);
        setOpenTo(false);
    }
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
    
    const handleSelectDate = () => {
  const formattedDate =
    selectedValue === "one-way"
      ? format(dateRange[0].startDate, "dd MMM yyyy")
      : `${format(dateRange[0].startDate, "dd MMM yyyy")} - ${format(dateRange[0].endDate, "dd MMM yyyy")}`;

        setDepartureDate(formattedDate);
        handleClose();
        };

    
    const [counts, setCounts] = useState({ adults: 1, children: 0, infants: 0 });

    const handleIncrement = (type: keyof typeof counts) => {
    setCounts((prevCounts) => ({
        ...prevCounts,
        [type]: prevCounts[type] + 1,
    }));
    };

        const handleDecrement = (type: keyof typeof counts) => {
        setCounts((prevCounts) => ({
            ...prevCounts,
            [type]: prevCounts[type] > 0 ? prevCounts[type] - 1 : 0,
        }));
        };

        const handleDone = () => {
        const totalPassengers = `${counts.adults + counts.children + counts.infants} Passengers`;
        setPassengers(totalPassengers);
        setPassengerAnchor(null);
        };


        const departureInfo = [
            {
                id: 1,
                image: airlogo,
                planeName: "Air Peace",
                spaceleft: "3 Left",
                class: "Economy",
                timefrom: "2:00pm",
                timeto: "4:00pm",
                timelong:"2hrs",
                non:"Non Stop",
                placefrom:"Lagos (LOS)",
                placeto:"Abuja (ABV)",
                refundable:"Non Refundable",
                flightcode:"W3-720",
                price:"₦50,000 /",
                passenger:"Passenger",
                tax:"Includes taxes & Fees",
                line: Line

            },

            {
                id: 2,
                image: airlogo,
                planeName: "Arik Air",
                spaceleft: "3 Left",
                class: "Economy",
                timefrom: "2:00pm",
                timeto: "4:00pm",
                timelong:"2hrs",
                non:"1 Stop",
                placefrom:"Lagos (LOS)",
                placeto:"Abuja (ABV)",
                refundable:"Non Refundable",
                flightcode:"W3-720",
                price:"₦700,000 /",
                passenger:"Passenger",
                tax:"Includes taxes & Fees",
                line: Line

            },

            {
                id: 3,
                image: airlogo,
                planeName: "Value Jet",
                spaceleft: "3 Left",
                class: "Economy",
                timefrom: "2:00pm",
                timeto: "4:00pm",
                timelong:"2hrs",
                non:"1+ Stop",
                placefrom:"Lagos (LOS)",
                placeto:"Abuja (ABV)",
                refundable:"Non Refundable",
                flightcode:"W3-720",
                price:"₦500,000 /",
                passenger:"Passenger",
                tax:"Includes taxes & Fees",
                line: Line

            },

            {
                id: 4,
                image: airlogo,
                planeName: "United Nigeria",
                spaceleft: "3 Left",
                class: "Economy",
                timefrom: "2:00pm",
                timeto: "4:00pm",
                timelong:"2hrs",
                non:"1 Stop",
                placefrom:"Lagos (LOS)",
                placeto:"Abuja (ABV)",
                refundable:"Non Refundable",
                flightcode:"W3-720",
                price:"₦1,000,000 /",
                passenger:"Passenger",
                tax:"Includes taxes & Fees",
                line: Line

            },

            {
                id: 5,
                image: airlogo,
                planeName: "Aero",
                spaceleft: "3 Left",
                class: "Economy",
                timefrom: "2:00pm",
                timeto: "4:00pm",
                timelong:"2hrs",
                non:"Non Stop",
                placefrom:"Lagos (LOS)",
                placeto:"Abuja (ABV)",
                refundable:"Refundable",
                flightcode:"W3-720",
                price:"₦50,000 /",
                passenger:"Passenger",
                tax:"Includes taxes & Fees",
                line: Line

            }
        ]


 const [page, setPage] = useState<number>(1);
  const [selectedDeparture, setSelectedDeparture] = useState<Departure | null>(null);
  const [openClick, setOpenClick] = useState<boolean>(false);

  const handleOpen = (depart: Departure) => {
    setSelectedDeparture(depart);
    setOpenClick(true);
  };

  const handleCloseClick = () => {
    setOpenClick(false);
    setSelectedDeparture(null);
  };


 const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

const [activeButton, setActiveButton] = useState<number | null>(null);
 const handleButtonClick = (buttonIndex: number) => {
    setActiveButton(buttonIndex);
};

const [minPrice, setMinPrice] = useState("");
const [maxPrice, setMaxPrice] = useState("");
const [stops, setStops] = useState<string | null>(null);
const [refundPolicy, setRefundPolicy] = useState<string | null>(null);
const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);

const ITEMS_PER_PAGE = 4;

const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
};

const airlinesList = ["Aero", "Arik Air", "Value Jet", "Air Peace", "United Nigeria"];
const [selected, setSelected] = useState<{ [key: string]: boolean }>(
  airlinesList.reduce((acc, airline) => ({ ...acc, [airline]: false }), { all: false })
);


const handleMinPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => 
    setMinPrice(event.target.value);

const handleMaxPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => 
    setMaxPrice(event.target.value);

const handleStopsChange = (stop: string) => setStops(stop);

const handleRefundPolicyChange = (event: React.ChangeEvent<HTMLInputElement>) => 
    setRefundPolicy(event.target.checked ? event.target.name : null);

const handleSelectedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    
    if (name === "all") {
    // Select all or deselect all
    setSelected(() => {
        const newState: { [key: string]: boolean } = { all: checked }; // Explicit type
        airlinesList.forEach((airline) => {
            newState[airline] = checked;
        });
        return newState;
    });

    setSelectedAirlines(checked ? airlinesList : []);
} else {
    setSelected((prev) => ({
        ...prev,
        all: false,
        [name]: checked,
    }));

    setSelectedAirlines((prev) =>
        checked ? [...prev, name] : prev.filter((airline) => airline !== name)
    );
}

};
const [filteredItems, setFilteredItems] = useState(departureInfo);

const applyFilters = () => {
    const filtered = departureInfo.filter((item) => {
        const priceInRange = (!minPrice || item.price >= minPrice) && (!maxPrice || item.price <= maxPrice);
        const stopMatch = !stops || item.non === stops;
        const refundMatch = !refundPolicy || item.refundable === refundPolicy;
        const airlineMatch = selectedAirlines.length === 0 || selectedAirlines.includes(item.planeName);

        return priceInRange && stopMatch && refundMatch && airlineMatch;
    });

    setFilteredItems(filtered);
    closeDialog();
};

const paginatedItems = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredItems.slice(startIndex, endIndex);
}, [filteredItems, page]);




  return (
     <div className='w-full  bg-[#CCD8E833] mt-[73px] '>
    <div><Navbar/></div>
    <div>
        <div className='flex justify-center pt-5 pb-6 mb-[18px] '>

        <div className='w-[90%] m-auto'>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2}}>
        
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <label htmlFor="from" className="mb-1 text-[14px]">From</label>
          <TextField
            id="from"
            variant="outlined"
            size="small"
            placeholder="Search Destination"
            value={from}
             onClick={handleFromClick}
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
                      <div className="flex gap-[8px]" onClick={() => handleOptionClick(location, true)}>
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
            value={to}
             onClick={handleToClick}
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
                  <div className="flex gap-[8px]" onClick={() => handleOptionClick(location, false)}>
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
              <label htmlFor="departure-date" className="mb-1 text-[14px]">Date</label>
              <TextField
                id="departure-date"
                variant="outlined"
                size="small"
                placeholder="Select Date"
                value={departureDate} 
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
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
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
          <label htmlFor="passengers" className="mb-1 text-[14px]">Passengers</label>
          <TextField
            id="passengers"
            variant="outlined"
            size="small"
            placeholder="1 Passenger"
             value={passengers}
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
         <label htmlFor="class" className="mb-1 text-[14px]">Class</label>
          <TextField
            id="class"
            variant="outlined"
            size="small"
            placeholder="Economy"
            value={selectedClass}
            inputRef={anchorRef}
            onClick={() => setFlightClasses(true)}
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

      <Popper open={flightClasses} anchorEl={anchorRef.current} placement="bottom-start">
        <ClickAwayListener onClickAway={() => setFlightClasses(false)}>
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
                  setFlightClasses(false); 
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

        <Link to="">
          <div className="bg-[#023E8A] h-[45px] w-[130px] text-center text-white font-inter text-base rounded-[8px] pt-[10px] mt-[18px]">
            <button>Update</button>
          </div>
        </Link>
      </Box>
      </div>
        </div>
    </div>


    <div className='bg-white w-full h-full pt-[20px] pb-[50px] mb-[100px]'>
    <div className='w-[90%] m-auto'>
        <div className='flex gap-1 text-[15px] mb-4'>
            <p>Home</p>
            <KeyboardArrowRightOutlinedIcon />
            <p className='text-[#023E8A]'>Departure</p>
        </div>
    </div>
    
    <Divider  />

<div className=''>
    <div className='mt-[53px] mb-[26px]'>
        <div className='w-[90%] m-auto flex justify-between'>
            <p className='text-[28px] font-inter font-semibold'>Return Flight</p>
             <div>
            <div className=''>
            <Box sx={{display:"flex", gap:"15px"}}>
                  
              <TextField
                id="filter-input"
                variant="outlined"
                size="small"
                placeholder="Filter"
                aria-readonly="true"
                onClick={openDialog}
                InputProps={{
                    startAdornment: (
                    <InputAdornment position="start">
                        <TuneIcon />
                    </InputAdornment>
                    ),
                    readOnly: true, 
                    // sx: { pointerEvents: "none" }, 
                }}
                sx={{
                    width: "100px",
                    "& .MuiInputBase-root": {
                    height: "44px",
                    borderRadius: "8px",
                    borderColor: "#DEDFE1",
                    cursor: "pointer",
                    },
                }}
                />


                <Dialog
        open={isDialogOpen}
        onClose={closeDialog}
        fullWidth
        sx={{
            "& .MuiBackdrop-root": {
                backgroundColor: "rgba(0, 0, 0, 0.3)",
            },
            "& .MuiPaper-root": {
                width: "390px",
                height: "880px",
                borderRadius: "10px",
                display: "flex",
                flexDirection: "column",
            },
        }}
    >
        <DialogContent sx={{ flex: 1, overflowY: "auto", paddingBottom: "5px" }}>

            <div className="absolute z-40 top-0 left-0 right-0 bg-white border-b border-gray-300 rounded-t-[10px] pl-6 pr-4 pb-3 pt-4">
                <div className="flex items-center justify-between">
                    <p className="text-[14px] font-semibold font-inter text-[#023E8A]">Clear All</p>
                    <p className="text-[20px] font-inter font-medium">Filter By</p>
                    <IconButton onClick={closeDialog}>
                        <CloseOutlinedIcon className="w-[32px] h-[32px] p-[4px] font-bold bg-white border-[0.5px] border-[#EBECED] shadow-[0px_4px_4px_rgba(0,0,0,0.06)] rounded-[4px]" />
                    </IconButton>
                </div>
            </div>

        
            <div className="overflow-y-hidden px-2 mt-12">
                <div className="mb-[20px] mt-[24px]">
                    <p className="text-[18px] font-inter font-medium">Price Range</p>
                    <div className="mt-[20px] mb-[20px]">
                        <img src={line2} alt="" />
                    </div>
                </div>

                <Box className="flex justify-between gap-[16px]">
                    <div className="flex flex-col">
                        <label htmlFor="from" className="mb-1 text-[16px]">Minimum</label>
                        <TextField
                            id="from"
                            type="number"
                            variant="outlined"
                            size="small"
                            placeholder="₦0"
                            onChange={handleMinPriceChange}
                            sx={{
                                width: "100%",
                                "& .MuiInputBase-root": { height: "44px", borderRadius: "8px" },
                            }}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="to" className="mb-1 text-[16px]">Maximum</label>
                        <TextField
                            id="to"
                            type="number"
                            variant="outlined"
                            size="small"
                            placeholder="₦1,000,000"
                            onChange={handleMaxPriceChange}
                            sx={{
                                width: "100%",
                                "& .MuiInputBase-root": { height: "44px", borderRadius: "8px" },
                            }}
                        />
                    </div>
                </Box>

                <Divider sx={{ marginBottom: "14px",  marginTop: "14px"  }} />
                <p className="text-[18px] font-inter font-medium">Stops</p>
                <div className="flex gap-[16px]">
                    {["Non Stop", "1 Stop", "1+ Stop"].map((label, index) => (
                        <button
                            key={index}
                            className={`border border-[#DEDFE1] w-full rounded-[6px] py-[8px] text-[16px] font-inter cursor-pointer transition-all ${
                                activeButton === index ? "bg-[#023E8A] text-white" : "bg-white text-black"
                            }`}
                            onClick={() => {
                                handleButtonClick(index);
                                handleStopsChange(label);
                            }}
                        >
                            {label}
                        </button>
                    ))}
                </div>
                <Divider sx={{  marginTop: "14px"  }} />

                    <div className="mb-[14px] mt-[14px]">
                        <p className="text-[18px] font-inter font-medium">Refund Policy</p>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox onChange={handleRefundPolicyChange} name="Refundable" />} label="Refundable" />
                            <FormControlLabel control={<Checkbox onChange={handleRefundPolicyChange} name="Non Refundable" />} label="Non Refundable" />
                        </FormGroup>
                    </div>
                    <Divider />

                    <div className="mb-[100px] mt-[20px]">
                        <p className="text-[18px] font-inter font-medium">Airlines</p>
                        <FormGroup>
                            <FormControlLabel
                                control={<Checkbox checked={selected.all} onChange={handleSelectedChange} name="all" />}
                                label="Select All carriers"
                            />
                            {["Aero", "Arik Air", "Value Jet", "Air Peace", "United Nigeria"].map((airline) => (
                                <FormControlLabel
                                    key={airline}
                                    control={<Checkbox checked={selected[airline]} onChange={handleSelectedChange} name={airline} />}
                                    label={airline}
                                />
                            ))}
                        </FormGroup>
                    </div>
                </div>
        </DialogContent>

                <div className="absolute bottom-0 border-t border-[grey] left-0 right-0 bg-white p-4 rounded-b-[10px]">
                <button onClick={applyFilters} className="w-full h-[52px] rounded-[6px] bg-[#023E8A] text-white cursor-pointer">
                    Apply
                </button>
            </div>
    
                </Dialog>


                    
                <Select
                        id="from"
                        variant="outlined"
                        size="small"
                        displayEmpty
                        value={from}
                        onChange={(event) => setFrom(event.target.value)}
                        renderValue={(selected) => (selected ? selected : "Sort by: Recommended")}
                        startAdornment={
                            <InputAdornment position="start">
                            <SortIcon />
                            </InputAdornment>
                        }
                        MenuProps={{
                            PaperProps: {
                            sx: {
                                width: "300px",
                                maxHeight: "335px",
                                "& .MuiMenuItem-root": {
                                paddingY: "10px", 
                                margin: 0, 
                                backgroundColor: "transparent !important",
                                "&:hover": {
                                    backgroundColor: "#023E8A !important",
                                    color: "white",
                                },
                                },
                            },
                            },
                        }}
                        sx={{
                            width: "225px",
                            "& .MuiInputBase-root": {
                            height: "44px",
                            borderRadius: "8px",
                            borderColor: "#DEDFE1",
                            },
                        }}
                        >

                        <MenuItem value="recommended">Recommended</MenuItem>
                        <MenuItem value="price_low">Price: Low to High</MenuItem>
                        <MenuItem value="price_high">Price: High to Low</MenuItem>
                        <MenuItem value="shortest_duration">Shortest Duration</MenuItem>
                        <MenuItem value="longest_duration">Longest Duration</MenuItem>
                </Select>

                
            </Box>
            </div>
        </div>   
        </div>

          
        
    </div>
    <Divider />

</div>

    <div>
        <div className='mt-[24px] w-[90%] m-auto cursor-pointer'>
     

    {paginatedItems.length > 0 ? (
        paginatedItems.map((depart) => (
        <div key={depart.id} className="group" onClick={() => handleOpen(depart)}>
            <div className='w-full font-inter border mb-4 border-[#809EC4] h-[170px] rounded-[7px] pt-[16px] pd-[16px] pl-[16px] pr-[16px] 
                group-hover:bg-[#CCD8E81A] group-hover:border-[#023E8A] group-hover:border-[1px] transition-all duration-300'>

                <div className='flex gap-3 justify-between'>
                    <div className='flex gap-2'>
                        <div className='border-1 p-[3px] border-[#DEDFE1] bg-white h-[40px] w-[40px] rounded-lg'>
                            <img src={depart.image} alt='Airline logo' />
                        </div>
                        <div><p className='mt-2'>{depart.planeName}</p></div>
                    </div>
                    <div className='flex gap-[4px]'>
                        <p className='text-[#D72638]'>{depart.spaceleft}</p>
                        <CircleIcon className=' text-[#4E4F52]' sx={{ width: "4px", height: "4px" }} />
                        <div>{depart.class}</div>
                    </div>
                </div>

            
                <div className='flex justify-center gap-6'>
                    <div>
                        <p>{depart.timefrom}</p>
                        <p>{depart.placefrom}</p>
                    </div>

                    <div>
                        <div className='flex gap-[2px] justify-center'>
                            <p>{depart.timelong}</p>
                            <CircleIcon className=' text-[#4E4F52]' sx={{ width: "4px", height: "4px" }} />
                            <p>{depart.non}</p>
                        </div>
                        <img src={depart.line} alt='' />
                        <div className='flex justify-center'>{depart.flightcode}</div>
                    </div>

                    <div>
                        <p>{depart.timeto}</p>
                        <p>{depart.placeto}</p>
                    </div>
                </div>

               
                <div className='flex justify-between'>
                    <div><p>{depart.refundable}</p></div>
                    <div>
                        <div className='flex gap-1'>
                            <p>{depart.price}</p>
                            <p>{depart.passenger}</p>
                        </div>
                        <p>{depart.tax}</p>
                    </div>
                </div>
            </div>
        </div>
    ))
        ) : (
            <div className="flex items-center justify-center h-64">
                <p className="text-gray-500 font-bold text-lg">Not Available</p>
            </div>
        )}


        <Stack spacing={2} className='mt-50'>
            <Pagination 
                count={Math.ceil(filteredItems.length / ITEMS_PER_PAGE)} 
                shape='rounded' 
                page={page} 
                onChange={handleChange}
                sx={{ display: 'flex', justifyContent: 'center' }}
            />

        </Stack>

            <Dialog open={openClick} onClose={handleCloseClick} 
                 sx={{
                "& .MuiBackdrop-root": {
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                },
                "& .MuiPaper-root": {
                    width: "550px",
                    height: "880px",
                    borderRadius: "10px",
                    display: "flex",
                    flexDirection: "column",
                    
                },
            }}
                >
                <DialogContent
                sx={{
                flex: 1,
                overflowY: "auto",
                paddingBottom: "5px",
                "&::-webkit-scrollbar": {
                display: "none",
                },
                scrollbarWidth: "none",
                msOverflowStyle: "none",
            }}>

         <div className="absolute z-40 top-0 left-0 right-0 bg-white border-b border-gray-300 rounded-t-[10px] pl-6 pr-4 pb-3 pt-4">
            <div className="flex items-center justify-center relative">
               
                <p className="text-[20px] font-inter font-medium ">Return Flight</p>
          
             
               <IconButton 
                onClick={closeDialog} 
                sx={{position:"absolute",  right:"0px", top:"-5px"}}
            >
                <CloseOutlinedIcon className="w-[32px] h-[32px] p-[4px] font-bold bg-white border-[0.5px] border-[#EBECED] shadow-[0px_4px_4px_rgba(0,0,0,0.06)] rounded-[4px]" />
             </IconButton>
              
            </div>
        </div>
            
            <div className="mt-[75px] ">
                <div className='w-full border-1 border-[#023E8A] bg-[#CCD8E81A] rounded-[6px] mb-[16px] '>

                    <div className='items-center p-2'>
                        <p className='text-[18px] text-[#181818] font-inter font-normal'>{selectedDeparture?.placefrom} to  {selectedDeparture?.placeto}</p>
                        <p className='text-[15px] text-[#4E4F52] '>Feb 19, 1 {selectedDeparture?.passenger}</p>

                    </div>

                </div>

                      <div>
                        <div className="w-full border-1 border-[#DEDFE1] bd-white rounded-[6px] p-[12px]">
                             <div>
                            <p className="text-[19px]  font-normal text-[#67696D] ">Return Flight</p>
                            <p className="text-[#181818] text-[16px] font-semibold">₦50,000 </p>
                            <p className="text-[#4E4F52] text-[16px] font-normal">Per Passenger</p>
                            <p  className="text-[#181818] text-[16px] font-medium"><ErrorOutlineIcon />Price Includes tax & Fees</p>

                            </div>
                        </div>
                      </div>

                {selectedDeparture && (
                <div>
                        <div className="w-full border-1 border-[#DEDFE1] bd-white rounded-[6px] p-[12px] mt-[16px] mb-[16px]">
                             <div className="flex flex-col gap-1">
                                <div className='flex gap-[4px]'>
                                    <img src={selectedDeparture?.image} alt="" className='w-[19px]' />
                                    <p className="text-[#67696D] text-[18px] font-normal ">{selectedDeparture?.planeName}</p>
                                </div>
                                <p className='text-[#4E4F52] font-normal text-[16px]'><FlightClassOutlinedIcon />{selectedDeparture?.class}</p>
                                <p className='text-[#4E4F52] font-normal text-[16px]'><CalendarMonthOutlinedIcon />Feb 19</p>
                                <p className="text-[#4E4F52] text-[16px] font-normal"><AccessTimeIcon />{selectedDeparture?.timefrom} - {selectedDeparture?.timeto} ({selectedDeparture?.timelong} {selectedDeparture?.non})</p>
                                <p className="text-[#4E4F52] text-[16px] font-medium"><LuggageOutlinedIcon />1 Carry-on + 23kg Checked Bag</p>
                                <p className="text-[#4E4F52] text-[16px] font-medium"><AirlineSeatReclineExtraOutlinedIcon /> Seat Selection is not allowed</p>
                                <p className="text-[#4E4F52] text-[16px] font-medium"><CloseOutlinedIcon /> {selectedDeparture?.refundable}</p>
                                
                            </div>

                            <div>

                            </div>
                        </div>
                      </div>
                )}

                <div className="flex justify-between pb-[150px]">

                <div>
                    <p className='text-[#181818] text-[18px] font-medium'>Extra  Baggage</p>
                    <p className="text-[#181818] text-[16px] font-normal">Checked Bag(Up to 23kg)</p>
                    <p  className="text-[#4E4F52] text-[14px] font-normal">Extra ₦10,000</p>
                </div>
                
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
            </DialogContent>
        <Link to="/flightInfo-review">
             <div className="absolute bottom-0 border-t border-[grey] left-0 right-0 bg-white p-4 rounded-b-[10px]">
            <button onClick={applyFilters} className="w-full h-[52px] rounded-[6px] bg-[#023E8A] text-white cursor-pointer">
                Select
            </button>
          </div>
          </Link>
            </Dialog>
        </div>
    </div>
   
    </div>

    <div className=''>
        <TravelmateApp />
    </div>

     <Footer />

     </div>
  )
}

export default ReturnPage