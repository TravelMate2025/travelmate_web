import { useRef } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import { useMediaQuery } from "react-responsive";
import routeCityStreet from "../../../assets/images/transfers/route-city-street.jpg";
import routeAirport from "../../../assets/images/transfers/route-airport.jpg";
import routeSkyline from "../../../assets/images/transfers/route-skyline.jpg";
import routeDusk from "../../../assets/images/transfers/route-dusk.jpg";

// Illustrative routes -- no "popular routes" aggregation exists in the
// backend yet, so these are representative airport-to-city routes rather
// than a real ranked list. Kept honest via generic imagery, not claiming
// to be photos of the actual pickup/dropoff points.
interface Route {
  id: string;
  from: string;
  to: string;
  image: string;
  city: string;
  minutes: number;
  priceFrom: number;
}

const routes: Route[] = [
  { id: "r1", from: "MMIA", to: "Victoria Island", image: routeCityStreet, city: "Lagos", minutes: 22, priceFrom: 8500 },
  { id: "r2", from: "MMIA", to: "Lekki Phase 1", image: routeAirport, city: "Lagos", minutes: 38, priceFrom: 11000 },
  { id: "r3", from: "Nnamdi Azikiwe", to: "Wuse 2", image: routeSkyline, city: "Abuja", minutes: 25, priceFrom: 7200 },
  { id: "r4", from: "MMIA", to: "Ikeja GRA", image: routeDusk, city: "Lagos", minutes: 18, priceFrom: 9800 },
];

const formatPrice = (amount: number) => `From ₦${amount.toLocaleString()}`;

const scrollToSearch = () => {
  document.getElementById("transfers-search")?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const PopularTransferRoutes = () => {
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
      {routes.map((r) => (
        <button
          key={r.id}
          type="button"
          onClick={scrollToSearch}
          className="w-[270px] h-[176px] flex-shrink-0 text-left cursor-pointer group relative overflow-hidden rounded-[20px] bg-gray-100 shadow-[0_10px_24px_-12px_rgba(15,23,42,0.35)]"
        >
          <img
            src={r.image}
            alt={`${r.from} to ${r.to}`}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <span className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm text-white text-[11px] font-bold font-inter px-2.5 py-1 rounded-full">
            {formatPrice(r.priceFrom)}
          </span>
          <div className="absolute left-4 bottom-3.5 right-4 text-white">
            <p className="text-[15px] font-semibold font-inter">{r.from} → {r.to}</p>
            <div className="flex items-center gap-1.5 text-[12px] font-inter opacity-90 mt-0.5">
              <FaMapMarkerAlt size={10} />
              <span>{r.minutes} mins · {r.city}</span>
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
          <p className="text-[16px] font-semibold font-inter text-[#181818]">Popular routes</p>
          <p className="font-normal text-[#4E4F52] font-inter text-[14px]">Most booked from Lagos &amp; Abuja airports</p>
          <div className="mt-[10px] w-full overflow-x-auto relative">{cards}</div>
        </div>
      ) : (
        <div className="mt-[60px]">
          <div className="flex justify-between">
            <div>
              <p className="text-[24px] font-semibold font-inter text-[#181818]">Popular routes</p>
              <p className="font-normal text-[#4E4F52] font-inter">The transfers travellers book most from Lagos and Abuja airports</p>
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

export default PopularTransferRoutes;
