import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReusableDateSelector from "./ReusableDateSelector";
import LocationDropdown from './booking-progress/LocationDropdown';
import HotelGuestSelector from './HotelGuestSelector';
import { useDispatch, useSelector } from "react-redux";
import { clearStaysCache, setSearchParams } from "../slice";
import { AppDispatch, RootState } from "../../../store";
import { fetchDestinations } from '../api';

interface Destination {
  code: string;
  name: string;
  country_code: string;
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
  const [destinationCode, setDestinationCode] = useState("");
  const [destination, setDestination] = useState("");
  const [locations, setLocations] = useState<Destination[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [guestText, setGuestText] = useState("1 Room, 2 Guests");
  const [counts, setCounts] = useState({ rooms: 1, adults: 2, children: 0, infants: 0 });
  const { accessToken } = useSelector((state: RootState) => state.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const loadDestinations = async () => {
        try {
        setLoadingLocations(true);
        const data = await fetchDestinations(undefined, accessToken,);
        setLocations(data);
        } catch (error) {
        console.error('Error fetching destinations:', error);
        } finally {
        setLoadingLocations(false);
        }
    };

    loadDestinations();
  }, [accessToken]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(clearStaysCache());

    const totalChildren = counts.children + counts.infants;
    const searchParams: SearchParams = {
      destination: destinationCode,
      checkIn: formatDate(checkIn),
      checkOut: formatDate(checkOut),
      adults: counts.adults,
      children: totalChildren,
      rooms: counts.rooms,
    };
    
    dispatch(setSearchParams(searchParams));
    navigate('/stays-search-result');
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

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => setAnchor(e.currentTarget);
  const handleClose = () => setAnchor(null);

  const updateGuestText = () => {
    const totalGuests = counts.adults + counts.children + counts.infants;
    setGuestText(`${counts.rooms} Room${counts.rooms > 1 ? "s" : ""}, ${totalGuests} Guest${totalGuests !== 1 ? "s" : ""}`);
    handleClose();
  };

  return (
    <div className="py-4">
      <div className="max-w-full mx-auto">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          {/* Destination */}
          <div className="flex flex-col w-full md:w-auto">
              <LocationDropdown
                label="Destination"
                selectedValue={destination}
                  setSelectedValue={(value, code) => {
                    setDestination(value); // Keep name for display
                    setDestinationCode(code); // Store code for search
                }}
                locations={locations.map(loc => ({
                    name: loc.name,
                    code: loc.code
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
            <label className="text-sm font-medium text-gray-700 mb-1">Check-in - Check-out</label>
            <ReusableDateSelector onDateChange={handleDateChange} initialValue={""} />
          </div>

          {/* Submit Button */}
          <div className="flex-grow"></div>
          <button
            type="submit"
            className="w-full md:w-35 h-[42px] bg-[#023E8A] text-white rounded-lg cursor-pointer hover:bg-[#0450A2]"
            disabled={loadingLocations}
          >
            {loadingLocations ? 'Loading...' : 'Search'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchFilter;