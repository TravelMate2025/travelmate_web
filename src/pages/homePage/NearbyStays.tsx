import { useEffect, useRef, useState } from "react";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import { useMediaQuery } from "react-responsive";
import { FaMapMarkerAlt } from "react-icons/fa";
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

  // Mock distance content -- there is no real lat/lng radius search yet
  // (search is city-string based, see the comment above), so this is
  // deliberately illustrative rather than computed. Deterministic per card
  // (not random) so it doesn't reshuffle on every render. See the "Near
  // You" decision in plan.md Phase 5 before wiring this to anything real.
  const mockDistance = (index: number) => `${(1.2 + index * 0.9).toFixed(1)} km away`;

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
          pin
          distanceLabel={mockDistance(index)}
        />
      ))}
    </div>
  );

  // A route strip -- three stops joined by a line -- sits above the row as
  // a small locational cue, distinguishing this section from a plain photo
  // carousel the way a map glance would.
  const routeStrip = (
    <div className="relative flex items-center h-[14px] mb-3 px-1">
      <div className="absolute left-1 right-1 top-1/2 -translate-y-1/2 h-px bg-[#B9DEE4]" />
      <span className="relative w-[9px] h-[9px] rounded-full bg-[#023E8A] ring-4 ring-[#EFF7F8]" />
      <span className="relative ml-[28%] w-[7px] h-[7px] rounded-full bg-[#1B6E83]/50 ring-4 ring-[#EFF7F8]" />
      <span className="relative ml-[28%] w-[7px] h-[7px] rounded-full bg-[#1B6E83]/50 ring-4 ring-[#EFF7F8]" />
    </div>
  );

  return (
    <div className="w-[90%] m-auto">
      <div className="bg-[#EFF7F8] rounded-[28px] px-4 py-5 md:px-8 md:py-8">
        {isMobile ? (
          <div>
            <p className="flex items-center gap-1.5 text-[16px] font-semibold font-inter text-[#181818]">
              <FaMapMarkerAlt size={13} className="text-[#1B6E83]" />
              Stays in {city}
            </p>
            <p className="font-normal text-[#4E4F52] font-inter text-[14px]">Based on your current location</p>
            <div className="mt-[14px]">{routeStrip}</div>
            <div className="w-full overflow-x-auto relative">{cards}</div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between">
              <div>
                <p className="flex items-center gap-2 text-[24px] font-semibold font-inter text-[#181818]">
                  <FaMapMarkerAlt size={18} className="text-[#1B6E83]" />
                  Stays in {city}
                </p>
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
            <div className="mt-[22px] max-w-[420px]">{routeStrip}</div>
            <div className="mt-[16px] w-full overflow-x-auto relative">{cards}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NearbyStays;
