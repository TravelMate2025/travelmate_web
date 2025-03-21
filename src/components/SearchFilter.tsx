import React, { useState } from 'react';
import { FaMapMarkerAlt, FaUser } from 'react-icons/fa';
import ReusableDateSelector from "../components/ReusableDateSelector";

interface SearchFilterProps {
  onSubmit: (destination: string, roomGuest: string, date: string) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ onSubmit }) => {
  const [destination, setDestination] = useState('');
  const [roomGuest, setRoomGuest] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(destination, roomGuest, date);
  };

  const handleDateChange = (selectedDate: string) => {
    setDate(selectedDate);
  };

  return (
    <div className="py-4">
      <div className="max-w-full mx-auto">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">

          {/* Destination */}
          <div className="flex flex-col w-full md:w-auto">
            <label className="text-sm font-medium text-gray-700 mb-1">Destination</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <FaMapMarkerAlt />
              </span>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Enter destination"
                className="w-full md:w-72 h-[44px] border px-10 rounded-lg text-gray-700"
                required
              />
            </div>
          </div>

          {/* Room & Guest */}
          <div className="flex flex-col w-full md:w-auto">
            <label className="text-sm font-medium text-gray-700 mb-1">Room & Guest</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <FaUser />
              </span>
              <input
                type="text"
                value={roomGuest}
                onChange={(e) => setRoomGuest(e.target.value)}
                placeholder="Number of rooms & guests"
                className="w-full md:w-72 h-[44px] border px-10 rounded-lg text-gray-700"
                required
              />
            </div>
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
            className="w-full md:w-35 h-[42px] bg-[#023E8A] text-white rounded-lg hover:bg-[#0450A2]"
            >
            Search
            </button>
        </form>
      </div>
    </div>
  );
};

export default SearchFilter;
