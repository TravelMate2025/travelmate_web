import React, { useState, useMemo } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import Breadcrumb from "../../../pages/BreadCrumb";
import { Divider } from "@mui/material";
import { useMediaQuery } from "react-responsive";
import Card from "@mui/material/Card";

import AirlineSeatReclineNormalIcon from "@mui/icons-material/AirlineSeatReclineNormal";
import { Stack, Pagination } from "@mui/material";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import LuggageOutlinedIcon from "@mui/icons-material/LuggageOutlined";
import { useNavigate } from "react-router-dom";
import { Clock, Edit3Icon } from "lucide-react";
import { MdOutlineSort } from "react-icons/md";
import SortOverlay from "./SortOverlay";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { BookingFormData } from "../types/booking";

export interface CarListProps {
  departureInfo: BookingFormData;
  searchResults: any;
  loading: boolean;
  OpenForm: () => void;
}
const CarList: React.FC<CarListProps> = ({
  departureInfo,
  searchResults,
  // loading,
  OpenForm,
}) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const navigate = useNavigate();

  const cars = searchResults || [];

  const [page, setPage] = useState<number>(1);
  const [showSortModal, setShowSortModal] = useState(false);

  const ITEMS_PER_PAGE = 8;
  const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  const paginatedItems = useMemo(() => {
    return cars.services.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  }, [cars, page]);

  const handleSubmitOffer = (car: any) => {
    navigate("/offer-accepted-page", {
      state: {
        car,
        departureInfo,
      },
    });
  };

  return (
    <div>
      <div className="mb-4 px-6 py-4 border-[#023E8A] rounded-md lg:mt-20 border flex justify-between items-start lg:hidden mt-20 mx-4">
        <div>
          <p>
            {departureInfo.pickUpLocaDescription} to{" "}
            {departureInfo.dropoffLocation}
          </p>
          <div className="flex text-xs text-[#67696D] gap-3 items-center">
            <p>
              {departureInfo.pickupDate}, {departureInfo.pickupTime}
            </p>
            <p>
              ₦{departureInfo.priceRange.min} - ₦{departureInfo.priceRange.max}
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
              paginatedItems.map((car: any) => (
                <Card key={car.id} className="p-[20px] w-[100%] cursor-pointer">
                  {/* <div className="flex flex-col sm:flex-row gap-[10px]"> */}
                  <div className="flex justify-normal items-center  gap-3 pb-4">
                    <img
                      src={
                        car?.content?.images[0].url || `../assets/carImage.png`
                      }
                      alt=""
                      className="w-28 h-24 object-contain bg-[#0000001A] rounded-lg"
                    />
                    <p className="mt-[10px] text-[#181818] text-[16px]">
                      {car.category.name} Car
                    </p>
                  </div>
                  {/* {car.content.transferDetailInfo.map((item: any) => ( */}
                  <div className="flex flex-col  gap-[3px] mb-[10px] mt-[10px]">
                    <div className="text-[14px]">
                      <AirlineSeatReclineNormalIcon />
                      <span>
                        {car.content.transferDetailInfo[2].name.slice(0, 2)}{" "}
                        Seats
                      </span>
                    </div>

                    <div className="text-[14px]">
                      <LuggageOutlinedIcon />
                      <span>
                        {car.content.transferDetailInfo[3].name.slice(0, 2)}{" "}
                        Bags + 1 hand luggage per passenger
                      </span>
                    </div>
                  </div>
                  {/* ))} */}

                  {/* {car.content.transferDetailInfo.map((item:any) => ( */}
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2 items-center">
                      <i className="">
                        <Clock />
                      </i>
                      <p className="text-xs">Estimated time: 90 minutes</p>
                    </div>
                    <div className="flex gap-[2px] items-center">
                      <IoIosCheckmarkCircleOutline
                        fill="#2D9C5E"
                        fontSize={25}
                      />
                      <p className="text-[#2D9C5E] text-xs">
                        Cancellation allowed 24 hours before pick up
                      </p>
                    </div>

                    <div className="flex gap-[2px] items-center">
                      <IoIosCheckmarkCircleOutline
                        fill="#2D9C5E"
                        fontSize={25}
                      />
                      <p className="text-[#2D9C5E] text-xs">
                        Full refund if cancelled 24 hours before pick up
                      </p>
                    </div>
                  </div>
                  {/* // ))} */}
                  <div className="flex justify-between mt-[12px]">
                    <div>
                      <p className="text-[13px]">Price</p>
                      <p className="text-[14px] font-bold">
                        &#8364;{car.cancellationPolicies[0].amount}
                      </p>
                    </div>

                    <div
                      onClick={() => handleSubmitOffer(car)}
                      className="bg-[#023E8A] text-white text-center pt-[10px] rounded-[8px] w-[93px] h-[42px] text-[14px] cursor-pointer"
                    >
                      <button className=" cursor-pointer  align-middle">
                        Select Car
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
              paginatedItems.map((car: any) => (
                <Card key={car.id} className="p-[20px] w-[100%] cursor-pointer">
                  <div className="flex justify-normal items-center  gap-3 pb-4">
                    <img
                      src={
                        car?.content?.images[0].url || `../assets/carImage.png`
                      }
                      alt=""
                      className="w-28 h-24 object-contain bg-[#0000001A] rounded-lg"
                    />
                    <p className="mt-[10px] text-[#181818] text-[16px]">
                      {car.category.name} Car
                    </p>
                  </div>
                  <div className="flex  gap-[3px] mb-[10px] mt-[10px]">
                    <div className="text-[14px]">
                      <AirlineSeatReclineNormalIcon />
                      <span>
                        {car.content.transferDetailInfo[2].name.slice(0, 2)}{" "}
                        Seats
                      </span>
                    </div>

                    <div className="text-[14px]">
                      <LuggageOutlinedIcon />
                      <span>
                        {car.content.transferDetailInfo[3].name.slice(0, 2)}{" "}
                        Bags + 1 hand luggage per passenger
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2 items-center">
                      <i className="">
                        <Clock />
                      </i>
                      <p className="">Estimated time: 90 minutes</p>
                    </div>
                    <div className="flex gap-[2px] items-center">
                      <IoIosCheckmarkCircleOutline
                        fill="#2D9C5E"
                        fontSize={25}
                      />
                      <p className="text-[#2D9C5E] text-sm">
                        Cancellation allowed 24 hours before pick up
                      </p>
                    </div>

                    <div className="flex gap-[2px] items-center">
                      <IoIosCheckmarkCircleOutline
                        fill="#2D9C5E"
                        fontSize={25}
                      />
                      <p className="text-[#2D9C5E] text-sm">
                        Full refund if cancelled 24 hours before pick up
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between mt-[12px]">
                    <div>
                      <p className="text-[13px]">Price</p>
                      <p className="text-[14px] font-bold">
                        &#8364;{car.cancellationPolicies[0].amount}
                      </p>
                    </div>

                    <div
                      onClick={() => handleSubmitOffer(car)}
                      className="bg-[#023E8A] text-white text-center pt-[10px] rounded-[8px] w-[93px] h-[42px] text-[14px] cursor-pointer"
                    >
                      <button className=" cursor-pointer  align-middle">
                        Select car
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
          </div>
        </div>
      )}
    </div>
  );
};

export default CarList;
