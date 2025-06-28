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
import { searchHotels } from '../api/stays'; // Import the API function

// Define the type for a hotel object based on the API response structure
export interface Hotel {
  code: string;
  name: string;
  minRate: number;
  maxRate: number;
  // Add other properties from your API response here (e.g., images, location, reviews)
  // For now, we'll use a placeholder structure based on StayCard props.
  reviews?: number; // Placeholder
  location?: string; // Placeholder
  image?: string; // Placeholder
  rating?: number; // Placeholder
  refundableUntil?: string; // Placeholder
}

export default function StaysSearchResults() {
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Recommended");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [showUpdateSearch, setShowUpdateSearch] = useState(false);

  // New state to hold the fetched hotel data and loading/error states
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    // Function to fetch data from the backend
    const fetchHotels = async () => {
      setLoading(true);
      setError(null);
      try {
        const searchParamsString = localStorage.getItem('hotelSearchParams');
        if (!searchParamsString) {
          setError("No search parameters found. Please go back and search for a hotel.");
          setLoading(false);
          return;
        }

        const searchParams = JSON.parse(searchParamsString);
        
        const response = await searchHotels(
          searchParams.destination,
          searchParams.checkIn,
          searchParams.checkOut,
          searchParams.adults,
          searchParams.children
        );
        
        // Assuming your backend returns a 'hotels' array.
        // You may need to adjust this based on the actual API response structure.
        if (response && response.hotels) {
             setHotels(response.hotels);
        } else {
             setHotels([]);
        }
       
      } catch (err: any) {
        setError(err.message);
        console.error("Failed to fetch hotels:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []); // The empty dependency array ensures this effect runs only once on mount.

  const breadcrumbs = [
    { name: "Home", link: "/" },
    { name: "Ikeja", link: "/locations/ikeja" },
    { name: "Search Results" },
  ];

  const filterDetails = {
    state: "Lagos",
    city: "Ikeja",
    dates: "Feb 10 - Feb 15 (7 nights)",
    roomsGuests: "1 Room, 1 Guest",
  };

  const handleEditClick = () => {
    setShowUpdateSearch(!showUpdateSearch);
  };

  return (
    <div className="h-screen flex flex-col mt-20">
      <Navbar />
      {(!isMobile || showUpdateSearch) && <UpdateSearchFilter />}
      {!isMobile && <Breadcrumbs items={breadcrumbs} />}

      <div className="min-h-screen px-0">
        <div className="px-4 sm:px-10">
          {isMobile && !showUpdateSearch && (
            <button
              onClick={handleEditClick}
              className="w-full border bg-blue-100 rounded-lg px-4 py-3 my-4 flex justify-between items-center"
            >
              <div className="text-left w-11/12">
                <p className="truncate text-sm">
                  {`${filterDetails.state}, ${filterDetails.city}`}
                </p>
                <p className="truncate text-sm">
                  {`${filterDetails.dates} • ${filterDetails.roomsGuests}`}
                </p>
              </div>
              <span className="text-gray-700 text-sm">
                <FaPencilAlt />
              </span>
            </button>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <span className="text-black font-bold text-lg ml-0 sm:ml-4 mb-4 sm:mb-0">
              {loading ? "Searching..." : error ? "Error" : `${hotels.length} Results`}
            </span>
            <div className="flex gap-4">
              <button
                className="w-25 sm:w-[96px] sm:h-[44px] flex items-center justify-center gap-2 border border-gray-300 rounded-lg shadow-sm"
                onClick={() => setIsFilterModalOpen(true)}
              >
                <HiAdjustmentsHorizontal />
                <span>Filter</span>
              </button>
              <FilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
              />
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
        </div>

        {/* Conditional rendering based on loading/error state */}
        {loading && <div className="text-center py-10">Loading hotels...</div>}
        {error && <div className="text-center py-10 text-red-600">{error}</div>}
        {!loading && !error && (
            <StayList hotels={hotels} />
        )}

        <div className="py-10 bg-gray-100">
          <TravelmateApp />
        </div>
        <Footer />
      </div>

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