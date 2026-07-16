import { useEffect, useMemo, useRef, useState } from "react";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import { useMediaQuery } from "react-responsive";
import { fetchTopRatedStays } from "../../../features/stays/api";
import { Hotel } from "../../../features/stays/types";
import TopRatedStayCard from "../TopRatedStayCard";
import StaysCategoryBrowse from "./StaysCategoryBrowse";

interface CarouselRowProps {
  title: string;
  subtitle: string;
  stays: Hotel[];
  badge?: string;
}

const CarouselRow = ({ title, subtitle, stays, badge }: CarouselRowProps) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollAmount = 300;

  if (stays.length === 0) return null;

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  };
  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const cards = (
    <div
      ref={scrollContainerRef}
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      className="flex gap-6 overflow-x-auto scroll-smooth flex-nowrap"
    >
      {stays.map((hotel, index) => (
        <TopRatedStayCard
          key={hotel.id ?? hotel.code}
          hotel={hotel}
          badge={index === 0 ? badge : undefined}
        />
      ))}
    </div>
  );

  return (
    <div className="w-[90%] m-auto">
      {isMobile ? (
        <div className="mt-[6px]">
          <p className="text-[16px] font-semibold font-inter text-[#181818]">{title}</p>
          <p className="font-normal text-[#4E4F52] font-inter text-[14px]">{subtitle}</p>
          <div className="mt-[10px] w-full overflow-x-auto relative">{cards}</div>
        </div>
      ) : (
        <div className="mt-[60px]">
          <div className="flex justify-between">
            <div>
              <p className="text-[24px] font-semibold font-inter text-[#181818]">{title}</p>
              <p className="font-normal text-[#4E4F52] font-inter">{subtitle}</p>
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

// Replaces the old single "Top Rated Stays" carousel with three rows --
// same real fetch, three different sorts, no new backend fields (see
// plan.md Phase 3). Also renders the category-browse module first, since
// both need the same underlying dataset and fetching it once here avoids
// a duplicate network call.
const SegmentedStayCarousels = () => {
  const [stays, setStays] = useState<Hotel[]>([]);

  useEffect(() => {
    fetchTopRatedStays().then(setStays);
  }, []);

  const budgetFriendly = useMemo(
    () =>
      [...stays]
        .filter((hotel) => hotel.priceFrom != null)
        .sort((a, b) => (a.priceFrom ?? 0) - (b.priceFrom ?? 0)),
    [stays],
  );

  const trending = useMemo(
    () =>
      [...stays]
        .filter((hotel) => hotel.reviewsCount != null)
        .sort((a, b) => (b.reviewsCount ?? 0) - (a.reviewsCount ?? 0)),
    [stays],
  );

  if (stays.length === 0) return null;

  return (
    <>
      <StaysCategoryBrowse stays={stays} />
      <CarouselRow title="Top Rated Stays" subtitle="Loved by recent guests" stays={stays} />
      <CarouselRow
        title="Budget-Friendly Stays"
        subtitle="Great value, without the compromise"
        stays={budgetFriendly}
        badge="Best Value"
      />
      <CarouselRow
        title="Trending Now"
        subtitle="Popular with travellers this week"
        stays={trending}
        badge="Trending"
      />
    </>
  );
};

export default SegmentedStayCarousels;
