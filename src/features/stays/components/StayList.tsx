import React, { useEffect, useState } from "react";
import StayCard from "./StayCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Hotel } from "../stays"; // Updated import path
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

interface StayListProps {
  hotels: Hotel[];
}

const StayList: React.FC<StayListProps> = ({ hotels }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const staysPerPage = 9;
  const totalPages = Math.ceil(hotels.length / staysPerPage);
  const { searchParams } = useSelector((state: RootState) => state.stays);

  // Get stays for current page
  const indexOfLastStay = currentPage * staysPerPage;
  const indexOfFirstStay = indexOfLastStay - staysPerPage;
  const currentStays = hotels.slice(indexOfFirstStay, indexOfLastStay);

  useEffect(() => {
    setCurrentPage(1);
  }, [hotels]);

  // Render pagination buttons
  const renderPagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = 8;
    const middlePagesCount = maxVisiblePages - 4;

    if (totalPages <= maxVisiblePages) {
      pageNumbers.push(...Array.from({ length: totalPages }, (_, i) => i + 1));
    } else {
      pageNumbers.push(1, 2);

      let startPage = Math.max(3, currentPage - Math.floor(middlePagesCount / 2));
      let endPage = Math.min(totalPages - 1, currentPage + Math.floor(middlePagesCount / 2));

      if (startPage > 3) pageNumbers.push("...");
      
      for (let i = 0; i < Math.min(middlePagesCount, totalPages - 4); i++) {
        if (startPage + i < endPage) pageNumbers.push(startPage + i);
      }

      if (endPage < totalPages - 1) pageNumbers.push("...");
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
  };

  return (
    <div className="container mx-auto px-4 py-8">

      {/* Stays Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentStays.map((hotel) => (
          <StayCard
            key={hotel.code}  // Using hotel.code as unique identifier
            hotel={hotel}
            checkIn={searchParams?.checkIn}
            checkOut={searchParams?.checkOut}
          />
        ))}
      </div>

      {/* Pagination - Only show if there are multiple pages */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-10 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="p-2 border border-gray-500 shadow-md shadow-gray-400 rounded text-black disabled:opacity-50"
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <FaChevronLeft />
          </button>

          {renderPagination()}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="p-2 border border-gray-500 shadow-md shadow-gray-400 rounded text-black disabled:opacity-50"
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default StayList;