
import React, { useState, useMemo, JSX } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import TuneIcon from '@mui/icons-material/Tune';
import SortIcon from '@mui/icons-material/Sort';
import Breadcrumb from '../../BreadCrumb'
import { Box, Checkbox, Dialog, DialogContent, Divider, FormControlLabel, FormGroup, IconButton, InputAdornment, MenuItem, Select, SelectChangeEvent, Slider, TextField } from '@mui/material'
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import carImage from "../../../assets/carImage.png"
import carLogo from "../../../assets/carLogo.png"
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import SpeedIcon from '@mui/icons-material/Speed';
import CircleIcon from '@mui/icons-material/Circle';
import CheckIcon from '@mui/icons-material/Check';
import { Stack, Pagination } from '@mui/material';
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useNavigate } from "react-router-dom";
import offerNot from "../../../assets/offerNot.svg"


interface CarList {
    id: number,
    carDescription:string
    image: string,
    carName: string,
    carLogo: string,
    seatLeft: JSX.Element,
    fuelIcon: JSX.Element,
    speed: JSX.Element,
    mileage: string,
    spaceleft: string,
    fuel: string,
    full: string,
    pickUp: string,
    dropOff:string,
    refundable: string,
    noShows: string,
    perDay: string,
    price: string,
    button: string,
}

interface CarListProps {
  departureInfo: CarList[];
}


