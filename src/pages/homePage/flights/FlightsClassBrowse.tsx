import { useRef } from "react";
import { FaTicketAlt } from "react-icons/fa";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import { useMediaQuery } from "react-responsive";

// Illustrative fare classes with representative pricing -- there's no live
// per-class fare aggregation to show real "starting from" figures across
// all routes, same honesty pattern as Transfers' VehicleClassCards. Unlike
// vehicle class (which has zero backing), cabin class IS a real search
// parameter the flight search form already supports -- but wiring a tap
// here into the compact home search form's live state is a larger change
// than this pass; "Select" scrolls back to the search form instead of
// silently claiming to pre-fill a class, matching VehicleClassCards' same
// "Select" scroll-to-search behavior for the same reason.
interface FlightClass {
  id: string;
  name: string;
  meta: string;
  badge?: string;
  priceFrom: number;
  gradient: string;
  iconColor: string;
}

const classes: FlightClass[] = [
  {
    id: "economy",
    name: "Economy",
    meta: "Standard seat & carry-on",
    badge: "Most booked",
    priceFrom: 48500,
    gradient: "linear-gradient(135deg, #dbe6f2, #a9c3de)",
    iconColor: "#023E8A",
  },
  {
    id: "premium-economy",
    name: "Premium Economy",
    meta: "Extra legroom, priority boarding",
    priceFrom: 96000,
    gradient: "linear-gradient(135deg, #e6ecf3, #b9c9db)",
    iconColor: "#023E8A",
  },
  {
    id: "business",
    name: "Business",
    meta: "Lounge access, flat-bed seat",
    badge: "Premium",
    priceFrom: 310000,
    gradient: "linear-gradient(135deg, #0e5aa8, #2f86d6)",
    iconColor: "#FFFFFF",
  },
  {
    id: "first",
    name: "First",
    meta: "Private suite, dedicated check-in",
    priceFrom: 640000,
    gradient: "linear-gradient(135deg, #052a5c, #0e5aa8)",
    iconColor: "#FFFFFF",
  },
];

const formatPrice = (amount: number) => `₦${amount.toLocaleString()}`;

const scrollToSearch = () => {
  document.getElementById("transfers-search")?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const FlightsClassBrowse = () => {
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
      {classes.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={scrollToSearch}
          className="w-[232px] flex-shrink-0 text-left cursor-pointer group bg-white rounded-[20px] border border-[#EBECED] shadow-[0_10px_24px_-12px_rgba(15,23,42,0.35)] overflow-hidden"
        >
          <div
            className="relative w-full h-[120px] flex items-center justify-center"
            style={{ background: c.gradient }}
          >
            <FaTicketAlt size={28} color={c.iconColor} />
            {c.badge && (
              <span className="absolute top-2 left-2 bg-[#023E8A]/90 text-white text-[10.5px] font-bold font-inter px-2.5 py-1 rounded-full">
                {c.badge}
              </span>
            )}
          </div>
          <div className="p-4">
            <p className="text-[15.5px] font-semibold font-inter text-[#181818]">{c.name}</p>
            <p className="text-[12px] font-inter text-[#8A9096] mt-1 mb-3">{c.meta}</p>
            <div className="flex items-baseline justify-between">
              <p className="text-[16px] font-bold font-inter text-[#181818]">
                {formatPrice(c.priceFrom)}
                <span className="text-[11px] font-normal text-[#8A9096]"> /one-way</span>
              </p>
              <span className="text-[12px] font-bold font-inter text-[#023E8A] bg-[#EAF0FA] px-3 py-1.5 rounded-[10px]">
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
          <p className="text-[16px] font-semibold font-inter text-[#181818]">Browse by class</p>
          <p className="font-normal text-[#4E4F52] font-inter text-[14px]">Same fares, filtered by how you want to fly</p>
          <div className="mt-[10px] w-full overflow-x-auto relative">{cards}</div>
        </div>
      ) : (
        <div className="mt-[60px]">
          <div className="flex justify-between">
            <div>
              <p className="text-[24px] font-semibold font-inter text-[#181818]">Browse by class</p>
              <p className="font-normal text-[#4E4F52] font-inter">Same fares, filtered by how you want to fly</p>
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

export default FlightsClassBrowse;
