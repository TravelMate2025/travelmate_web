import React, { useState, useMemo } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import Breadcrumb from "../../../pages/BreadCrumb";
import { Divider } from "@mui/material";
import { useMediaQuery } from "react-responsive";
import Card from "@mui/material/Card";

import AirlineSeatReclineNormalIcon from "@mui/icons-material/AirlineSeatReclineNormal";
import { Stack, Pagination } from "@mui/material";
import LuggageOutlinedIcon from "@mui/icons-material/LuggageOutlined";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Edit3Icon, MapPin } from "lucide-react";
import { MdOutlineSort } from "react-icons/md";
import SortOverlay from "./SortOverlay";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { BookingFormData, CarTransferOption } from "../types/booking";
import { setSelectedTransfer } from "../carPaymentSlice";
import { bookingFlowRoutes } from "../../shared/bookingFlowRoutes";

export interface CarListProps {
  departureInfo: BookingFormData;
  searchResults: CarTransferOption[];
  loading: boolean;
  OpenForm: () => void;
}

const ITEMS_PER_PAGE = 8;

const getCurrencySymbol = (currency?: string) => {
  if (currency === "NGN") return "₦";
  if (currency === "USD") return "$";
  if (currency === "GBP") return "£";
  if (currency === "EUR") return "€";
  return currency ? `${currency} ` : "₦";
};

const getPrice = (car: CarTransferOption) =>
  car.price?.totalAmount ?? car.base_fare ?? 0;

const getImage = (car: CarTransferOption) =>
  car.content?.images?.[0]?.secureUrl ||
  car.content?.images?.[0]?.url ||
  "";

const getFreeCancellationPolicy = (car: CarTransferOption) =>
  car.cancellationPolicies?.find((p) => p.optionId === "FREE_CANCELLATION");