const CarList: React.FC<CarListProps> = () => {  
    
    const navigate = useNavigate()
    const carList = useMemo(() => [
            {
              id: 1,
              image: carImage,
              carName: "SUV",
              type:"Automatic",
              carDescription: "Avis Nigeria",
              carLogo: carLogo,
              seatLeft: <AirlineSeatReclineNormalIcon />,
              fuelIcon : <AcUnitIcon />,
              speed:<SpeedIcon />,
              mileage:"Unlimited Mileage",
              spaceleft: "3 Left",
              fuel: "Fuel",
              full: "Full to full",
              pickUp: "Pick Up Location:MMIA Airport Car Rental, Ikeja",
              dropOff:"Drop-Off Location: Eko Hotel Car Rental, Victoria Island",
              refundable: "Fully Refundable before Feb 10",
              noShows:"No shows will not receive a refund",
              perDay:"Per Day",
              price: "₦14,000",
              button:"Name your price",
            },
            {
              id: 2,
              image: carImage,
              carDescription: "Bolt Drive",
              type:"Manual",
              carName: "Economy",
              carLogo: carLogo,
              seatLeft: <AirlineSeatReclineNormalIcon />,
              fuelIcon : <AcUnitIcon />,
              speed:<SpeedIcon />,
              mileage:"Unlimited Mileage",
              spaceleft: "3 Left",
              fuel: "Fuel",
              full: "Full to full",
              pickUp: "Pick Up Location:MMIA Airport Car Rental, Ikeja",
              dropOff:"Drop-Off Location: Eko Hotel Car Rental, Victoria Island",
              refundable: "Fully Refundable before Feb 10",
              noShows:"No shows will not receive a refund",
              perDay:"Per Day",
              price: "₦10,000",
              button:"Name your price",
            },
            {
              id: 3,
              image: carImage,
              carDescription: "Hertz Nigeria",
              carName: "Compact",
              type:"Automatic",
              carLogo: carLogo,
              seatLeft: <AirlineSeatReclineNormalIcon />,
              fuelIcon : <AcUnitIcon />,
              speed:<SpeedIcon />,
              mileage:"Unlimited Mileage",
              spaceleft: "3 Left",
              fuel: "Fuel",
              full: "Full to full",
              pickUp: "Pick Up Location:MMIA Airport Car Rental, Ikeja",
              dropOff:"Drop-Off Location: Eko Hotel Car Rental, Victoria Island",
              refundable: "Fully Refundable before Feb 10",
              noShows:"No shows will not receive a refund",
              perDay:"Per Day",
              price: "₦19,000",
              button:"Name your price",
            },
            {
              id: 4,
                image: carImage,
              carName: "Standard",
              type:"Manual",
              carLogo: carLogo,
              carDescription: "Uber Rentals",
              seatLeft: <AirlineSeatReclineNormalIcon />,
              fuelIcon : <AcUnitIcon />,
              speed:<SpeedIcon />,
              mileage:"Unlimited Mileage",
              spaceleft: "3 Left",
              fuel: "Fuel",
              full: "Full to full",
              pickUp: "Pick Up Location:MMIA Airport Car Rental, Ikeja",
              dropOff:"Drop-Off Location: Eko Hotel Car Rental, Victoria Island",
              refundable: "Fully Refundable before Feb 10",
              noShows:"No shows will not receive a refund",
              perDay:"Per Day",
              price: "₦120,000",
              button:"Name your price",
            },
            {
              id: 5,
               image: carImage,
              carName: "Midsize",
              carLogo: carLogo,
              type:"Automatic",
              carDescription: "Avis Nigeria",
              seatLeft: <AirlineSeatReclineNormalIcon />,
              fuelIcon : <AcUnitIcon />,
              speed:<SpeedIcon />,
              mileage:"Unlimited Mileage",
              spaceleft: "3 Left",
              fuel: "Fuel",
              full: "Full to full",
              pickUp: "Pick Up Location:MMIA Airport Car Rental, Ikeja",
              dropOff:"Drop-Off Location: Eko Hotel Car Rental, Victoria Island",
              refundable: "Fully Refundable before Feb 10",
              noShows:"No shows will not receive a refund",
              perDay:"Per Day",
              price: "₦150,000",
              button:"Name your price",
            },
              {
              id: 6,
               image: carImage,
              carName: "Full Size",
              type:"Manual",
              carDescription: "Hertz Nigeria",
              carLogo: carLogo,
              seatLeft: <AirlineSeatReclineNormalIcon />,
              fuelIcon : <AcUnitIcon />,
              speed:<SpeedIcon />,
              mileage:"Unlimited Mileage",
              spaceleft: "3 Left",
              fuel: "Fuel",
              full: "Full to full",
              pickUp: "Pick Up Location:MMIA Airport Car Rental, Ikeja",
              dropOff:"Drop-Off Location: Eko Hotel Car Rental, Victoria Island",
              refundable: "Fully Refundable before Feb 10",
              noShows:"No shows will not receive a refund",
              perDay:"Per Day",
              price: "₦90,000",
              button:"Name your price",
            },
              {
              id: 7,
               image: carImage,
              carName: "Premium",
              type:"Automatic",
              carLogo: carLogo,
              carDescription: "Bolt Drive",
              seatLeft: <AirlineSeatReclineNormalIcon />,
              fuelIcon : <AcUnitIcon />,
              speed:<SpeedIcon />,
              mileage:"Unlimited Mileage",
              spaceleft: "3 Left",
              fuel: "Fuel",
              full: "Full to full",
              pickUp: "Pick Up Location:MMIA Airport Car Rental, Ikeja",
              dropOff:"Drop-Off Location: Eko Hotel Car Rental, Victoria Island",
              refundable: "Fully Refundable before Feb 10",
              noShows:"No shows will not receive a refund",
              perDay:"Per Day",
              price: "₦40,000",
              button:"Name your price",
            },

              {
              id: 8,
               image: carImage,
              carName: "SUV",
              type:"Manual",
              carLogo: carLogo,
              seatLeft: <AirlineSeatReclineNormalIcon />,
              fuelIcon : <AcUnitIcon />,
              speed:<SpeedIcon />,
              mileage:"Unlimited Mileage",
              spaceleft: "3 Left",
              carDescription: "Uber Rentals",
              fuel: "Fuel",
              full: "Full to full",
              pickUp: "Pick Up Location:MMIA Airport Car Rental, Ikeja",
              dropOff:"Drop-Off Location: Eko Hotel Car Rental, Victoria Island",
              refundable: "Fully Refundable before Feb 10",
              noShows:"No shows will not receive a refund",
              perDay:"Per Day",
              price: "₦60,000",
              button:"Name your price",
            },

              {
              id: 9,
               image: carImage,
              carName: "Compact",
              type:"Automatic",
              carLogo: carLogo,
              carDescription: "Avis Nigeria",
              seatLeft: <AirlineSeatReclineNormalIcon />,
              fuelIcon : <AcUnitIcon />,
              speed:<SpeedIcon />,
              mileage:"Unlimited Mileage",
              spaceleft: "3 Left",
              fuel: "Fuel",
              full: "Full to full",
              pickUp: "Pick Up Location:MMIA Airport Car Rental, Ikeja",
              dropOff:"Drop-Off Location: Eko Hotel Car Rental, Victoria Island",
              refundable: "Fully Refundable before Feb 10",
              noShows:"No shows will not receive a refund",
              perDay:"Per Day",
              price: "₦80,000",
              button:"Name your price",
            },

              {
              id: 10,
               image: carImage,
               carDescription: "Bolt Drive",
               type:"Manual",
              carName: "Midsize",
              carLogo: carLogo,
              seatLeft: <AirlineSeatReclineNormalIcon />,
              fuelIcon : <AcUnitIcon />,
              speed:<SpeedIcon />,
              mileage:"Unlimited Mileage",
              spaceleft: "3 Left",
              fuel: "Fuel",
              full: "Full to full",
              pickUp: "Pick Up Location:MMIA Airport Car Rental, Ikeja",
              dropOff:"Drop-Off Location: Eko Hotel Car Rental, Victoria Island",
              refundable: "Fully Refundable before Feb 10",
              noShows:"No shows will not receive a refund",
              perDay:"Per Day",
              price: "₦100,000",
              button:"Name your price",
            },

              {
              id: 11,
               image: carImage,
              carName: "Premium",
              carLogo: carLogo,
              type:"Automatic",
              seatLeft: <AirlineSeatReclineNormalIcon />,
              fuelIcon : <AcUnitIcon />,
              speed:<SpeedIcon />,
              carDescription: "Hertz Nigeria",
              mileage:"Unlimited Mileage",
              spaceleft: "3 Left",
              fuel: "Fuel",
              full: "Full to full",
              pickUp: "Pick Up Location:MMIA Airport Car Rental, Ikeja",
              dropOff:"Drop-Off Location: Eko Hotel Car Rental, Victoria Island",
              refundable: "Fully Refundable before Feb 10",
              noShows:"No shows will not receive a refund",
              perDay:"Per Day",
              price: "₦20,000",
              button:"Name your price",
            },

            {
              id: 12,
               image: carImage,
               carDescription: "Uber Rentals",
              carName: "Economy",
              carLogo: carLogo,
              type:"Manual",
              seatLeft: <AirlineSeatReclineNormalIcon />,
              fuelIcon : <AcUnitIcon />,
              speed:<SpeedIcon />,
              mileage:"Unlimited Mileage",
              spaceleft: "3 Left",
              fuel: "Fuel",
              full: "Full to full",
              pickUp: "Pick Up Location:MMIA Airport Car Rental, Ikeja",
              dropOff:"Drop-Off Location: Eko Hotel Car Rental, Victoria Island",
              refundable: "Fully Refundable before Feb 10",
              noShows:"No shows will not receive a refund",
              perDay:"Per Day",
              price: "₦30,000",
              button:"Name your price",
            },
          ], []);
    
    
     const [page, setPage] = useState<number>(1); 
      const [openClick, setOpenClick] = useState<boolean>(false);
    const [selectedCarId, setSelectedCarId] = useState<number | null>(null);
    
    
    
    const handleOpen = (car: CarList) => {
      
      setSelectedCarId(car.id);
      setOpenClick(true);
    };
    
    
      const handleCloseClick = () => {
      setOpenClick(false);
      setSelectedCarId(null);
    };
    
    const selectedCar = carList.find((d) => d.id === selectedCarId);
    
    
     const [isDialogOpen, setIsDialogOpen] = useState(false);
    
      const openDialog = () => {
        setIsDialogOpen(true);
      };
    
      const closeDialog = () => {
        setIsDialogOpen(false);
      };
    
    // const [activeButton, setActiveButton] = useState<number | null>(null);
    //  const handleButtonClick = (buttonIndex: number) => {
    //     setActiveButton(buttonIndex);
    // };
    
    
    
    const ITEMS_PER_PAGE = 8; 
    


    
    const airlinesList = ["Economy", "Compact", "Standard", "Midsize", "Full Size", "SUV", "Premium"];
    const roadCarList = ["Avis Nigeria", "Bolt Drive", "Hertz Nigeria", "Uber Rentals"];

    
      const [value, setValue] = React.useState<number[]>([2000, 10000000]);
      const formatNumber = (num: number) => new Intl.NumberFormat().format(num);
    
    
    const [tempSelectedAirlines, setTempSelectedAirlines] = useState<string[]>([]);
    const [tempSelectedCar, setTempSelectedCars] = useState<string[]>([])
    const [tempValue, setTempValue] = useState<number[]>([2000, 10000000]);
    const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
    const [selectedCarRent, setSelectedCarRent] = useState<string[]>([]);
    const [selectedSpecs, setSelectedSpecs] = useState<string[]>([]);
    const [tempSelectedSpecs, setTempSelectedSpecs] = useState<string[]>([]);

    
    const applyFilters = useMemo(() => {
      return carList.filter((item) => {
        const price = parseInt(item.price.replace(/[^0-9]/g, ""), 10);
        const matchesPrice = price >= value[0] && price <= value[1];
       const carMatch = selectedCarRent.length === 0 || selectedCarRent.includes(item.carDescription);
       const airlineMatch = selectedAirlines.length === 0 || selectedAirlines.includes(item.carName);
    const specMatch = selectedSpecs.length === 0 || selectedSpecs.includes(item.type);

        return matchesPrice && carMatch && airlineMatch && specMatch;
      });
    }, [carList, selectedAirlines, selectedCarRent, selectedSpecs, value]);
    
    
    
     const handleMinPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = event.target.value.replace(/,/g, ""); 
        const min = Number(rawValue);
        if (!isNaN(min)) {
            setValue([min, Math.max(min, value[1])]);
        }
    };
    
    const handleMaxPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = event.target.value.replace(/,/g, ""); 
        const max = Number(rawValue);
        if (!isNaN(max)) {
            setValue([value[0], Math.max(value[0], max)]);
        }
    };
    
    
    const [selectedSort, setSelectedSort] = useState("");
    
    const handleSortedChange = (event: SelectChangeEvent<string>) => {
      setSelectedSort(event.target.value);
      setPage(1);
    };
    
    
        const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
            setPage(value);
        };

    
    const handleTempSelectedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, checked } = event.target;
    
      if (name === "all") {
     
        setTempSelectedAirlines(checked ? airlinesList : []);
      } else {
       
        setTempSelectedAirlines((prev) =>
          checked ? [...prev, name] : prev.filter((airline) => airline !== name)
        );
      }
    };

     const handleTempSelectedCar = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, checked } = event.target;
    
      if (name === "carRent") {
     
        setTempSelectedCars(checked ? roadCarList : []);
      } else {
       
        setTempSelectedCars((prev) =>
          checked ? [...prev, name] : prev.filter((carLine) => carLine !== name)
        );
      }
    };
    
    const handleTempSliderChange = (_event: Event, newValue: number | number[]) => {
      setTempValue(newValue as number[]);
    };

