import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReusableDateSelector from "./ReusableDateSelector";
import HotelGuestSelector from "./HotelGuestSelector";
import LocationDropdown from "./booking-progress/LocationDropdown";
import { setSearchParams, setLocationDetails, clearStaysCache } from "../slice";
import { AppDispatch, RootState } from "../../../store";
import { fetchDestinations } from "../api";
import { useNavigate } from "react-router";

interface Destination {
  code: string;
  name: string;
  country_code: string;
  country_name?: string;
  city_name?: string;
  accommodation_type?: string;
}

export default function UpdateSearchFilter() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { searchParams, locationDetails } = useSelector(
    (state: RootState) => state.stays
  );
  const { accessToken } = useSelector((state: RootState) => state.auth);

  const [locations, setLocations] = useState<Destination[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);

  const [destinationCode, setDestinationCode] = useState(
    locationDetails?.code || ""
  );
  const [destination, setDestination] = useState(locationDetails?.name || "");
  const [checkIn, setCheckIn] = useState(searchParams?.checkIn || "");
  const [checkOut, setCheckOut] = useState(searchParams?.checkOut || "");
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const [counts, setCounts] = useState({
    rooms: searchParams?.rooms || 1,
    adults: searchParams?.adults || 2,
    children: searchParams?.children || 0,
    infants: 0,
  });

  const [guestText, setGuestText] = useState(
    ` ${searchParams?.rooms} rooms, ${
      counts.adults + counts.children + counts.infants
    } guests, ` || ""
  );

  useEffect(() => {
    const loadDestinations = async () => {
      try {
        setLoadingLocations(true);
        if (destination.length >= 2) {
          const data = await fetchDestinations(destination, accessToken);
          setLocations(data);
        } else if (!destination) {
          const data = await fetchDestinations(undefined, accessToken);
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
  }, [destination, accessToken]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const updateGuestText = () => {
    const totalGuests = counts.adults + counts.children + counts.infants;
    setGuestText(
      `${counts.rooms} Room${
        counts.rooms > 1 ? "s" : ""
      }, ${totalGuests} Guest${totalGuests !== 1 ? "s" : ""}`
    );
    handleClose();
  };

  const handleLocationSelect = (value: string, code: string) => {
    setDestination(value);
    setDestinationCode(code);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (
        !destinationCode ||
        !checkIn ||
        !checkOut ||
        counts.adults < 1 ||
        counts.rooms < 1
      ) {
        return;
      }

      setUpdateLoading(true);
      dispatch(clearStaysCache());
      const selectedDestination = locations.find(
        (loc) => loc.code === destinationCode
      );

      const totalChildren = counts.children + counts.infants;
      const updatedSearchParams = {
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
            accommodation_type: selectedDestination.accommodation_type || "",
          })
        );
      } else {
        dispatch(
          setLocationDetails({ name: destination, code: destinationCode })
        );
      }

      await dispatch(setSearchParams(updatedSearchParams));

      navigate(
        `/stays-search-result?location=${encodeURIComponent(
          destination
        )}&checkin=${formatDate(checkIn)}&checkout=${formatDate(
          checkOut
        )}&adults=${counts.adults}&children=${totalChildren}&rooms=${
          counts.rooms
        }`
      );
    } catch (error) {
      console.error("Error updating search parameters:", error);
    } finally {
      setUpdateLoading(false);
    }
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

  return (
    <div>
      {/* Search Filter Section */}
      <div className="bg-gray-100 py-6 px-4 sm:px-10 shadow-md">
        <div className="max-w-[1280px] mx-auto">
          <form
            onSubmit={handleSubmit}
            className="flex flex-wrap items-end gap-2 md:gap-4"
          >
            {/* Destination */}
            <div className="flex flex-col w-full md:w-auto">
              <LocationDropdown
                label="Destination"
                selectedValue={destination}
                setSelectedValue={handleLocationSelect}
                locations={locations.map((loc) => ({
                  name: loc.name,
                  code: loc.code,
                  accommodation_type: loc?.accommodation_type || "",
                }))}
                loading={loadingLocations}
                token={accessToken}
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
              className="w-full md:w-35 h-[42px] bg-[#023E8A] text-white rounded-lg hover:bg-[#0450A2] disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400 cursor-pointer"
              disabled={
                updateLoading ||
                !guestText ||
                !destination ||
                !checkIn ||
                !checkOut ||
                counts.adults < 1 ||
                counts.rooms < 1
              }
            >
              {updateLoading ? "Updating..." : "Update"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
