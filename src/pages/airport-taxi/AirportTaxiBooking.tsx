import { useState } from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';

export default function AirportTaxiBooking() {
  const [pickUp, setPickUp] = useState('');
  const [dropOff, setDropOff] = useState('');
  const [pickUpDate, setPickUpDate] = useState('');
  const [pickUpTime, setPickUpTime] = useState('');
  const [passengers, setPassengers] = useState('');
  const [priceRange, setPriceRange] = useState('');

  const handleSearch = () => {
    console.log({
      pickUp,
      dropOff,
      pickUpDate,
      pickUpTime,
      passengers,
      priceRange
    });
  };

  return (
    <div className="w-[90%] mx-auto mt-[130px] md:mt-[150px]  bg-white rounded-lg border border-[#CDCED1] shadow">
      <div className="mb-6 p-4 flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-900 ">Easy and Affordable Airport Taxis</h1>
        <p className="text-gray-600">Find the perfect ride from the airport to your destination.</p>
      </div>
      <div className='border-t border-gray-200 h-2 w-full'></div>
      <div className='flex flex-col md:flex-row justify-between md:items-center  pt-6 p-4'>
        <div className=" md:w-[89%]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pick Up</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Destination"
                  className="pl-10 w-full border border-[#CDCED1] rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                  value={pickUp}
                  onChange={(e) => setPickUp(e.target.value)}
                />
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-black" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Drop Off</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Destination"
                  className="pl-10 w-full border border-[#CDCED1] rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                  value={dropOff}
                  onChange={(e) => setDropOff(e.target.value)}
                />
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-black" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pick Up Date</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Select Date"
                  className="pl-10 w-full border border-[#CDCED1] rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                  value={pickUpDate}
                  onChange={(e) => setPickUpDate(e.target.value)}
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => (e.target.type = "text")}
                />
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-black" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pick Up Time</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="00:00"
                  className="pl-10 w-full border border-[#CDCED1] rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                  value={pickUpTime}
                  onChange={(e) => setPickUpTime(e.target.value)}
                  onFocus={(e) => (e.target.type = "time")}
                  onBlur={(e) => (e.target.type = "text")}
                />
                <Clock className="absolute left-3 top-3 h-4 w-4 text-black" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Passengers</label>
              <select
                className="w-full border border-[#CDCED1] rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                value={passengers}
                onChange={(e) => setPassengers(e.target.value)}
              >
                <option value="">Select Passengers</option>
                <option value="1">1 Passenger</option>
                <option value="2">2 Passengers</option>
                <option value="3">3 Passengers</option>
                <option value="4">4 Passengers</option>
                <option value="5">5+ Passengers</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
              <input
                type="text"
                placeholder="Enter Minimum - Maximum price"
                className="w-full border border-[#CDCED1] rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
              />
            </div>
          </div>


        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSearch}
            className="bg-[#023E8A] hover:bg-blue-900 text-white font-light py-2 px-6 rounded-md transition-colors duration-200 h-fit"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}