const handleTempSelectedSpec = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setTempSelectedSpecs((prevSpecs) =>
        checked ? [...prevSpecs, name] : prevSpecs.filter((spec) => spec !== name)
    );
};

    
    
      
        const sortedDepartures = useMemo(() => {
            const sortedArray = [...applyFilters];
    
            switch (selectedSort) {
                case "price_low":
                    sortedArray.sort((a, b) => 
                        parseInt(a.price.replace(/[^0-9]/g, ""), 10) - 
                        parseInt(b.price.replace(/[^0-9]/g, ""), 10)
                    );
                    break;
                case "price_high":
                    sortedArray.sort((a, b) => 
                        parseInt(b.price.replace(/[^0-9]/g, ""), 10) - 
                        parseInt(a.price.replace(/[^0-9]/g, ""), 10)
                    );
                    break;
                default:
                break;
            }
    
            return sortedArray;
        }, [selectedSort, applyFilters]);
    
    
      const paginatedItems = useMemo(() => {
        const startIndex = (page - 1) * ITEMS_PER_PAGE;
        return sortedDepartures.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [page, sortedDepartures]);
    
    
    
    const handleApplyFilters = () => {
      setSelectedCarRent(tempSelectedCar);
      setSelectedAirlines(tempSelectedAirlines);
       setSelectedSpecs(tempSelectedSpecs);
      setValue(tempValue);
      setPage(1);
      closeDialog();
    };

    const [price, setPrice] = useState(""); // Track entered price
const [openNoModal, setOpenNoModal] = useState(false);

// const handlePriceChange = () => {
//   setPrice(event.target.value);
// };

const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/,/g, ""); // Remove existing commas
    if (!isNaN(Number(value)) && value !== "") {
        const formattedValue = new Intl.NumberFormat().format(Number(value));
        setPrice(formattedValue);
    } else {
        setPrice("");
    }
};


