import { useEffect, useRef, useState } from "react";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import { useMediaQuery } from "react-responsive";
import { getRecentlyViewed, RecentlyViewedItem } from "../../features/shared/recentlyViewed";
import RecentlyViewedCard from "./RecentlyViewedCard";

// Real, cross-vertical (stay/flight/transfer) view history, device-local via
// localStorage -- placed before RecommendedStays since a user's own trail is
// more relevant than algorithmic suggestions (mirrors mobile's home.dart).
const RecentlyViewed = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollAmount = 300;

  const [items, setItems] = useState<RecentlyViewedItem[]>([]);

  useEffect(() => {
    setItems(getRecentlyViewed());
  }, []);

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  };
  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  if (items.length === 0) return null;

  const cards = (
    <div
      ref={scrollContainerRef}
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      className="flex gap-6 overflow-x-auto scroll-smooth flex-nowrap"
    >
      {items.map((item) => (
        <RecentlyViewedCard key={`${item.kind}:${item.id}`} item={item} />
      ))}
    </div>
  );

  return (
    <div className="w-[90%] m-auto">
      {isMobile ? (
        <div className="mt-[6px]">
          <p className="text-[13px] font-semibold font-inter uppercase tracking-wide text-[#8A9096]">Recently Viewed</p>
          <div className="mt-[8px] w-full overflow-x-auto relative">{cards}</div>
        </div>
      ) : (
        <div className="mt-[40px]">
          <div className="flex justify-between items-center">
            <p className="text-[14px] font-semibold font-inter uppercase tracking-wide text-[#8A9096]">Recently Viewed</p>
            <div className="flex gap-[14px]">
              <div
                onClick={scrollLeft}
                className="w-[32px] h-[32px] cursor-pointer bg-white border border-[#EBECED] rounded-[4px] flex items-center justify-center"
              >
                <KeyboardArrowLeftOutlinedIcon fontSize="small" />
              </div>
              <div
                onClick={scrollRight}
                className="w-[32px] h-[32px] bg-white border cursor-pointer border-[#EBECED] rounded-[4px] flex items-center justify-center"
              >
                <KeyboardArrowRightOutlinedIcon fontSize="small" />
              </div>
            </div>
          </div>
          <div className="mt-[16px] w-full overflow-x-auto relative">{cards}</div>
        </div>
      )}
    </div>
  );
};

export default RecentlyViewed;
