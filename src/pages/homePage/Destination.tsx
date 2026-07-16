import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import { useMediaQuery } from "react-responsive";
import { AppDispatch } from "../../store";
import { clearStaysCache, setLocationDetails, setSearchParams } from "../../features/stays/slice";
import { bookingFlowRoutes } from "../../features/shared/bookingFlowRoutes";
import { fetchPopularDestinations } from "../../features/stays/api";
import { PopularDestination } from "../../features/stays/types";

const formatIsoDate = (date: Date) => date.toISOString().split("T")[0];

const Destination = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollAmount = 300;

  const [destinations, setDestinations] = useState<PopularDestination[]>([]);

  useEffect(() => {
    fetchPopularDestinations().then(setDestinations);
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Goes straight to results with sensible default dates (today -> +7 days,
  // matching the search form's own default range) -- a destination shortcut
  // shouldn't make the user pick dates just to see what's available.
  const handleSelectDestination = (destination: PopularDestination) => {
    const today = new Date();
    const weekOut = new Date();
    weekOut.setDate(today.getDate() + 7);
    const checkIn = formatIsoDate(today);
    const checkOut = formatIsoDate(weekOut);

    dispatch(clearStaysCache());
    dispatch(
      setLocationDetails({
        name: destination.name,
        country_name: destination.country_name ?? "",
        country_code: destination.country_code ?? "",
        code: destination.city.toLowerCase().replace(/\s+/g, "-"),
        city: destination.city,
      }),
    );
    dispatch(
      setSearchParams({
        destination: destination.city,
        country: destination.country_name,
        city: destination.city,
        checkIn,
        checkOut,
        adults: 2,
        children: 0,
        rooms: 1,
      }),
    );
    navigate(`${bookingFlowRoutes.stayResults}?flow=partner`);
  };

  if (destinations.length === 0) return null;

  const cards = (
    <div
      ref={scrollContainerRef}
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      className="flex gap-6 overflow-x-auto scroll-smooth flex-nowrap"
    >
      {/* 5:4 -- deliberately taller than the stay cards above, so the
          destination carousel reads as a distinct, more editorial
          "postcard" rhythm; kept consistent with PopularStaysWidget's
          ratio on mobile. */}
      {destinations.map((destination) => (
        <button
          key={destination.city}
          type="button"
          onClick={() => handleSelectDestination(destination)}
          className="w-[290px] h-[232px] flex-shrink-0 text-left cursor-pointer group relative overflow-hidden rounded-[20px] bg-gray-100 shadow-[0_10px_24px_-12px_rgba(15,23,42,0.35)]"
        >
          {destination.image_url ? (
            <img
              src={destination.image_url}
              alt={destination.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : null}
          {/* Scrim so white destination text stays legible over any photo,
              matching mobile's PopularStaysWidget treatment. */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0) 45%, rgba(0,0,0,0.6) 100%)",
            }}
          />
          <div className="absolute left-3 right-3 bottom-3">
            <p className="text-[17px] font-bold font-inter text-white leading-tight line-clamp-1">
              {destination.name}
            </p>
            <p className="font-normal text-[13px] text-white/85 font-inter line-clamp-1">
              {destination.country_name}
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
          <div className="flex justify-between">
            <div>
              <p className="text-[16px] font-semibold font-inter text-[#181818]">
                Popular Destinations
              </p>
              <p className="font-normal text-[#4E4F52] font-inter text-[14px]">
                Explore stays in these cities
              </p>
            </div>
          </div>

          <div className="mt-[10px] w-full overflow-x-auto relative">{cards}</div>
        </div>
      ) : (
        // web view
        <div className="mt-[100px]">
          <div className="flex justify-between">
            <div>
              <p className="text-[24px] font-semibold font-inter text-[#181818]">
                Popular Destinations
              </p>
              <p className="font-normal text-[#4E4F52] font-inter">
                Explore stays in these cities
              </p>
            </div>

            {/* Scroll Buttons */}
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

          {/* Scrollable Container */}
          <div className="mt-[38px] w-full overflow-x-auto relative">{cards}</div>
        </div>
      )}
    </div>
  );
};

export default Destination;
