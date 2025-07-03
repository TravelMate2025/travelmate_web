import { useEffect, useState, useMemo } from "react";
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
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { fetchHotelsAsync } from "../features/stay/staysSlice";

// Define the type for a hotel object based on the API response structure
export interface Hotel {
  image: string;
  id: number;
  name: string;
  category?: string;
  latitude?: string;
  longitude?: string;
  destination?: string;
  zone?: string;
  rooms: Room[];
}

interface Room {
  name: string;
  code: string;
  rates: Rate[];
}

interface Rate {
  rateKey: string;
  price: string;
  boardName: string;
  cancellationPolicies: {
    amount: string;
    from: string;
  }[];
  rateClass: string;
  rateType: string;
  paymentType: string;
}

// Define the type for the filter state
interface FilterState {
  priceRange: number[];
  selectedStars: number | null;
  amenities: string[];
  propertyTypes: string[];
}

export default function StaysSearchResults() {
  // Use Redux hooks to access state and dispatch actions
  const dispatch = useDispatch<AppDispatch>();
  const { hotels, loading, error, searchParams } = useSelector((state: RootState) => state.stays);
  const { accessToken } = useSelector((state: RootState) => state.auth);

  // State for modals and visibility
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [showUpdateSearch, setShowUpdateSearch] = useState(false);

  // State for sorting and filtering
  const [selectedSort, setSelectedSort] = useState("Recommended");
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 1000000],
    selectedStars: null,
    amenities: [],
    propertyTypes: [],
  });

  // Use a memoized value for the sorted hotels to avoid re-sorting on every render
  const sortedHotels = useMemo(() => {
    let sorted = [...hotels]; // Create a shallow copy to avoid mutating state
    if (selectedSort === "Price: low to high") {
      sorted.sort((a, b) => {
        const aPrice = parseFloat(a.rooms?.[0]?.rates?.[0]?.price || "0");
        const bPrice = parseFloat(b.rooms?.[0]?.rates?.[0]?.price || "0");
        return aPrice - bPrice;
      });
    } else if (selectedSort === "Price: high to low") {
      sorted.sort((a, b) => {
        const aPrice = parseFloat(a.rooms?.[0]?.rates?.[0]?.price || "0");
        const bPrice = parseFloat(b.rooms?.[0]?.rates?.[0]?.price || "0");
        return bPrice - aPrice;
      });
    }
    // "Recommended" sort can be handled by the backend's default order
    return sorted;
  }, [hotels, selectedSort]);

  // Effect to handle window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Effect to fetch hotel data based on filters and search parameters from Redux
  useEffect(() => {
    // Check if we already have hotels and are not currently loading
    if (hotels.length > 0 && !loading) {
        console.log("Loading stays from cache.");
        // No need to fetch again if data is already present and not loading.
        return; 
    }

    // Check if searchParams and accessToken are available in the Redux store
    if (searchParams && accessToken) {
      dispatch(fetchHotelsAsync({ searchParams, filters, token: accessToken }));
    } else {
      // Set an error if searchParams are missing. You can add a check for accessToken as well.
      // The thunk already handles the missing token, but this can be a user-friendly message.
      if (!searchParams) {
        console.error("No search parameters found. add search parameters");
      }
    }
  }, [searchParams, filters, accessToken, dispatch]);

  // Handler for applying filters from the modal
  const handleApplyFilter = (newFilters: FilterState) => {
    setFilters(newFilters);
    // The useEffect hook will automatically re-fetch hotels with the new filters
  };

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

  const handleEditClick = () => setShowUpdateSearch(!showUpdateSearch);

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
                onApplyFilter={handleApplyFilter} // Pass the new handler
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
            // Pass the sorted list to StayList
            <StayList hotels={sortedHotels} />
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
          onSelect={(option) => setSelectedSort(option)} // Update sort state
        />
      )}
    </div>
  );
}