import React, { useState } from "react";
import StayCard from "./StayCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import StayImage from "../assets/images/StayImage.png";


// Sample Data
const stays = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  image: StayImage,
  name: "Maison Fahrenheit Hotel",
  rating: 4.5,
  reviews: 180,
  location: "80 Adetokunbo Ademola Street, Victoria Island, Lagos",
  pricePerNight: "5,000",
  totalPrice: "60,000",
  refundableUntil: "Feb 9",
}));

const StayList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const staysPerPage = 9;
  const totalPages = Math.ceil(stays.length / staysPerPage);

  // Get stays for current page
  const indexOfLastStay = currentPage * staysPerPage;
  const indexOfFirstStay = indexOfLastStay - staysPerPage;
  const currentStays = stays.slice(indexOfFirstStay, indexOfLastStay);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Stays Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentStays.map((stay) => (
          <StayCard key={stay.id} {...stay} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-8 space-x-2">
        {/* Left Arrow */}
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="p-2 border rounded text-gray-600 disabled:opacity-50"
          disabled={currentPage === 1}
        >
          <FaChevronLeft />
        </button>

        {/* Page Numbers */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 border rounded ${
              currentPage === page ? "bg-blue-500 text-white" : "text-gray-700"
            }`}
          >
            {page}
          </button>
        ))}

        {/* Right Arrow */}
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          className="p-2 border rounded text-gray-600 disabled:opacity-50"
          disabled={currentPage === totalPages}
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default StayList;
