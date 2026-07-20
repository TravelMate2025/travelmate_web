import { useRef } from "react";
import { FaPlane } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import { useMediaQuery } from "react-responsive";
import { searchFlightRoute } from "../../../features/flights/utils/searchFlightRoute";

// Illustrative routes -- no "most searched routes" aggregation exists in
// the backend yet, same reasoning as Transfers' PopularTransferRoutes and
// the native app's FlightsPopularRoutes. Same real domestic/international
// routes and pricing reused as-is from the native mock for cross-platform
// consistency, not invented separately here. No route photography exists
// in the codebase for flights (unlike Transfers), so a gradient + plane
// treatment is used instead of fabricating destination photos. Tapping
// re-runs a fresh one-way search -- flights have no stable resumable offer.
interface PopularRoute {
  id: string;
  originCode: string;
  originCity: string;
  destinationCode: string;
  destinationCity: string;
  duration: string;
  priceFrom: number;
  kind: "domestic" | "international";
}

const routes: PopularRoute[] = [
  { id: "r1", originCode: "LOS", originCity: "Lagos", destinationCode: "ABV", destinationCity: "Abuja", duration: "1h 5m", priceFrom: 48500, kind: "domestic" },
  { id: "r2", originCode: "ABV", originCity: "Abuja", destinationCode: "PHC", destinationCity: "Port Harcourt", duration: "55m", priceFrom: 52000, kind: "domestic" },
  { id: "r3", originCode: "LOS", originCity: "Lagos", destinationCode: "LHR", destinationCity: "London", duration: "6h 40m", priceFrom: 850000, kind: "international" },
  { id: "r4", originCode: "LOS", originCity: "Lagos", destinationCode: "DXB", destinationCity: "Dubai", duration: "7h 20m", priceFrom: 720000, kind: "international" },
];

const gradients: Record<PopularRoute["kind"], string> = {
  domestic: "linear-gradient(135deg, #0c3c6e, #1c73c2 55%, #57a3e4)",
  international: "linear-gradient(135deg, #052a5c, #0e5aa8 55%, #2f86d6)",
};

const formatPrice = (amount: number) => `From ₦${amount.toLocaleString()}`;

const FlightsPopularRoutes = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (amount: number) => {
    scrollContainerRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  };

  const handleSelect = (route: PopularRoute) => {
    searchFlightRoute(navigate, {
      originCode: route.originCode,
      originCity: route.originCity,
      destinationCode: route.destinationCode,
      destinationCity: route.destinationCity,
    });
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
          onClick={() => handleSelect(r)}
          className="w-[258px] h-[168px] flex-shrink-0 text-left cursor-pointer group relative overflow-hidden rounded-[20px] shadow-[0_10px_24px_-12px_rgba(15,23,42,0.35)]"
          style={{ background: gradients[r.kind] }}
        >
          <FaPlane
            className="absolute -right-1.5 -top-1.5 text-white/15 rotate-[35deg] group-hover:scale-105 transition-transform duration-300"
            size={76}
          />
          <span className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm text-white text-[11px] font-bold font-inter px-2.5 py-1 rounded-full">
            {formatPrice(r.priceFrom)}
          </span>
          <div className="absolute left-4 bottom-3.5 right-4 text-white">
            <p className="text-[15px] font-semibold font-inter">
              {r.originCity} → {r.destinationCity}
            </p>
            <p className="text-[12px] font-inter opacity-85 mt-0.5">
              {r.duration} · {r.kind === "domestic" ? "Domestic" : "International"}
            </p>
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
          <p className="font-normal text-[#4E4F52] font-inter text-[14px]">Most searched domestic &amp; international routes</p>
          <div className="mt-[10px] w-full overflow-x-auto relative">{cards}</div>
        </div>
      ) : (
        <div className="mt-[60px]">
          <div className="flex justify-between">
            <div>
              <p className="text-[24px] font-semibold font-inter text-[#181818]">Popular routes</p>
              <p className="font-normal text-[#4E4F52] font-inter">Most searched domestic and international routes</p>
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

export default FlightsPopularRoutes;
