import { useState } from "react";
import { FaMapMarkerAlt, FaUser, FaCalendarAlt } from "react-icons/fa";
import Navbar from "../components/2Navbar";

export default function StaysSearchResults() {
  // State for search filters
  const [destination, setDestination] = useState("");
  const [roomGuest, setRoomGuest] = useState("");
  const [date, setDate] = useState("");

  // Breadcrumb Navigation
  const breadcrumbs = [
    { name: "Home", link: "/" },
    { name: "Ikeja", link: "/locations/ikeja" },
    { name: "Search Results", link: "/search-results" },
  ];

  // Handle form submission
  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault(); // Prevent page reload
    console.log({ destination, roomGuest, date });
    // You can add a function to fetch results from an API
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Search Filter Section */}
      <div className="bg-gray-100 py-6 px-6 shadow-md">
        <div className="max-w-[1280px] mx-auto">
          <form 
            onSubmit={handleSubmit} 
            className="flex items-end gap-4"
          >
            {/* Destination */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Destination
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <FaMapMarkerAlt />
                </span>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Enter destination"
                  className="w-[312px] h-[44px] border px-10 rounded-lg text-gray-700"
                  required
                />
              </div>
            </div>

            {/* Room & Guest */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Room & Guest
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <FaUser />
                </span>
                <input
                  type="text"
                  value={roomGuest}
                  onChange={(e) => setRoomGuest(e.target.value)}
                  placeholder="Number of rooms & guests"
                  className="w-[312px] h-[44px] border px-10 rounded-lg text-gray-700"
                  required
                />
              </div>
            </div>

            {/* Date */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <FaCalendarAlt />
                </span>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-[312px] h-[44px] border px-10 rounded-lg text-gray-700"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-[180px] h-[42px] ml-25 bg-[#023E8A] text-white rounded-lg hover:bg-[#0450A2]"
            >
              Update
            </button>
          </form>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="mt-4 text-sm text-gray-600 max-w-[1280px] ml-10 text-left">
        {breadcrumbs.map((crumb, index) => (
          <span key={index}>
            {index > 0 && " > "}
            <a href={crumb.link} className="text-[#023E8A] hover:underline">
              {crumb.name}
            </a>
          </span>
        ))}
      </div>
    </div>
  );
}
