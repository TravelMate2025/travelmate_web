import { useEffect, useRef, useState } from "react";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import { useMediaQuery } from "react-responsive";
import { fetchRecommendedHotels } from "../../features/stays/api";
import { Hotel } from "../../features/stays/types";
import TopRatedStayCard from "./TopRatedStayCard";

// The fetch call here already existed (in the now-dead SearchFilter.tsx --
// found unreferenced anywhere during Phase 1) but its result was fetched
// and discarded, never rendered. This is the first time it's actually
// shown on web.
const RecommendedStays = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollAmount = 300;

  const [stays, setStays] = useState<Hotel[]>([]);

  useEffect(() => {
    fetchRecommendedHotels().then(setStays);
  }, []);

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  };
  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  if (stays.length === 0) return null;

  const cards = (
    <div
      ref={scrollContainerRef}
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      className="flex gap-6 overflow-x-auto scroll-smooth flex-nowrap"
    >
      {stays.map((hotel) => (
        <TopRatedStayCard
          key={hotel.id ?? hotel.code}
          hotel={hotel}
          badge="For You"
          badgeTone="orange"
        />
      ))}
    </div>
  );

  return (
    <div className="w-[90%] m-auto">
      {isMobile ? (
        <div className="mt-[6px]">
          <p className="text-[16px] font-semibold font-inter text-[#181818]">Recommended For You</p>
          <p className="font-normal text-[#4E4F52] font-inter text-[14px]">Hand-picked stays near you</p>
          <div className="mt-[10px] w-full overflow-x-auto relative">{cards}</div>
        </div>
      ) : (
        <div className="mt-[60px]">
          <div className="flex justify-between">
            <div>
              <p className="text-[24px] font-semibold font-inter text-[#181818]">Recommended For You</p>
              <p className="font-normal text-[#4E4F52] font-inter">Hand-picked stays near you</p>
            </div>
            <div className="flex gap-[34px]">
              <div
                onClick={scrollLeft}
                className="w-[44px] h-[44px] cursor-pointer bg-white border border-[#EBECED] rounded-[4px] shadow-md shadow-[#00000014] flex items-center justify-center"
              >
                <KeyboardArrowLeftOutlinedIcon className="scale-150" />
              </div>
              <div
                onClick={scrollRight}
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

export default RecommendedStays;
