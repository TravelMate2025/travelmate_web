import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReusableDateSelector from "../components/ReusableDateSelector";
import LocationDropdown from './booking-progress/LocationDropdown';
import HotelGuestSelector from './HotelGuestSelector';

interface SearchFilterProps {
  onSubmit: (destination: string, roomGuest: string, date: string) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ onSubmit }) => {
  const [roomGuest] = useState('');
  const [destination, setDestination] = useState("");
  const [locations, setLocations] = useState(["Lagos", "Abuja", "Kano"]);

  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [guestText, setGuestText] = useState("1 Room, 2 Guests");
  const [counts, setCounts] = useState({ rooms: 1, adults: 2, children: 0, infants: 0 });

  const [date, setDate] = useState('');
  const navigate = useNavigate();



  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(destination, roomGuest, date);
    navigate('/stays-search-result');
  };

  const handleDateChange = (selectedDate: string) => {
    setDate(selectedDate);
  };

  const handleRemoveLocation = (loc: string) => {
    setLocations((prev) => prev.filter((item) => item !== loc));
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
              setSelectedValue={setDestination}
              locations={locations}
              onRemoveLocation={handleRemoveLocation}
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
            <label className="text-sm font-medium text-gray-700 mb-1">Date</label>
            <ReusableDateSelector onDateChange={handleDateChange} initialValue={date} />
          </div>

          {/* Submit Button */}
          <div className="flex-grow"></div>
          <button
            type="submit"
            className="w-full md:w-35 h-[42px] bg-[#023E8A] text-white rounded-lg cursor-pointer hover:bg-[#0450A2]"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchFilter;