// const handleSubmitOffer = () => {
//   if (parseInt(price) < 10000) {
//     setOpenNoModal(true);
//   } else {
//     navigate("/offer-accepted-page");
//   }
// };

const handleSubmitOffer = () => {
  const numericPrice = parseInt(price.replace(/,/g, ""), 10); // Remove commas before parsing

  if (numericPrice < 10000) {
    setOpenNoModal(true);
  } else {
    navigate("/offer-accepted-page");
  }
};


const handleCloseNoModal = () => {
  setOpenNoModal(false);
};

  return (
    <div>
    <div className='bg-white w-full h-full'>
    <div className='w-[90%] m-auto '>
        <div className='pt-[18.5px] mb-[18.5px]'>
        <Breadcrumb />
        </div>
    </div>
    <Divider />

    <div className='w-[90%] m-auto '>
        <div className="flex justify-between mt-[50px] mb-[25px]">
        <div>
        <p>80 Results</p>
        </div>
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
                               <Slider
                                getAriaLabel={() => "Price range"}
                                // value={value}
                                // onChange={handleSliderChange}
                                value={tempValue}
                                onChange={handleTempSliderChange}
                                min={0}
                                max={1000000}
                                step={1000}
                                sx={{width:"95%", margin:"auto", marginLeft:"10px"}}
                              />
                        </div>
        
                        <Box className="flex justify-between gap-[16px]">
                            <div className="flex flex-col">
                                <label htmlFor="from" className="mb-1 text-[16px]">Minimum</label>
                                <TextField
                                    id="from"
                                    type="text"
                                    variant="outlined"
                                    size="small"
                                    InputProps={{ readOnly: true }} 
                                    value={formatNumber(tempValue[0])}
                                    placeholder="₦0"
                                    aria-readonly
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
                                    type="text"
                                    variant="outlined"
                                    InputProps={{ readOnly: true }} 
                                    size="small"
                                    aria-readonly
                                    placeholder="₦10,000,000"
                                    value={formatNumber(tempValue[1])}
                                    onChange={handleMaxPriceChange}
                                    sx={{
                                        width: "100%",
                                        "& .MuiInputBase-root": { height: "44px", borderRadius: "8px" },
                                    }}
                                />
                            </div>
                        </Box>
    
                        <Divider sx={{  marginTop: "14px"  }} />
        
                            <div className="mb-[14px] mt-[14px]">
                                <p className="text-[18px] font-inter font-medium">Car Rental Company</p>
                              <FormGroup>
                                    {["Avis Nigeria", "Bolt Drive", "Hertz Nigeria", "Uber Rentals"].map((carLine) => (
                                      <FormControlLabel
                                        key={carLine}
                                        control={
                                          <Checkbox
                                            checked={tempSelectedCar.includes(carLine)}
                                            onChange={handleTempSelectedCar}
                                            name={carLine}
                                          />
                                        }
                                        label={carLine}
                                      />
                                    ))}
                                </FormGroup>
                            </div>
                            <Divider />
        
                            <div className=" mt-[20px]">
                                <p className="text-[18px] font-inter font-medium">Car Category</p>
                                <FormGroup>
                                    {["Economy", "Compact", "Standard", "Midsize", "Full Size", "SUV", "Premium"].map((airline) => (
                                      <FormControlLabel
                                        key={airline}
                                        control={
                                          <Checkbox
                                            checked={tempSelectedAirlines.includes(airline)}
                                            onChange={handleTempSelectedChange}
                                            name={airline}
                                          />
                                        }
                                        label={airline}
                                      />
                                    ))}
                                </FormGroup>
                            </div>

                                 <Divider />
        
                            <div className="mt-[20px]">
                                <p className="text-[18px] font-inter font-medium">Specifications</p>
                                <FormGroup>
                                    {["Manual", "Automatic"].map((spec) => (
                                      <FormControlLabel
                                        key={spec}
                                        control={
                                          <Checkbox
                                            checked={tempSelectedSpecs.includes(spec)}
                                            onChange={handleTempSelectedSpec}
                                            name={spec}
                                          />
                                        }
                                        label={spec}
                                      />
                                    ))}
                                </FormGroup>
                            </div>

                              <Divider />


                                 <div className="mb-[100px] mt-[20px]">
                                <p className="text-[18px] font-inter font-medium">Number of Passengers</p>
                                <FormGroup>
                                    {["2-5 Passengers", "6 or more Passengers "].map((pass) => (
                                      <FormControlLabel
                                        key={pass}
                                        control={
                                          <Checkbox
                                            // checked={tempSelectedPasss.includes(Pass)}
                                            // onChange={handleTempSelectedPass}
                                            name={pass}
                                          />
                                        }
                                        label={pass}
                                      />
                                    ))}
                                </FormGroup>
                            </div>
                        </div>
                </DialogContent>
                        <div className="absolute bottom-0 border-t border-[grey] left-0 right-0 bg-white p-4 rounded-b-[10px]">
                        <button 
                        onClick={handleApplyFilters} 
                        className="w-full h-[52px] rounded-[6px] bg-[#023E8A] text-white cursor-pointer">
                            Apply
                        </button>
                    </div>
            
                        </Dialog>
        
                            
                        <Select
                                id="sort"
                                variant="outlined"
                                size="small"
                                  value={selectedSort}
                                  onChange={handleSortedChange}
                                  displayEmpty
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
                                    width: "255px",
                                    "& .MuiInputBase-root": {
                                    height: "44px",
                                    borderRadius: "8px",
                                    borderColor: "#DEDFE1",
                                    },
                                }}
                                >
                                <MenuItem value="" disabled>Sort by : Recommended</MenuItem>
                                <MenuItem value="recommended">Recommended</MenuItem>
                                <MenuItem value="price_low">Price: Low to High</MenuItem>
                                <MenuItem value="price_high">Price: High to Low</MenuItem>
                        </Select>
        
                        
                    </Box>
        </div>
        </div>
    </div>


    <Divider sx={{marginBottom:"24px"}} />