const CarList: React.FC<CarListProps> = ({
  departureInfo,
  searchResults,
  OpenForm,
  loading,
}) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cars = useMemo(() => searchResults || [], [searchResults]);

  const [page, setPage] = useState<number>(1);
  const [showSortModal, setShowSortModal] = useState(false);
  const [sortOrder, setSortOrder] = useState<
    "Recommended" | "Low to High" | "High to Low"
  >("Recommended");

  const sortedCars = useMemo(() => {
    const items = [...cars];
    if (sortOrder === "Low to High") return items.sort((a, b) => getPrice(a) - getPrice(b));
    if (sortOrder === "High to Low") return items.sort((a, b) => getPrice(b) - getPrice(a));
    return cars;
  }, [cars, sortOrder]);

  const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const paginatedItems = useMemo(
    () => sortedCars.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE),
    [sortedCars, page]
  );

  const handleSubmitOffer = (car: CarTransferOption) => {
    dispatch(setSelectedTransfer(car));
    navigate(`${bookingFlowRoutes.transferDetail}/${car.id}`, {
      state: { car, departureInfo },
    });
  };

  const TransferCard = ({ car }: { car: CarTransferOption }) => {
    const freeCancellation = getFreeCancellationPolicy(car);
    const currencySymbol = getCurrencySymbol(car.currency || car.price?.currencyId);
    const price = getPrice(car);
    const image = getImage(car);

    return (
      <Card className="w-full cursor-pointer overflow-hidden">
        {/* Image + title */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-100">
          <img
            src={image || "/assets/carImage.png"}
            alt={car.name || "Transfer"}
            className="w-24 h-20 object-cover bg-[#0000001A] rounded-lg flex-shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/assets/carImage.png";
            }}
          />
          <div className="flex flex-col gap-1 min-w-0">
            <p className="text-[#181818] text-[15px] font-semibold leading-tight">
              {car.name || car.vehicle.name}
            </p>
            <p className="text-xs text-[#67696D] capitalize">
              {car.vehicle.name || car.vehicle.code?.replace(/_/g, " ")}
            </p>
          </div>
        </div>

        <div className="p-4 flex flex-col gap-3">
          {/* Route */}
          <div className="flex items-start gap-2 text-sm text-[#181818]">
            <MapPin size={16} className="text-[#023E8A] mt-0.5 flex-shrink-0" />
            <span className="leading-tight">
              <span className="font-medium">{car.pickupInformation?.from?.description || departureInfo.pickupLocaDescription}</span>
              {" → "}
              <span className="font-medium">{car.pickupInformation?.to?.description || departureInfo.dropoffLocaDescription || departureInfo.dropoffLocation}</span>
            </span>
          </div>

          {/* Capacity row */}
          <div className="flex items-center gap-4 text-sm text-[#67696D]">
            <div className="flex items-center gap-1">
              <AirlineSeatReclineNormalIcon fontSize="small" />
              <span>{car.passenger_capacity ?? car.maxPaxCapacity ?? "—"} Seats</span>
            </div>
            <div className="flex items-center gap-1">
              <LuggageOutlinedIcon fontSize="small" />
              <span>{car.luggage_capacity ?? "—"} Luggage</span>
            </div>
          </div>

          {/* Features */}
          {car.features && car.features.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {car.features.slice(0, 4).map((feature, i) => (
                <span
                  key={i}
                  className="text-xs bg-[#F0F4FF] text-[#023E8A] px-2 py-0.5 rounded-full"
                >
                  {feature}
                </span>
              ))}
            </div>
          )}

          {/* Cancellation */}
          {freeCancellation ? (
            <div className="flex items-center gap-1">
              <IoIosCheckmarkCircleOutline fill="#2D9C5E" fontSize={18} />
              <p className="text-[#2D9C5E] text-xs">
                {freeCancellation.policyCopy ||
                  `Free cancellation up to ${freeCancellation.cancelDeadlineHoursBeforeCheckIn ?? 24} hours before pickup`}
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <IoIosCheckmarkCircleOutline fill="#888" fontSize={18} />
              <p className="text-xs text-[#67696D]">Non-refundable</p>
            </div>
          )}

          {/* Price + CTA */}
          <div className="flex justify-between items-center mt-1">
            <div>
              <p className="text-xs text-[#67696D]">From</p>
              <p className="text-[16px] font-bold text-[#181818]">
                {currencySymbol}{price.toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => handleSubmitOffer(car)}
              className="bg-[#023E8A] text-white text-sm text-center rounded-md cursor-pointer px-5 py-2.5"
            >
              Select
            </button>
          </div>
        </div>
      </Card>
    );
  };

  const SortControl = ({ mobile }: { mobile: boolean }) =>
    mobile ? (
      <div
        className="flex items-center gap-1 border border-[#023E8A] py-1 px-4 rounded-lg cursor-pointer"
        onClick={() => setShowSortModal(true)}
      >
        <MdOutlineSort />
        <p>Sort</p>
      </div>
    ) : (
      <div
        className="relative flex items-center gap-1 border border-gray-300 py-1 px-4 rounded-lg cursor-pointer"
        onClick={() => setShowSortModal(!showSortModal)}
      >
        <MdOutlineSort />
        <p>
          Sort by: <span className="font-medium">{sortOrder}</span>
        </p>
        {showSortModal && (
          <div className="absolute px-2 top-10 left-0 bg-white shadow-lg flex flex-col items-start w-48 py-2 z-10">
            {(["Recommended", "Low to High", "High to Low"] as const).map((opt) => (
              <p
                key={opt}
                className="hover:bg-gray-100 cursor-pointer p-2 w-full rounded-md text-sm"
                onClick={() => {
                  setSortOrder(opt);
                  setShowSortModal(false);
                }}
              >
                {opt === "Recommended" ? "Recommended" : `Price: ${opt}`}
              </p>
            ))}
          </div>
        )}
      </div>
    );

  const EmptyMessage = () => (
    <div className="col-span-2 flex items-center justify-center h-64">
      <p className="text-gray-500 font-bold text-lg">No transfers available</p>
    </div>
  );

  const PaginationBar = () => (
    <div className="col-span-2 mt-8 pb-12">
      <Stack spacing={2}>
        <Pagination
          count={Math.ceil(cars.length / ITEMS_PER_PAGE)}
          shape="rounded"
          page={page}
          onChange={handleChange}
          sx={{ display: "flex", justifyContent: "center" }}
        />
      </Stack>
    </div>
  );

  return (
    <div>
      {loading && <div className="text-center py-4 text-gray-500">Loading...</div>}

      {/* Mobile summary bar */}
      <div className="mb-4 px-6 py-4 border-[#023E8A] rounded-md lg:mt-20 border flex justify-between items-start lg:hidden mt-20 mx-4">
        <div>
          <p>
            {departureInfo.pickupLocaDescription} → {departureInfo.dropoffLocaDescription || departureInfo.dropoffLocation}
          </p>
          <div className="flex text-xs text-[#67696D] gap-3 items-center mt-1">
            <p>{departureInfo.pickupDate}, {departureInfo.pickupTime}</p>
          </div>
        </div>
        <Edit3Icon onClick={OpenForm} className="cursor-pointer" />
      </div>

      {isMobile ? (
        <div>
          {showSortModal && (
            <SortOverlay
              closeDialog={() => setShowSortModal(false)}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
          )}
          <div className="flex justify-between py-6 px-6">
            <p>{cars.length} Result{cars.length !== 1 ? "s" : ""}</p>
            <SortControl mobile />
          </div>
          <div className="w-[90%] m-auto grid grid-cols-1 gap-4">
            {paginatedItems.length > 0
              ? paginatedItems.map((car) => <TransferCard key={car?.id} car={car} />)
              : <EmptyMessage />}
            <PaginationBar />
          </div>
        </div>
      ) : (
        <div className="bg-white w-full h-full">
          <div className="w-[90%] m-auto pt-[18.5px] mb-[18.5px]">
            <Breadcrumb />
          </div>
          <Divider />
          <div className="w-[90%] m-auto">
            <div className="flex justify-between mt-[40px] mb-[25px]">
              <p>{cars.length} Result{cars.length !== 1 ? "s" : ""}</p>
              <SortControl mobile={false} />
            </div>
          </div>
          <div className="w-[90%] m-auto grid grid-cols-1 lg:grid-cols-2 gap-4 pb-20">
            {paginatedItems.length > 0
              ? paginatedItems.map((car) => <TransferCard key={car?.id} car={car} />)
              : <EmptyMessage />}
            <PaginationBar />
          </div>
        </div>
      )}
    </div>
  );
};

export default CarList;
