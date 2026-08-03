import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { Hotel } from "../../../features/stays/types";

interface TrendingStaysProps {
  stays: Hotel[];
}

// Deliberately not another CarouselRow -- a photo-grid carousel can't say
// "this is trending" on its own, a ranked leaderboard can. Rank + a
// "booked N times this week" line are the whole point of this section, so
// it gets its own layout instead of reusing TopRatedStayCard.
//
// "Booked N times" and the trend percentage are mock/illustrative content:
// there is no booking-count-by-listing aggregation in the backend today
// (the underlying sort is real -- reviewsCount descending -- but the
// specific copy shown here is not). Shipped as placeholder content on
// purpose, per plan.md Phase 5 -- revisit once a real aggregate exists.
const mockBookedCount = (index: number) => Math.max(34 - index * 6, 6);
const mockTrendPercent = (index: number) => Math.max(18 - index * 3, 2);

const TrendingStays = ({ stays }: TrendingStaysProps) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const navigate = useNavigate();
  const ranked = stays.slice(0, 5);

  if (ranked.length === 0) return null;

  return (
    <div className={`w-[90%] m-auto ${isMobile ? "mt-[24px]" : "mt-[60px]"}`}>
      <div className="bg-[#FDEAE6] rounded-[28px] px-4 py-5 md:px-8 md:py-8">
        <p className={`font-semibold font-inter text-[#181818] ${isMobile ? "text-[16px]" : "text-[24px]"}`}>
          Trending Now
        </p>
        <p className={`font-normal text-[#4E4F52] font-inter ${isMobile ? "text-[14px]" : ""}`}>
          Popular with travellers this week
        </p>

        <div className="mt-[18px] flex flex-col divide-y divide-[#D64530]/15 max-w-[560px]">
          {ranked.map((hotel, index) => {
            const coverImg = hotel.images?.find((img) => img.type === "GEN") ?? hotel.images?.[0];
            const mainImage = coverImg?.secureUrl ?? coverImg?.url;
            const hotelId = hotel.id ?? hotel.code ?? "";

            return (
              <button
                key={hotelId}
                type="button"
                onClick={() =>
                  navigate(`/stay-details/${hotelId}?stay=${encodeURIComponent(hotel.name)}`)
                }
                className="flex items-center gap-3 py-[10px] text-left cursor-pointer group"
              >
                <span className="w-[24px] flex-shrink-0 text-[16px] font-extrabold font-inter text-[#D64530] tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="w-[48px] h-[48px] flex-shrink-0 rounded-[12px] overflow-hidden bg-gray-100">
                  {mainImage ? (
                    <img
                      src={mainImage}
                      alt={hotel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : null}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-semibold font-inter text-[#181818] line-clamp-1">
                    {hotel.name}
                  </p>
                  <p className="text-[11.5px] font-inter text-[#4E4F52]">
                    Booked {mockBookedCount(index)} times this week
                  </p>
                </div>
                <span className="flex-shrink-0 flex items-center gap-1 text-[11px] font-bold font-inter text-[#D64530]">
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="w-[12px] h-[12px]">
                    <path d="M4 13l5-5 3 3 5-6M17 5h-4v4" />
                  </svg>
                  +{mockTrendPercent(index)}%
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TrendingStays;
