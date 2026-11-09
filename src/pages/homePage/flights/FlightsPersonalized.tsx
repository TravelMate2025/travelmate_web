import { useEffect, useState } from "react";
import { FaPlane } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getRecentlyViewed, RecentlyViewedItem } from "../../../features/shared/recentlyViewed";
import { searchFlightRoute } from "../../../features/flights/utils/searchFlightRoute";

// Real personalization, not mock data: reuses the same Recently Viewed
// tracking already recorded by the flight departure/return selection
// drawers (recordViewed(recentlyViewedFromFlightOffer(...))). Renders
// nothing if the visitor hasn't actually viewed a flight yet -- no
// fabricated "recommended for you" content standing in for real history.
// Same honesty rule as PersonalizedTransfer.tsx.
const FlightsPersonalized = () => {
  const navigate = useNavigate();
  const [item, setItem] = useState<RecentlyViewedItem | null>(null);

  useEffect(() => {
    const recent = getRecentlyViewed().find((entry) => entry.kind === "flight");
    setItem(recent ?? null);
  }, []);

  if (!item) return null;

  const payload = item.payload as {
    origin?: string;
    destination?: string;
    departureDate?: string | null;
  };
  if (!payload.origin || !payload.destination) return null;

  const handleSearchAgain = () => {
    searchFlightRoute(navigate, {
      originCode: payload.origin!,
      originCity: payload.origin!,
      destinationCode: payload.destination!,
      destinationCity: payload.destination!,
      preferredDate: payload.departureDate,
    });
  };

  return (
    <div className="w-[90%] m-auto mt-[60px]">
      <p className="text-[24px] font-semibold font-inter text-[#181818] mb-1">Personalized for you</p>
      <p className="font-normal text-[#4E4F52] font-inter mb-8">Because you searched this route before</p>
      <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr] rounded-[20px] overflow-hidden shadow-[0_10px_24px_-12px_rgba(15,23,42,0.35)] bg-white">
        <div
          className="relative min-h-[180px] md:min-h-[280px] flex items-center justify-center overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0b3d78, #1f6fb2 60%, #4a95d6)" }}
        >
          <FaPlane className="text-white/15 rotate-[35deg]" size={120} />
        </div>
        <div className="p-8 md:p-10 flex flex-col justify-center">
          <p className="text-[11.5px] font-bold font-inter tracking-wide uppercase text-[#FF6F1E] mb-2.5">
            Because you searched this route
          </p>
          <p className="text-[22px] font-bold font-inter text-[#181818] mb-2">
            {item.title || `${payload.origin} → ${payload.destination}`}
          </p>
          <p className="text-[14px] font-inter text-[#4E4F52] leading-relaxed mb-5">
            Fares change, so we'll run a fresh search rather than resuming a possibly stale price.
          </p>
          <div className="flex items-center gap-3 bg-[#F9F9F8] rounded-[14px] px-4 py-3 mb-5">
            <div className="w-[38px] h-[38px] rounded-[10px] bg-[#EAF0FA] flex items-center justify-center flex-shrink-0">
              <FaPlane className="text-[#023E8A]" size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-[13.5px] font-semibold font-inter text-[#181818] truncate">
                {payload.origin} → {payload.destination}
              </p>
              {item.priceLabel && (
                <p className="text-[12px] font-inter text-[#8A9096]">From {item.priceLabel}</p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={handleSearchAgain}
            className="self-start bg-[#023E8A] text-white font-inter font-bold text-[13.5px] rounded-[12px] px-6 py-3 cursor-pointer hover:bg-blue-800 transition-colors"
          >
            Search this route again
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlightsPersonalized;
