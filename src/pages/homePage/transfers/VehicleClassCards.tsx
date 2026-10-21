import { useRef } from "react";
import { FaStar, FaUser, FaSuitcase } from "react-icons/fa";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import { useMediaQuery } from "react-responsive";
import vehicleEconomy from "../../../assets/images/transfers/vehicle-economy.jpg";
import vehicleSuv from "../../../assets/images/transfers/vehicle-suv.jpg";
import vehicleExecutive from "../../../assets/images/transfers/vehicle-executive.jpg";
import vehicleVan from "../../../assets/images/transfers/vehicle-van.jpg";

// Illustrative vehicle classes -- there's no real per-class transfer
// inventory in the backend yet (see plan.md's parked/needs-backend list),
// so these are representative categories with placeholder pricing/ratings,
// not real fleet data. "Select" scrolls back up to the search form rather
// than claiming to filter by a class that doesn't functionally exist yet.
interface VehicleClass {
  id: string;
  name: string;
  image: string;
  badge?: string;
  rating: number;
  reviews: string;
  passengers: number;
  luggage: number;
  priceFrom: number;
}

const vehicleClasses: VehicleClass[] = [
  {
    id: "economy",
    name: "Economy",
    image: vehicleEconomy,
    badge: "Most booked",
    rating: 4.7,
    reviews: "1.2k",
    passengers: 3,
    luggage: 2,
    priceFrom: 8500,
  },
  {
    id: "suv",
    name: "Comfort SUV",
    image: vehicleSuv,
    rating: 4.8,
    reviews: "860",
    passengers: 5,
    luggage: 4,
    priceFrom: 13200,
  },
  {
    id: "executive",
    name: "Executive",
    image: vehicleExecutive,
    badge: "Premium",
    rating: 4.9,
    reviews: "410",
    passengers: 3,
    luggage: 2,
    priceFrom: 22000,
  },
  {
    id: "van",
    name: "Group Van",
    image: vehicleVan,
    rating: 4.6,
    reviews: "295",
    passengers: 8,
    luggage: 6,
    priceFrom: 28500,
  },
];

const formatPrice = (amount: number) => `₦${amount.toLocaleString()}`;

const scrollToSearch = () => {
  document.getElementById("transfers-search")?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const VehicleClassCards = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (amount: number) => {
    scrollContainerRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  };

  const cards = (
    <div
      ref={scrollContainerRef}
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      className="flex gap-6 overflow-x-auto scroll-smooth flex-nowrap"
    >
      {vehicleClasses.map((v) => (
        <button
          key={v.id}
          type="button"
          onClick={scrollToSearch}
          className="w-[250px] flex-shrink-0 text-left cursor-pointer group bg-white rounded-[20px] border border-[#EBECED] shadow-[0_10px_24px_-12px_rgba(15,23,42,0.35)] overflow-hidden"
        >
          <div className="relative w-full h-[140px] overflow-hidden bg-gray-100">
            <img
              src={v.image}
              alt={v.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {v.badge && (
              <span className="absolute top-2 left-2 bg-[#023E8A]/90 text-white text-[11px] font-bold font-inter px-2.5 py-1 rounded-full">
                {v.badge}
              </span>
            )}
          </div>
          <div className="p-4">
            <p className="text-[16px] font-semibold font-inter text-[#181818]">{v.name}</p>
            <div className="flex items-center gap-1 text-[12px] font-inter mt-1">
              <FaStar size={11} className="text-[#e8a33d]" />
              <span className="font-bold text-[#181818]">{v.rating}</span>
              <span className="text-[#8A9096]">({v.reviews})</span>
            </div>
            <div className="flex items-center gap-3 text-[#8A9096] text-[12px] font-inter mt-2.5 mb-3.5">
              <span className="flex items-center gap-1"><FaUser size={11} /> {v.passengers}</span>
              <span className="flex items-center gap-1"><FaSuitcase size={11} /> {v.luggage}</span>
            </div>
            <div className="flex items-baseline justify-between">
              <p className="text-[17px] font-bold font-inter text-[#181818]">
                {formatPrice(v.priceFrom)}
                <span className="text-[11.5px] font-normal text-[#8A9096]"> /trip</span>
              </p>
              <span className="text-[12.5px] font-bold font-inter text-[#023E8A] bg-[#EAF0FA] px-3 py-1.5 rounded-[10px]">
                Select
              </span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );

  return (
    <div className="w-[90%] m-auto">
      {isMobile ? (
        <div className="mt-[6px]">
          <p className="text-[16px] font-semibold font-inter text-[#181818]">Choose your ride</p>
          <p className="font-normal text-[#4E4F52] font-inter text-[14px]">Every price includes the driver and a free wait</p>
          <div className="mt-[10px] w-full overflow-x-auto relative">{cards}</div>
        </div>
      ) : (
        <div className="mt-[60px]">
          <div className="flex justify-between">
            <div>
              <p className="text-[24px] font-semibold font-inter text-[#181818]">Choose your ride</p>
              <p className="font-normal text-[#4E4F52] font-inter">Every price includes the driver, fuel, and a free 15-minute wait</p>
            </div>
            <div className="flex gap-[34px]">
              <div
                onClick={() => scrollBy(-300)}
                className="w-[44px] h-[44px] cursor-pointer bg-white border border-[#EBECED] rounded-[4px] shadow-md shadow-[#00000014] flex items-center justify-center"
              >
                <KeyboardArrowLeftOutlinedIcon className="scale-150" />
              </div>
              <div
                onClick={() => scrollBy(300)}
                className="w-[44px] h-[44px] bg-white border cursor-pointer border-[#EBECED] rounded-[4px] shadow-md shadow-[#00000014] flex items-center justify-center"
              >
                <KeyboardArrowRightOutlinedIcon className="scale-150" />
              </div>
            </div>
          </div>
          <div className="mt-[38px] w-full overflow-x-auto relative">{cards}</div>
        </div>
      )}
    </div>
  );
};

export default VehicleClassCards;
