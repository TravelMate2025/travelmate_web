import { useEffect, useState } from "react";
import { FaSortAmountDown, FaPencilAlt } from "react-icons/fa";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import Breadcrumbs from "../components/Breadcrumbs";
import StayList from "../components/StayList";
import TravelmateApp from "./homePage/TravelmateApp";
import Footer from "../components/2Footer";
import SortModal from "../components/modals/SortModal";
import FilterModal from "../components/modals/FilterModal";
import UpdateSearchFilter from "../components/UpdateSearchFilter";
import Navbar from "./homePage/Navbar";

export default function StaysSearchResults() {
  // State for modals and visibility
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Recommended");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [showUpdateSearch, setShowUpdateSearch] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Breadcrumb Navigation
  const breadcrumbs = [
    { name: "Home", link: "/" },
    { name: "Ikeja", link: "/locations/ikeja" },
    { name: "Search Results" },
  ];

  // Example filter details (replace with actual data)
  const filterDetails = {
    state: "Lagos",
    city: "Ikeja",
    dates: "Feb 10 - Feb 15 (7 nights)",
    roomsGuests: "1 Room, 1 Guest",
  };

  const handleEditClick = () => {
    setShowUpdateSearch(!showUpdateSearch); // Toggle
  };

  return (
    <div className="h-screen flex flex-col mt-20">
      {/* Navbar */}
      <Navbar />

      {/* Conditional UpdateSearchFilter */}
      {(!isMobile || showUpdateSearch) && <UpdateSearchFilter />}

      {/* Conditional Breadcrumbs */}
      {!isMobile && <Breadcrumbs items={breadcrumbs} />}

      {/* Results and Sorting Section */}
      <div className="min-h-screen px-6">
        {/* Filter Details Box (Mobile) */}
        {isMobile && !showUpdateSearch && (
         <button
          onClick={handleEditClick}
          className="border bg-blue-100 rounded-lg p-4 my-4 flex justify-between items-center"
          >
          <div className="text-left">
            <p className="truncate overflow-hidden whitespace-nowrap">
              {`${filterDetails.state}, ${filterDetails.city}`}
            </p>
            <p className="truncate overflow-hidden whitespace-nowrap">
              {`${filterDetails.dates} * ${filterDetails.roomsGuests}`}
            </p>
          </div>
          <span className="m-3"><FaPencilAlt /></span>

        </button>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <span className="text-black font-bold text-lg ml-0 sm:ml-4 mb-4 sm:mb-0">
            80 Results
          </span>

          <div className="flex gap-4">
            <button
              className="w-25 sm:w-[96px] sm:h-[44px] flex items-center justify-center gap-2 border border-gray-300 rounded-lg shadow-sm"
              onClick={() => setIsFilterModalOpen(true)}
            >
              <HiAdjustmentsHorizontal />
              <span>Filter</span>
            </button>

            {/* Filter Modal */}
            <FilterModal
              isOpen={isFilterModalOpen}
              onClose={() => setIsFilterModalOpen(false)}
            />

            {/* Sort By Button */}
            <button
              className="w-25 sm:w-[275px] h-[44px] flex items-center justify-between px-4 border border-gray-300 rounded-lg shadow-sm"
              onClick={() => setIsSortModalOpen(true)}
            >
              <div className="flex items-center gap-2">
                <FaSortAmountDown />
                <span>
                  {isMobile
                    ? "Sort"
                    : selectedSort
                    ? `Sort By: ${selectedSort}`
                    : "Sort"}
                </span>
              </div>
              {!isMobile && <span>▼</span>}
            </button>
          </div>
        </div>

        {/* Stay List */}
        <StayList />

        <div className="py-10 bg-gray-100">
          <TravelmateApp />
        </div>
        <Footer />
      </div>

      {/* Sort Modal */}
      {isSortModalOpen && (
        <SortModal
          selectedSort={selectedSort}
          onClose={() => setIsSortModalOpen(false)}
          onSelect={(option) => setSelectedSort(option)}
        />
      )}
    </div>
  );
}