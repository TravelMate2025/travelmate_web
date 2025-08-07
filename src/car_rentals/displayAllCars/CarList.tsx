import React, { useState, useMemo, JSX } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
// import TuneIcon from '@mui/icons-material/Tune';
// import SortIcon from '@mui/icons-material/Sort';
import Breadcrumb from "../../pages/BreadCrumb";
// import Rating from "@mui/material/Rating";
import {
  Dialog,
  DialogContent,
  //  Box, Checkbox,
  Divider,
  IconButton,
  TextField,
  //  FormControlLabel, FormGroup,
  //  InputAdornment, MenuItem, Select, SelectChangeEvent, Slider,
} from "@mui/material";
import { useMediaQuery } from "react-responsive";
import Card from "@mui/material/Card";
// import CardMedia from '@mui/material/CardMedia';
// import Typography from "@mui/material/Typography";
// import CardActions from '@mui/material/CardActions';
import carImage from "../../assets/carImage.svg";
// import carLogo from "../../../assets/carLogo.png"
import AirlineSeatReclineNormalIcon from "@mui/icons-material/AirlineSeatReclineNormal";
// import AcUnitIcon from '@mui/icons-material/AcUnit';
import SpeedIcon from "@mui/icons-material/Speed";
import CircleIcon from "@mui/icons-material/Circle";
// import CheckIcon from "@mui/icons-material/Check";
import { Stack, Pagination } from "@mui/material";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
// import circle from "../../assets/circle.svg";
import LuggageOutlinedIcon from "@mui/icons-material/LuggageOutlined";
// import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useNavigate } from "react-router-dom";
import offerNot from "../../assets/offerNot.svg";
import { Clock, Edit3Icon } from "lucide-react";
import { MdOutlineSort } from "react-icons/md";
import SortOverlay from "./SortOverlay";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

interface Car {
  id: number;
  image: string;
  seatLeft: JSX.Element;
  fuelIcon: JSX.Element;
  speed: JSX.Element;
  spaceleft: string;
  full: string;
  refundable: string;
  noShows: string;
  perDay: string;
  price: string;
  button: string;
  time: string;
  timeIcon: JSX.Element;
}
interface DepartureInfo {
  from: string;
  to: string;
  departureDate: string;
  times: {
    pickUpTime: string;
    dropOffTime: string;
  };
  priceRange: {
    miniprice: number;
    maxprice: number;
  };
  selectedRide: string;
  passengerCounts: {
    adults: number;
    children: number;
    infant: number;
  };
}
interface CarListProps {
  departureInfo: DepartureInfo;
  OpenForm: () => void;
}

