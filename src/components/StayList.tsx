import React, { useState } from "react";
import StayCard from "./StayCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import StayImage from "../assets/images/StayImage.png";


// Sample Data
const stays = Array.from({ length: 100 }, (_, i) => ({
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
      <div className="flex justify-center items-center mt-26 space-x-2">
        {/* Left Arrow */}
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="p-2 border border-gray-500 shadow-md shadow-gray-400 rounded text-black disabled:opacity-50"
          disabled={currentPage === 1}
        >
          <FaChevronLeft />
        </button>

        {/* Page Numbers */}
        {(() => {
          const pageNumbers = [];
          const maxVisiblePages = 8;
          const middlePagesCount = maxVisiblePages - 4;

          if (totalPages <= maxVisiblePages) {
            pageNumbers.push(...Array.from({ length: totalPages }, (_, i) => i + 1));
          } else {
            pageNumbers.push(1, 2);

            let startPage = Math.max(3, currentPage - Math.floor(middlePagesCount / 2));
            let endPage = Math.min(totalPages - 1, currentPage + Math.floor(middlePagesCount / 2));

            if (startPage > 3) {
              pageNumbers.push("...");
            }

            const visiblePages = Math.min(middlePagesCount, totalPages - 4);
            for (let i = 0; i < visiblePages; i++) {
              if (startPage + i < endPage) {
                pageNumbers.push(startPage + i);
              }
            }

            if (endPage < totalPages - 1) {
              pageNumbers.push("...");
            }

            pageNumbers.push(totalPages);
          }

          return pageNumbers.map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === "number" && setCurrentPage(page)}
              className={`px-3 py-1 shadow-md shadow-gray-400 rounded ${
                currentPage === page ? "bg-blue-500 text-white" : "text-black"
              } ${page === "..." ? "cursor-default opacity-50" : ""}`}
              disabled={page === "..."}
            >
              {page}
            </button>
          ));
        })()}

        {/* Right Arrow */}
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          className="p-2 border border-gray-500 shadow-md shadow-gray-400 rounded text-black disabled:opacity-50"
          disabled={currentPage === totalPages}
        >
          <FaChevronRight />
        </button>
      </div>


    </div>
  );
};

export default StayList;
