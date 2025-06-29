import React, { useEffect, useState } from "react";
import StayCard from "./StayCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Hotel } from "../pages/StaysSearchResults"; // Import the Hotel type

interface StayListProps {
  hotels: Hotel[]; // Now accepts a prop for the list of hotels
}



const StayList: React.FC<StayListProps> = ({ hotels }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const staysPerPage = 9;
  const totalPages = Math.ceil(hotels.length / staysPerPage);

  // Get stays for current page from the fetched data
  const indexOfLastStay = currentPage * staysPerPage;
  const indexOfFirstStay = indexOfLastStay - staysPerPage;
  const currentStays = hotels.slice(indexOfFirstStay, indexOfLastStay);

  useEffect(() => {
    setCurrentPage(1);
  }, [hotels]);

  useEffect(() => {
    console.log("Current stays on page:", currentStays);
  }, [currentStays]);



  return (
    <div className="container mx-auto px-4 py-8">
      {/* Stays Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentStays.map((stay) => {
          const firstRoom = stay.rooms?.[0];
          const firstRate = firstRoom?.rates?.[0];
          const firstImage = stay.image?.trim() || "";
          const rating = Number(stay.category?.split(" ")[0]) || 1;


          
          return (
            <StayCard
              key={stay.id}
              id={stay.id.toString()}
              image={firstImage} 
              name={stay.name}
              rating={rating}
              reviews={100} // You can update this if reviews become available
              location={stay.destination || stay.zone || "Not Specified"}
              pricePerNight={firstRate?.price ? String(firstRate.price) : "N/A"}
              totalPrice={firstRate?.price ? String(firstRate.price) : "N/A"}
              refundableUntil={
                (() => {
                  const from = firstRate?.cancellationPolicies?.[0]?.from;
                  if (!from) return "Refund policy unavailable";

                  const fromDate = new Date(from);
                  const now = new Date();
                  const timeDiff = fromDate.getTime() - now.getTime();

                  if (timeDiff <= 0) {
                    return "Cancellation no longer allowed";
                  }

                  const hoursLeft = Math.ceil(timeDiff / (1000 * 60 * 60));
                  return `for ${hoursLeft} more hour${hoursLeft === 1 ? "" : "s"}`;
                })()
              }


            />
          );
        })}

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