import { useState } from "react";
import { FaSortAmountDown } from "react-icons/fa";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import Navbar from "../components/2Navbar";
import Breadcrumbs from "../components/Breadcrumbs";
import StayList from "../components/StayList";
import TravelmateApp from "./homePage/TravelmateApp";
import Footer from "../components/2Footer";
import SortModal from "../components/modals/SortModal";
import FilterModal from "../components/modals/FilterModal";
import UpdateSearchFilter from "../components/UpdateSearchFilter";

export default function StaysSearchResults() {
  // State for modals
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Recommended");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Breadcrumb Navigation
  const breadcrumbs = [
    { name: "Home", link: "/" },
    { name: "Ikeja", link: "/locations/ikeja" },
    { name: "Search Results" },
  ];

  return (
    <div className="h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />
      <UpdateSearchFilter />

      <Breadcrumbs items={breadcrumbs} />

      {/* Results and Sorting Section */}
      <div className="min-h-screen px-6">
        <div className="flex justify-between items-center border-b border-t border-gray-300 p-4">
          <span className="text-black font-bold text-lg">80 Results</span>

          <div className="flex gap-4">
            <button
              className="w-[96px] h-[44px] flex items-center justify-center gap-2 border border-gray-300 rounded-lg shadow-sm"
              onClick={() => setIsFilterModalOpen(true)}
            >
              <HiAdjustmentsHorizontal />
              <span>Filter</span>
            </button>

            {/* Filter Modal */}
            <FilterModal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} />

            {/* Sort By Button */}
            <button
              className="w-[275px] h-[44px] flex items-center justify-between px-4 border border-gray-300 rounded-lg shadow-sm"
              onClick={() => setIsSortModalOpen(true)}
            >
              <div className="flex items-center gap-2">
                <FaSortAmountDown />
                <span>Sort By: {selectedSort}</span>
              </div>
              <span>▼</span>
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
