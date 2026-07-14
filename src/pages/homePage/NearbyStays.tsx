import { useEffect, useRef, useState } from "react";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import { useMediaQuery } from "react-responsive";
import { reverseGeocode, searchStays } from "../../features/stays/api";
import { Hotel } from "../../features/stays/types";
import TopRatedStayCard from "./TopRatedStayCard";

const formatIsoDate = (date: Date) => date.toISOString().split("T")[0];

// Resolved automatically on page load, not gated behind a "near me"
// button -- requests the browser's geolocation permission proactively;
// silently does nothing if denied/unavailable (optional discovery
// feature, not worth an error state). "Near you" here honestly means
// "in your detected city": the partner catalog search only accepts
// city/country strings, no lat/lng/radius param exists.
const NearbyStays = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollAmount = 300;

  const [stays, setStays] = useState<Hotel[]>([]);
  const [city, setCity] = useState<string | null>(null);

  useEffect(() => {
    if (!("geolocation" in navigator)) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { city: resolvedCity, country } = await reverseGeocode(
          position.coords.latitude,
          position.coords.longitude,
        );
        if (!resolvedCity) return;

        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);

        try {
          const response = await searchStays({
            city: resolvedCity,
            country: country ?? undefined,
            checkIn: formatIsoDate(today),
            checkOut: formatIsoDate(tomorrow),
            adults: 2,
            children: 0,
            rooms: 1,
          });
          setCity(resolvedCity);
          setStays(response.results ?? []);
        } catch {
          // searchStays toasts+throws on request failure -- this is a
          // background discovery section, not a user-initiated search,
          // so a failed/uncovered city should just not render, silently.
        }
      },
      () => {
        // Permission denied or lookup failed -- section just doesn't render.
      },
      { timeout: 8000 },
    );
  }, []);

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  };
  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  if (stays.length === 0 || !city) return null;

  const cards = (
    <div
      ref={scrollContainerRef}
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      className="flex gap-6 overflow-x-auto scroll-smooth flex-nowrap"
    >
      {stays.map((hotel) => (
        <TopRatedStayCard key={hotel.id ?? hotel.code} hotel={hotel} />
      ))}
    </div>
  );

  return (
    <div className="w-[90%] m-auto">
      {isMobile ? (
        <div className="mt-[6px]">
          <p className="text-[16px] font-semibold font-inter text-[#181818]">Stays in {city}</p>
          <p className="font-normal text-[#4E4F52] font-inter text-[14px]">Based on your current location</p>
          <div className="mt-[10px] w-full overflow-x-auto relative">{cards}</div>
        </div>
      ) : (
        <div className="mt-[60px]">
          <div className="flex justify-between">
            <div>
              <p className="text-[24px] font-semibold font-inter text-[#181818]">Stays in {city}</p>
              <p className="font-normal text-[#4E4F52] font-inter">Based on your current location</p>
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

export default NearbyStays;