<div className="w-[90%] m-auto grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4 ">

    
    {paginatedItems.length > 0 ? (
    paginatedItems.map((car) => (
    <Card key={car.id} className="p-[10px] w-[100%] cursor-pointer" >
        <div className="flex flex-col sm:flex-row gap-[10px]">
        <div className="sm:w-[50%] w-full sm:h-[305px] h-[100%] bg-[#F5F5F5] rounded-[12px]">
        <CardMedia
            component="img"
            // height="140"
            image={car.image}
            alt={car.carName} 
            />
            
        </div>
        <div className="w-[100%]">

            <div className="flex justify-between">
            <Typography gutterBottom variant="h6" component="div">
                {car.carName} 
            </Typography>

                <div>
                    <img src={car.carLogo} alt="" className="w-[50px] h-[20px]"  />
                </div>
        </div>

        <div>
            <div className="flex justify-between">
                <p className="mb-[2px]">{car.carDescription}</p>
                <p className="mb-[2px]">{car.type}</p>
            </div>
           

            <div className="flex gap-[3px] mb-[2px]"> 
            <p>{car.seatLeft} {car.spaceleft}</p>
            <CircleIcon  sx={{width:"4px", height:"4px", marginTop:"10px" ,marginLeft:"2px"}}/>
            <div>{car.fuelIcon} {car.fuel}: {car.full}</div>
            <CircleIcon  sx={{width:"4px", height:"4px", marginTop:"10px" ,marginLeft:"2px"}}/>
            </div>

            <div>
                <div className="mb-[2px]">{car.speed} {car.mileage}</div>
                <div className="mb-[2px]">
                    <p className="mb-[2px]">{car.pickUp}</p>
                    <p className="mb-[2px]">{car.dropOff}</p>
                </div>
                <div className="flex gap-[2px] mb-[3px]">
                    <div className='border-[#2D9C5E] h-[20px]  w-[20px] border-2  rounded-full flex justify-center'>
                        <CheckIcon sx={{width:"15px", position:"relative", top:"-3px", color:"#2D9C5E"}} />
                    </div>
                    <p className="text-[#2D9C5E]">{car.refundable}</p>
                </div>

                <div className="flex gap-[2px] mb-[3px]">
                    <div className='border-[#2D9C5E] h-[20px]  w-[20px] border-2  rounded-full flex justify-center'>
                        <CheckIcon sx={{width:"15px", position:"relative", top:"-3px", color:"#2D9C5E"}} />
                    </div>
                    <p className="text-[#2D9C5E]">{car.noShows}</p>
                </div>
            </div>
        <div className="flex justify-between mt-[14px]">
            <div>
                <p>{car.perDay}</p>
                <p>{car.price}</p>
            </div>  

            <CardActions onClick={() => handleOpen(car)} className="bg-[#023E8A] text-white rounded-[8px] w-[133px] h-[42px] text-[14px] cursor-pointer">
            <button className=" cursor-pointer" >
                {car.button}
            </button>
            </CardActions>
        </div>
        </div>
        </div>
        </div>
    </Card>
        ))
    ) : (
                <div className="flex items-center justify-center h-64">
                    <p className="text-gray-500 font-bold text-lg">Not Available</p>
                </div>
     )}

    </div> 

      <Stack spacing={2} className='mt-20 pb-[80px]'>
        <Pagination 
        count={Math.ceil(applyFilters.length / ITEMS_PER_PAGE)} 
        shape='rounded' 
        page={page} 
        onChange={handleChange}
        sx={{ display: 'flex', justifyContent: 'center', alignItems:"center", textAlign:"center",  }}

        />
    </Stack>

        <Dialog open={openClick} onClose={handleCloseClick} 
                     sx={{
                    "& .MuiBackdrop-root": {
                        backgroundColor: "rgba(0, 0, 0, 0.3)",
                    },
                    "& .MuiPaper-root": {
                        width: "693px",
                        height: "500px",
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
                   
                    <p className="text-[20px] font-inter font-medium ">Name Your Price</p>
              
                 
                   <IconButton 
                    
                    sx={{position:"absolute",  right:"0px", top:"-5px"}}
                >
                    <CloseOutlinedIcon  onClick={handleCloseClick}  className="w-[32px] h-[32px] p-[4px] font-bold bg-white border-[0.5px] border-[#EBECED] shadow-[0px_4px_4px_rgba(0,0,0,0.06)] rounded-[4px]" />
                </IconButton>
                  
                </div>
            </div>
                
                <div className="mt-[75px] ">

                    <div>
                        <p className="text-[#181818] text-[20px] font-semibold font-inter">{selectedCar?.carName}</p>
                        <p className="text-[#67696D] text-[18px] font-inter font-normal">{selectedCar?.carDescription}</p>

                        <p className="mt-[24px] text-[#181818] font-medium text-[16px] font-inter">Your Offer ({selectedCar?.perDay})</p>
                    <TextField
                        id="carOffer"
                        variant="outlined"
                        type="text"
                        size="small"
                        placeholder="Enter your price"value={price}
                        onChange={handlePriceChange} 
                        sx={{
                            width: "100%",
                            marginTop: "10px",
                            marginBottom: "24px",
                            "& .MuiInputBase-root": {
                            height: "44px",
                            borderRadius: "8px",
                            },
                            "& .MuiInputBase-input::placeholder": {
                            fontSize: "14px",
                            
                            },
                        }}
                        />


                    </div>

                    <div className='w-full border-1  border-[#023E8A] bg-[#CCD8E81A] rounded-[6px] mb-[16px] '>
                    <div className="w-[95%] m-auto flex ">
                       <div style={{paddingTop:"18px", color:"#023E8A"}}><ErrorOutlineIcon  /></div> 

                        <div className='items-center p-2'>
                            <p className=" text-[#181818] font-medium text-[18px] font-inter">Price Per Day: ₦10,000</p>
                            <p className='text-[18px] text-[#67696D] font-normal font-inter '>Higher offer have better chances of acceptance</p>
    
                        </div>
                        </div>
                    </div>

                </div>
                </DialogContent>

                <Dialog 
                open={openNoModal}
                onClose={handleCloseNoModal}
                sx={{
                    "& .MuiPaper-root": {  // Targets the modal's white background
                        borderRadius: "12px",
                        width: "364px",  // Ensures the width remains as expected
                        height: "307px",
                    }
                }}
            >
                <div style={{ textAlign: "center", fontSize: "24px", fontWeight: "bold", height:"100%" }}>
                    <div className="w-[80%] m-auto">
                        <div className="flex justify-center mt-[40px]">
                            <img src={offerNot} alt="" />
                            <IconButton 
                              sx={{position:"absolute",  right:"0px", top:"-5px"}}
                          >
                              <CloseOutlinedIcon  onClick={handleCloseNoModal}  className="w-[32px] h-[32px] p-[4px] font-bold bg-white border-[0.5px] border-[#EBECED] shadow-[0px_4px_4px_rgba(0,0,0,0.06)] rounded-[4px]" />
                          </IconButton>
                        </div>
                        <p className="text-[#181818] font-medium text-[24px] font-inter mt-[24px]">
                            Offer Not Accepted
                        </p>
                        <p className="text-[#67696D] font-normal text-[16px] mt-[16px]">
                            Your offer is too low. Try increasing your offer for a better chance of acceptance.
                        </p>
                    </div>
                </div>
            </Dialog>

                
                <div className="absolute bottom-0 border-t border-[grey] left-0 right-0 bg-white p-4 rounded-b-[10px]">
                <button onClick={handleSubmitOffer} 

                     disabled={!price.trim()}
                    className={`w-full h-[52px] rounded-[6px] bg-[#023E8A] text-white cursor-pointer ${
                        price.trim() ? "bg-[#023E8A]" : "bg-gray-400 cursor-not-allowed"
                    }`}>
                    Submit Offer
                </button>
              </div>
           
        </Dialog>
    </div>
    </div>
  )
}

export default CarList