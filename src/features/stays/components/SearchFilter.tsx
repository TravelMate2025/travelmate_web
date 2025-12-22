import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReusableDateSelector from "./ReusableDateSelector";
import LocationDropdown from "./booking-progress/LocationDropdown";
import HotelGuestSelector from "./HotelGuestSelector";
import { useDispatch, useSelector } from "react-redux";
import { clearStaysCache, setLocationDetails, setSearchParams } from "../slice";
import { AppDispatch, RootState } from "../../../store";
import { fetchDestinations, fetchRecommendedHotels } from "../api";

interface Destination {
  code: string;
  name: string;
  country_code: string;
  country_name?: string;
  city_name?: string;
}

interface SearchParams {
  destination: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;  
}

const SearchFilter: React.FC = () => {
  const { searchParams, locationDetails } = useSelector(
    (state: RootState) => state.stays
  );

  const [destinationCode, setDestinationCode] = useState(
    searchParams?.destination || ""
  );
  const [destination, setDestination] = useState(locationDetails?.name || "");
  const [checkIn, setCheckIn] = useState(searchParams?.checkIn || "");
  const [checkOut, setCheckOut] = useState(searchParams?.checkOut || "");
  const [locations, setLocations] = useState<Destination[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [guestText, setGuestText] = useState(
    `${searchParams?.adults || 2} adults, ${searchParams?.rooms || 1} rooms ` ||
      ""
  );
  const [counts, setCounts] = useState({
    rooms: searchParams?.rooms || 1,
    adults: searchParams?.adults || 2,
    children: searchParams?.children || 0,
    infants: 0,
  });
  const { accessToken } = useSelector((state: RootState) => state.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const loadDestinations = async () => {
      try {
        setLoadingLocations(true);
        if (destination.length >= 2) {
          const data = await fetchDestinations(destination);
          setLocations(data);
        } else if (!destination) {
          const data = await fetchDestinations(undefined);
          setLocations(data);
        } else {
          setLoadingLocations(false);
        }
      } catch (error) {
        console.error("Error fetching destinations:", error);
        setLocations([]);
      } finally {
        if (destination.length >= 2 || !destination) {
          setLoadingLocations(false);
        }
      }
    };

    const timeoutId = setTimeout(loadDestinations, 300);
    return () => clearTimeout(timeoutId);
  }, [accessToken, destination]);



  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const handleLocationSelect = (value: string, code: string) => {
    setDestination(value);
    setDestinationCode(code);
  };

  const handleDateChange = (startDate: string, endDate: string) => {
    setCheckIn(startDate);
    setCheckOut(endDate);
  };

  const handleIncrement = (key: keyof typeof counts) => {
    setCounts((prev) => ({ ...prev, [key]: prev[key] + 1 }));
  };

  const handleDecrement = (key: keyof typeof counts) => {
    setCounts((prev) => ({ ...prev, [key]: Math.max(prev[key] - 1, 0) }));
  };

  const handleOpen = (e: React.MouseEvent<HTMLElement>) =>
    setAnchor(e.currentTarget);

  const handleClose = () => setAnchor(null);

  const updateGuestText = () => {
    const totalGuests = counts.adults + counts.children + counts.infants;
    setGuestText(
      `${counts.rooms} Room${
        counts.rooms > 1 ? "s" : ""
      }, ${totalGuests} Guest${totalGuests !== 1 ? "s" : ""}`
    );
    handleClose();
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(clearStaysCache());
    if (
      !destinationCode ||
      !checkIn ||
      !checkOut ||
      counts.adults < 1 ||
      counts.rooms < 1
    ) {
      return;
    }
    const selectedDestination = locations.find(
      (loc) => loc.code === destinationCode
    );

    const totalChildren = counts.children + counts.infants;
    const searchParams: SearchParams = {
      destination: destinationCode,
      checkIn: formatDate(checkIn),
      checkOut: formatDate(checkOut),
      adults: counts.adults,
      children: totalChildren,
      rooms: counts.rooms,
    };
    if (selectedDestination) {
      dispatch(
        setLocationDetails({
          name: selectedDestination.name,
          code: selectedDestination.code,
          country_code: selectedDestination.country_code,
          country_name:
            selectedDestination.country_name || selectedDestination.name,
        })
      );
    } else {
      dispatch(
        setLocationDetails({
          name: destination,
          code: destinationCode,
        })
      );
    }

    dispatch(setSearchParams(searchParams));
    navigate(
      `/stays-search-result?location=${encodeURIComponent(
        destinationCode
      )}&checkin=${formatDate(checkIn)}&checkout=${formatDate(
        checkOut
      )}&adults=${counts.adults}&children=${totalChildren}&rooms=${
        counts.rooms
      }`
    );
  };
  useEffect(() => {
    fetchRecommendedHotels();
  }, []);

  return (
    <div className="py-4">
      <div className="max-w-full mx-auto">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4"
        >
          {/* Destination */}
          <div className="flex flex-col w-full md:w-auto">
            <LocationDropdown
              label="Destination"
              token={accessToken}
              selectedValue={destination}
              setSelectedValue={handleLocationSelect}
              locations={locations?.map((loc) => ({
                name: loc.name,
                code: loc.code,
              }))}
              loading={loadingLocations}
            />
          </div>

          <div className="flex flex-col w-full md:w-auto">
            <HotelGuestSelector
              guestText={guestText}
              handleOpen={handleOpen}
              guestAnchor={anchor}
              handleClose={handleClose}
              handleIncrement={handleIncrement}
              handleDecrement={handleDecrement}
              counts={counts}
              updateGuestText={updateGuestText}
            />
          </div>

          {/* Date */}
          <div className="flex flex-col w-full md:w-auto">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Check-in - Check-out
            </label>
            <ReusableDateSelector
              onDateChange={handleDateChange}
              initialValue={
                checkIn && checkOut ? `${checkIn} - ${checkOut}` : ""
              }
            />
          </div>

          {/* Submit Button */}
          <div className="flex-grow"></div>
          <button
            type="submit"
            className="w-full md:w-35 h-[42px] bg-[#023E8A] text-white rounded-lg cursor-pointer hover:bg-[#0450A2] disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
            disabled={
              loadingLocations ||
              !guestText ||
              !destination ||
              !checkIn ||
              !checkOut ||
              counts.adults < 1 ||
              counts.rooms < 1
            }
          >
            {loadingLocations ? "Loading..." : "Search"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchFilter;