const CarList: React.FC<CarListProps> = ({ departureInfo, OpenForm }) => {
  const { from, to, departureDate, times, priceRange } = departureInfo;
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const navigate = useNavigate();

  const cars: Car[] = useMemo(
    () => [
      {
        id: 1,
        image: carImage,
        seatLeft: <AirlineSeatReclineNormalIcon />,
        fuelIcon: <LuggageOutlinedIcon />,
        speed: <SpeedIcon />,
        spaceleft: "3 Seats",
        full: "4 Bags",
        timeIcon: <Clock />,
        time: "Estimated time: 90 minutes",
        refundable: "Full refund if cancelled 24 hours before pick up",
        noShows: "Cancellation allowed 24 hours before pick up",
        perDay: "Price",
        price: "₦14,000",
        button: "Select Car",
      },
      {
        id: 2,
        image: carImage,
        seatLeft: <AirlineSeatReclineNormalIcon />,
        fuelIcon: <LuggageOutlinedIcon />,
        speed: <SpeedIcon />,
        spaceleft: "3 Seats",
        full: "4 Bags",
        timeIcon: <Clock />,
        time: "Estimated time: 90 minutes",
        refundable: "Full refund if cancelled 24 hours before pick up",
        noShows: "Cancellation allowed 24 hours before pick up",
        perDay: "Price",
        price: "₦14,000",
        button: "Select Car",
      },
      {
        id: 3,
        image: carImage,
        seatLeft: <AirlineSeatReclineNormalIcon />,
        fuelIcon: <LuggageOutlinedIcon />,
        speed: <SpeedIcon />,
        spaceleft: "3 Seats",
        full: "4 Bags",
        timeIcon: <Clock />,
        time: "Estimated time: 90 minutes",
        refundable: "Full refund if cancelled 24 hours before pick up",
        noShows: "Cancellation allowed 24 hours before pick up",
        perDay: "Price",
        price: "₦14,000",
        button: "Select Car",
      },
      {
        id: 4,
        image: carImage,
        seatLeft: <AirlineSeatReclineNormalIcon />,
        fuelIcon: <LuggageOutlinedIcon />,
        speed: <SpeedIcon />,
        spaceleft: "3 Seats",
        full: "4 Bags",
        timeIcon: <Clock />,
        time: "Estimated time: 90 minutes",
        refundable: "Full refund if cancelled 24 hours before pick up",
        noShows: "Cancellation allowed 24 hours before pick up",
        perDay: "Price",
        price: "₦14,000",
        button: "Select Car",
      },
      {
        id: 5,
        image: carImage,
        seatLeft: <AirlineSeatReclineNormalIcon />,
        fuelIcon: <LuggageOutlinedIcon />,
        speed: <SpeedIcon />,
        spaceleft: "3 Seats",
        full: "4 Bags",
        timeIcon: <Clock />,
        time: "Estimated time: 90 minutes",
        refundable: "Full refund if cancelled 24 hours before pick up",
        noShows: "Cancellation allowed 24 hours before pick up",
        perDay: "Price",
        price: "₦14,000",
        button: "Select Car",
      },
      {
        id: 6,
        image: carImage,
        seatLeft: <AirlineSeatReclineNormalIcon />,
        fuelIcon: <LuggageOutlinedIcon />,
        speed: <SpeedIcon />,
        spaceleft: "3 Seats",
        full: "4 Bags",
        timeIcon: <Clock />,
        time: "Estimated time: 90 minutes",
        refundable: "Full refund if cancelled 24 hours before pick up",
        noShows: "Cancellation allowed 24 hours before pick up",
        perDay: "Price",
        price: "₦14,000",
        button: "Select Car",
      },
      {
        id: 7,
        image: carImage,
        seatLeft: <AirlineSeatReclineNormalIcon />,
        fuelIcon: <LuggageOutlinedIcon />,
        speed: <SpeedIcon />,
        spaceleft: "3 Seats",
        full: "4 Bags",
        timeIcon: <Clock />,
        time: "Estimated time: 90 minutes",
        refundable: "Full refund if cancelled 24 hours before pick up",
        noShows: "Cancellation allowed 24 hours before pick up",
        perDay: "Price",
        price: "₦14,000",
        button: "Select Car",
      },

      {
        id: 8,
        image: carImage,
        seatLeft: <AirlineSeatReclineNormalIcon />,
        fuelIcon: <LuggageOutlinedIcon />,
        speed: <SpeedIcon />,
        spaceleft: "3 Seats",
        full: "4 Bags",
        timeIcon: <Clock />,
        time: "Estimated time: 90 minutes",
        refundable: "Full refund if cancelled 24 hours before pick up",
        noShows: "Cancellation allowed 24 hours before pick up",
        perDay: "Price",
        price: "₦14,000",
        button: "Select Car",
      },

      {
        id: 9,
        image: carImage,
        seatLeft: <AirlineSeatReclineNormalIcon />,
        fuelIcon: <LuggageOutlinedIcon />,
        speed: <SpeedIcon />,
        spaceleft: "3 Seats",
        full: "4 Bags",
        timeIcon: <Clock />,
        time: "Estimated time: 90 minutes",
        refundable: "Full refund if cancelled 24 hours before pick up",
        noShows: "Cancellation allowed 24 hours before pick up",
        perDay: "Price",
        price: "₦14,000",
        button: "Select Car",
      },

      {
        id: 10,
        image: carImage,
        seatLeft: <AirlineSeatReclineNormalIcon />,
        fuelIcon: <LuggageOutlinedIcon />,
        speed: <SpeedIcon />,
        spaceleft: "3 Seats",
        full: "4 Bags",
        timeIcon: <Clock />,
        time: "Estimated time: 90 minutes",
        refundable: "Full refund if cancelled 24 hours before pick up",
        noShows: "Cancellation allowed 24 hours before pick up",
        perDay: "Price",
        price: "₦14,000",
        button: "Select Car",
      },

      {
        id: 11,
        image: carImage,
        seatLeft: <AirlineSeatReclineNormalIcon />,
        fuelIcon: <LuggageOutlinedIcon />,
        speed: <SpeedIcon />,
        spaceleft: "3 Seats",
        full: "4 Bags",
        timeIcon: <Clock />,
        time: "Estimated time: 90 minutes",
        refundable: "Full refund if cancelled 24 hours before pick up",
        noShows: "Cancellation allowed 24 hours before pick up",
        perDay: "Price",
        price: "₦14,000",
        button: "Select Car",
      },

      {
        id: 12,
        image: carImage,
        seatLeft: <AirlineSeatReclineNormalIcon />,
        fuelIcon: <LuggageOutlinedIcon />,
        speed: <SpeedIcon />,
        spaceleft: "3 Seats",
        full: "4 Bags",
        timeIcon: <Clock />,
        time: "Estimated time: 90 minutes",
        refundable: "Full refund if cancelled 24 hours before pick up",
        noShows: "Cancellation allowed 24 hours before pick up",
        perDay: "Price",
        price: "₦14,000",
        button: "Select Car",
      },
    ],
    []
  );

  const [page, setPage] = useState<number>(1);
  const [openClick, setOpenClick] = useState<boolean>(false);
  const [showSortModal, setShowSortModal] = useState(false);

  const handleCloseClick = () => {
    setOpenClick(false);
  };

  const ITEMS_PER_PAGE = 8;

  const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const paginatedItems = useMemo(() => {
    return cars.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  }, [cars, page]);

  const [miniprice, setMiniPrice] = useState("");
  const [openNoModal, setOpenNoModal] = useState(false);

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

  const handleSubmitOffer = () => {
    const numericMinPrice = parseInt(miniprice.replace(/,/g, ""), 10) || 0;
    const numericMaxPrice = parseInt(maxprice.replace(/,/g, ""), 10) || 0;

    if (numericMinPrice < 6000 || numericMaxPrice < 6000) {
      setOpenNoModal(true); // Show modal if either price is below 6000
    } else {
      navigate("/offer-accepted-page"); // Navigate if both are 6000 or above
    }
  };

  const handleSubmitMobileOffer = () => {
    navigate("/offer-accepted-page");
  };

  const handleCloseNoModal = () => {
    setOpenNoModal(false);
  };

  // const value = 4.5;

  return (
    <div>
      <div className="mb-4 px-6 py-4 border-[#023E8A] rounded-md lg:mt-20 border flex justify-between items-start lg:hidden mt-20 mx-4">
        <div>
          <p>
            {from} to {to}
          </p>
          <div className="flex text-xs text-[#67696D] gap-3 items-center">
            <p>
              {departureDate}, {times.pickUpTime}
            </p>
            <p>
              ₦{priceRange.miniprice} - ₦{priceRange.maxprice}
            </p>
            <br />
            {/* <p>{formatPassengerCount(passengerCounts)}</p> */}
          </div>
        </div>
        <Edit3Icon onClick={OpenForm} />
      </div>
      {isMobile ? (
        <div>
          {showSortModal && (
            <SortOverlay closeDialog={() => setShowSortModal(false)} />
          )}
          <div className="flex justify-between py-6 px-6">
            <p>{cars.length} Results</p>
            <div
              className="flex items-center gap-1 justify-normal border-1 border-[#023E8A] py-1 px-4 rounded-lg"
              onClick={() => setShowSortModal(true)}
            >
              <MdOutlineSort />
              <p>Sort</p>
            </div>
          </div>

          <div className="w-[90%] m-auto grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4 ">
            {paginatedItems.length > 0 ? (
              paginatedItems.map((car) => (
                <Card key={car.id} className="p-[20px] w-[100%] cursor-pointer">
                  {/* <div className="flex flex-col sm:flex-row gap-[10px]"> */}
                  <div className="flex justify-normal items-center  gap-3 pb-4">
                    <img src={car.image} alt="" />
                    <p className="mt-[10px] text-[#181818] text-[16px]">
                      Private Car
                    </p>
                  </div>
                  <div className="flex gap-[3px] mb-[10px] mt-[10px]">
                    <p className="text-[14px]">
                      {car.seatLeft} {car.spaceleft}
                    </p>
                    <CircleIcon
                      sx={{
                        width: "4px",
                        height: "4px",
                        marginTop: "10px",
                        marginLeft: "2px",
                        fontSize: "14px",
                      }}
                    />
                    <div className="text-[14px]">
                      {car.fuelIcon} {car.full}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2 items-center">
                      <i className="">{car.timeIcon}</i>
                      <p className="">{car.time}</p>
                    </div>
                    <div className="flex gap-[2px] items-center">
                      <IoIosCheckmarkCircleOutline
                        fill="#2D9C5E"
                        fontSize={25}
                      />
                      <p className="text-[#2D9C5E] text-sm">{car.noShows}</p>
                    </div>

                    <div className="flex gap-[2px] items-center">
                      <IoIosCheckmarkCircleOutline
                        fill="#2D9C5E"
                        fontSize={25}
                      />
                      <p className="text-[#2D9C5E] text-sm">{car.refundable}</p>
                    </div>
                  </div>
                  <div className="flex justify-between mt-[12px]">
                    <div>
                      <p className="text-[13px]">{car.perDay}</p>
                      <p className="text-[14px] font-bold">{car.price}</p>
                    </div>

                    <div
                      onClick={handleSubmitMobileOffer}
                      className="bg-[#023E8A] text-white text-center pt-[10px] rounded-[8px] w-[93px] h-[42px] text-[14px] cursor-pointer"
                    >
                      <button className=" cursor-pointer  align-middle">
                        {car.button}
                      </button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500 font-bold text-lg">Not Available</p>
              </div>
            )}

            <Stack spacing={2} className="mt-20 pb-[80px]">
              <Pagination
                count={Math.ceil(ITEMS_PER_PAGE)}
                shape="rounded"
                page={page}
                onChange={handleChange}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                }}
              />
            </Stack>

            <Dialog
              open={openClick}
              onClose={handleCloseClick}
              sx={{
                "& .MuiBackdrop-root": {
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                },
                "& .MuiPaper-root": {
                  width: "693px",
                  height: "451px",
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
                }}
              >
                <div className="absolute z-40 top-0 left-0 right-0 bg-white border-b border-gray-300 rounded-t-[10px] pl-6 pr-4 pb-3 pt-4">
                  <div className="flex items-center justify-center relative">
                    <p className="text-[20px] font-inter font-medium ">
                      Price Range
                    </p>

                    <IconButton
                      sx={{ position: "absolute", right: "0px", top: "-5px" }}
                    >
                      <CloseOutlinedIcon
                        onClick={handleCloseClick}
                        className="w-[32px] h-[32px] p-[4px] font-bold bg-white border-[0.5px] border-[#EBECED] shadow-[0px_4px_4px_rgba(0,0,0,0.06)] rounded-[4px]"
                      />
                    </IconButton>
                  </div>
                </div>

                <div className="mt-[75px] ">
                  <div>
                    <p className="mt-[24px] text-[#181818] font-medium text-[16px] font-inter">
                      Minimum Price
                    </p>
                    <TextField
                      id="carOffer"
                      variant="outlined"
                      type="text"
                      size="small"
                      placeholder="Enter your price"
                      value={miniprice}
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

                    <p className=" text-[#181818] font-medium text-[16px] font-inter">
                      Maximum Price
                    </p>
                    <TextField
                      id="carOffer"
                      variant="outlined"
                      type="text"
                      size="small"
                      placeholder="Enter your price"
                      value={maxprice}
                      onChange={handleMaxPriceChange}
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
                </div>
              </DialogContent>

              <Dialog
                open={openNoModal}
                onClose={handleCloseNoModal}
                sx={{
                  "& .MuiPaper-root": {
                    // Targets the modal's white background
                    borderRadius: "12px",
                    width: "364px", // Ensures the width remains as expected
                    height: "355px",
                  },
                }}
              >
                <div
                  style={{
                    textAlign: "center",
                    fontSize: "24px",
                    fontWeight: "bold",
                    height: "100%",
                  }}
                >
                  <div className="w-[80%] m-auto">
                    <div className="flex justify-center mt-[30px]">
                      <IconButton
                        sx={{ position: "absolute", right: "0px", top: "-5px" }}
                      >
                        <CloseOutlinedIcon
                          onClick={handleCloseNoModal}
                          className="w-[32px] h-[32px] p-[4px] font-bold bg-white border-[0.5px] border-[#EBECED] shadow-[0px_4px_4px_rgba(0,0,0,0.06)] rounded-[4px]"
                        />
                      </IconButton>
                      <img src={offerNot} alt="" />
                    </div>
                    <p className="text-[#181818] font-medium text-[24px] font-inter mt-[20px] text-center">
                      No Cars Available in Your Price Range
                    </p>
                    <p className="text-[#67696D] font-normal text-[16px] mt-[16px] mb-[25px] text-center">
                      Please increase your minimum price or adjust your maximum
                      price to see available options.
                    </p>
                  </div>
                </div>
              </Dialog>

              <div className="absolute bottom-0 border-t border-[grey] left-0 right-0 bg-white p-4 rounded-b-[10px]">
                <button
                  disabled={!miniprice.trim() || !maxprice.trim()}
                  className={`w-full h-[52px] rounded-[6px] text-white cursor-pointer ${
                    miniprice.trim() && maxprice.trim()
                      ? "bg-[#023E8A]"
                      : "bg-[#023E8A] cursor-not-allowed opacity-50"
                  }`}
                >
                  Submit Offer
                </button>
              </div>
            </Dialog>
          </div>
        </div>
      ) : (
        // web view

        <div className="bg-white w-full h-full">
          <div className="w-[90%] m-auto ">
            <div className="pt-[18.5px] mb-[18.5px]">
              <Breadcrumb />
            </div>
          </div>
          <Divider />

          <div className="w-[90%] m-auto ">
            <div className="flex justify-between mt-[40px] mb-[25px]">
              <p>{cars.length} Results</p>
              <div
                className="relative flex items-center gap-1 justify-normal border-1 border-gray-300 py-1 px-4 rounded-lg cursor-pointer "
                onClick={() => setShowSortModal(!showSortModal)}
              >
                <MdOutlineSort />
                <p className="cursor-pointer">
                  Sort by: <span>Recommended</span>
                </p>
                {showSortModal && (
                  <div className="absolute px-2 top-10 left-0 bg-white shadow-lg flex flex-col justify-normal items-start w-full py-2">
                    <p className="hover:bg-gray-100 cursor-pointer p-2 w-full rounded-md">
                      Recommended
                    </p>
                    <p className="hover:bg-gray-100 cursor-pointer p-2 w-full rounded-md">
                      Price: Low to High
                    </p>
                    <p className="hover:bg-gray-100 cursor-pointer p-2 w-full rounded-md">
                      Price:High to Low
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="w-[90%] m-auto grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4 ">
            {paginatedItems.length > 0 ? (
              paginatedItems.map((car) => (
                <Card key={car.id} className="p-[20px] w-[100%] cursor-pointer">
                  {/* <div className="flex flex-col sm:flex-row gap-[10px]"> */}
                  <div className="flex justify-normal items-center  gap-3 pb-4">
                    <img src={car.image} alt="" />
                    <p className="mt-[10px] text-[#181818] text-[16px]">
                      Private Car
                    </p>
                  </div>

                  <div className="flex gap-[3px] mb-[10px] mt-[10px]">
                    <p>
                      {car.seatLeft} {car.spaceleft}
                    </p>
                    <CircleIcon
                      sx={{
                        width: "4px",
                        height: "4px",
                        marginTop: "10px",
                        marginLeft: "2px",
                      }}
                    />
                    <div>
                      {car.fuelIcon} {car.full}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2 items-center">
                      <div className=" ">{car.timeIcon}</div>
                      <p className="">{car.time}</p>
                    </div>
                    <div className="flex gap-[2px] items-center">
                      <IoIosCheckmarkCircleOutline
                        fill="#2D9C5E"
                        fontSize={25}
                      />
                      <p className="text-[#2D9C5E]">{car.noShows}</p>
                    </div>

                    <div className="flex gap-[2px] items-center">
                      <IoIosCheckmarkCircleOutline
                        fill="#2D9C5E"
                        fontSize={25}
                      />
                      <p className="text-[#2D9C5E]">{car.refundable}</p>
                    </div>
                  </div>
                  <div className="flex justify-between mt-[12px]">
                    <div>
                      <p>{car.perDay}</p>
                      <p className="font-bold">{car.price}</p>
                    </div>

                    <div
                      onClick={handleSubmitMobileOffer}
                      className="bg-[#023E8A] text-white text-center pt-[10px] rounded-[8px] w-[93px] h-[42px] text-[14px] cursor-pointer"
                    >
                      <button className=" cursor-pointer  align-middle">
                        {car.button}
                      </button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500 font-bold text-lg">Not Available</p>
              </div>
            )}

            <Stack spacing={2} className="mt-20 pb-[80px]">
              <Pagination
                count={Math.ceil(ITEMS_PER_PAGE)}
                shape="rounded"
                page={page}
                onChange={handleChange}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                }}
              />
            </Stack>

            <Dialog
              open={openClick}
              onClose={handleCloseClick}
              sx={{
                "& .MuiBackdrop-root": {
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                },
                "& .MuiPaper-root": {
                  width: "693px",
                  height: "451px",
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
                }}
              >
                <div className="absolute z-40 top-0 left-0 right-0 bg-white border-b border-gray-300 rounded-t-[10px] pl-6 pr-4 pb-3 pt-4">
                  <div className="flex items-center justify-center relative">
                    <p className="text-[20px] font-inter font-medium ">
                      Price Range
                    </p>

                    <IconButton
                      sx={{ position: "absolute", right: "0px", top: "-5px" }}
                    >
                      <CloseOutlinedIcon
                        onClick={handleCloseClick}
                        className="w-[32px] h-[32px] p-[4px] font-bold bg-white border-[0.5px] border-[#EBECED] shadow-[0px_4px_4px_rgba(0,0,0,0.06)] rounded-[4px]"
                      />
                    </IconButton>
                  </div>
                </div>

                <div className="mt-[75px] ">
                  <div>
                    <p className="mt-[24px] text-[#181818] font-medium text-[16px] font-inter">
                      Minimum Price
                    </p>
                    <TextField
                      id="carOffer"
                      variant="outlined"
                      type="text"
                      size="small"
                      placeholder="Enter your price"
                      value={miniprice}
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

                    <p className=" text-[#181818] font-medium text-[16px] font-inter">
                      Maximum Price
                    </p>
                    <TextField
                      id="carOffer"
                      variant="outlined"
                      type="text"
                      size="small"
                      placeholder="Enter your price"
                      value={maxprice}
                      onChange={handleMaxPriceChange}
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
                </div>
              </DialogContent>

              <Dialog
                open={openNoModal}
                onClose={handleCloseNoModal}
                sx={{
                  "& .MuiPaper-root": {
                    // Targets the modal's white background
                    borderRadius: "12px",
                    width: "364px", // Ensures the width remains as expected
                    height: "355px",
                  },
                }}
              >
                <div
                  style={{
                    textAlign: "center",
                    fontSize: "24px",
                    fontWeight: "bold",
                    height: "100%",
                  }}
                >
                  <div className="w-[80%] m-auto">
                    <div className="flex justify-center mt-[30px]">
                      <IconButton
                        sx={{ position: "absolute", right: "0px", top: "-5px" }}
                      >
                        <CloseOutlinedIcon
                          onClick={handleCloseNoModal}
                          className="w-[32px] h-[32px] p-[4px] font-bold bg-white border-[0.5px] border-[#EBECED] shadow-[0px_4px_4px_rgba(0,0,0,0.06)] rounded-[4px]"
                        />
                      </IconButton>
                      <img src={offerNot} alt="" />
                    </div>
                    <p className="text-[#181818] font-medium text-[24px] font-inter mt-[20px] text-center">
                      No Cars Available in Your Price Range
                    </p>
                    <p className="text-[#67696D] font-normal text-[16px] mt-[16px] mb-[25px] text-center">
                      Please increase your minimum price or adjust your maximum
                      price to see available options.
                    </p>
                  </div>
                </div>
              </Dialog>

              <div className="absolute bottom-0 border-t border-[grey] left-0 right-0 bg-white p-4 rounded-b-[10px]">
                <button
                  onClick={handleSubmitOffer}
                  disabled={!miniprice.trim() || !maxprice.trim()}
                  className={`w-full h-[52px] rounded-[6px] text-white cursor-pointer ${
                    miniprice.trim() && maxprice.trim()
                      ? "bg-[#023E8A]"
                      : "bg-[#023E8A] cursor-not-allowed opacity-50"
                  }`}
                >
                  Submit Offer
                </button>
              </div>
            </Dialog>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarList;
