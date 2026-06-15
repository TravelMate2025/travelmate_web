import { useEffect, useState, useMemo } from "react";
import { FaSortAmountDown, FaPencilAlt } from "react-icons/fa";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import Breadcrumbs from "../../../components/Breadcrumbs";
import StayList from "../components/StayList";
import TravelmateApp from "../../../pages/homePage/TravelmateApp";
import Footer from "../../../components/2Footer";
import SortModal from "../components/modals/SortModal";
import FilterModal from "../components/modals/FilterModal";
import UpdateSearchFilter from "../components/UpdateSearchFilter";
import Navbar from "../../../pages/homePage/Navbar";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../store";
import { fetchHotelsAsync, setLocationDetails, setSearchParams } from "../slice";
import {
  stayResultsLabel,
  staySearchLabel,
  stayTypeDisplayLabel,
} from "../../shared/booking/bookingFlowLabels";
import { bookingFlowRoutes } from "../../shared/bookingFlowRoutes";
import PartnerFlowPreview from "../../shared/booking/PartnerFlowPreview";
import {
  mockStayLocationDetails,
  mockStaySearchParams,
  usePartnerMockData,
} from "../../shared/partnerMockData";

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
  const navigate = useNavigate();
  const [queryParams] = useSearchParams();
  const { hotels, loading, error, searchParams, locationDetails } = useSelector(
    (state: RootState) => state.stays
  );

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

  useEffect(() => {
    if (!usePartnerMockData || searchParams) {
      return;
    }

    dispatch(fetchHotelsAsync({ ...mockStaySearchParams, ...filters }));
    dispatch(setLocationDetails(mockStayLocationDetails));
    dispatch(setSearchParams(mockStaySearchParams));
  }, [dispatch, filters, searchParams]);

  // Use a memoized value for the sorted hotels to avoid re-sorting on every render
  const sortedHotels = useMemo(() => {
    const filtered = hotels.filter((hotel) => {
      const matchesCountry =
        !searchParams?.country ||
        (hotel.country ?? hotel.destination?.name ?? "").toLowerCase() ===
          searchParams.country.toLowerCase();
      const matchesAdmin =
        !searchParams?.adminLevel1 ||
        (hotel.adminLevel1 ?? "").toLowerCase() ===
          searchParams.adminLevel1.toLowerCase();
      const matchesCity =
        !searchParams?.city ||
        (hotel.city ?? hotel.destination?.name ?? "").toLowerCase() ===
          searchParams.city.toLowerCase();
      const matchesStayType =
        !searchParams?.stayType ||
        ((hotel.saleMode ?? hotel.accommodation_type) ?? "").toLowerCase() ===
          searchParams.stayType.toLowerCase();

      return matchesCountry && matchesAdmin && matchesCity && matchesStayType;
    });
    let sorted = [...filtered];
    if (selectedSort === "Price: low to high") {
      sorted.sort((a, b) => {
        const aPrice = parseFloat(a.rooms?.[0]?.rates?.[0]?.net || "0");
        const bPrice = parseFloat(b.rooms?.[0]?.rates?.[0]?.net || "0");
        return aPrice - bPrice;
      });
    } else if (selectedSort === "Price: high to low") {
      sorted.sort((a, b) => {
        const aPrice = parseFloat(a.rooms?.[0]?.rates?.[0]?.net || "0");
        const bPrice = parseFloat(b.rooms?.[0]?.rates?.[0]?.net || "0");
        return bPrice - aPrice;
      });
    }
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
    if (hotels.length > 0 && !loading) {
      return;
    }

    if (searchParams) {
      dispatch(
        fetchHotelsAsync({ ...searchParams, ...filters})
      );
    } else {
      if (!searchParams) {
        console.error("No search parameters found. add search parameters");
      }
    }
  }, [searchParams, filters, dispatch, hotels.length, loading]);

  const handleApplyFilter = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const breadcrumbs = [
    { name: "Home", link: "/" },
    {
      name: locationDetails?.name || searchParams?.destination || mockStayLocationDetails.name || "Search",
    },
    { name: stayResultsLabel() },
  ];

  const formatDateRange = () => {
    if (!searchParams?.checkIn || !searchParams?.checkOut) {
      return `${mockStaySearchParams.checkIn} - ${mockStaySearchParams.checkOut}`;
    }
    
    const checkInDate = new Date(searchParams.checkIn);
    const checkOutDate = new Date(searchParams.checkOut);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return `${checkInDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${checkOutDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} (${nights} night${nights > 1 ? 's' : ''})`;
  };

  const filterDetails = {
    state: searchParams?.country || locationDetails?.country_name || mockStayLocationDetails.country_name || "Unknown",
    city: searchParams?.city || locationDetails?.name || mockStayLocationDetails.name || "Unknown",
    admin: searchParams?.adminLevel1 || locationDetails?.adminLevel1 || "Unknown",
    dates: formatDateRange(),
    roomsGuests: searchParams 
      ? `${searchParams.rooms ?? 1} Room${(searchParams.rooms ?? 1) > 1 ? 's' : ''}, ${(searchParams.adults ?? 0) + (searchParams.children ?? 0)} Guest${((searchParams.adults ?? 0) + (searchParams.children ?? 0)) > 1 ? 's' : ''}`
      : `${mockStaySearchParams.rooms} Room, ${mockStaySearchParams.adults + mockStaySearchParams.children} Guests`,
    stayType: searchParams?.stayType ? stayTypeDisplayLabel(searchParams.stayType) : "Any stay type",
  };

  const handleEditClick = () => setShowUpdateSearch(!showUpdateSearch);
  const hasSearchContext = Boolean(
    searchParams?.country ||
      searchParams?.adminLevel1 ||
      searchParams?.city ||
      searchParams?.stayType ||
      usePartnerMockData,
  );
  const partnerFlowMode = queryParams.get("flow") === "partner";

  return (
    <div className="h-screen flex flex-col mt-20">
      <Navbar />
      {partnerFlowMode && <PartnerFlowPreview legacyLabel="Use legacy flow" />}
      {(!isMobile || showUpdateSearch) && !partnerFlowMode && <UpdateSearchFilter />}
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
                  {`${filterDetails.city}, ${filterDetails.admin}, ${filterDetails.state}`}
                </p>
                <p className="truncate text-sm">
                  {`${filterDetails.dates} • ${filterDetails.roomsGuests} • ${filterDetails.stayType}`}
                </p>
              </div>
              <span className="text-gray-700 text-sm">
                <FaPencilAlt />
              </span>
            </button>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <span className="text-black font-bold text-lg ml-0 sm:ml-4 mb-4 sm:mb-0">
              {loading
                ? "Searching..."
                : error
                ? "Error"
                : `${hotels.length} ${stayResultsLabel()}`}
            </span>
            <div className="flex gap-4">
              <button
                className="w-25 sm:w-[96px] sm:h-[44px] flex items-center justify-center gap-2 border border-gray-300 rounded-lg shadow-sm cursor-pointer"
                onClick={() => setIsFilterModalOpen(true)}
              >
                <HiAdjustmentsHorizontal />
                <span>Filter</span>
              </button>
              <FilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                onApplyFilter={handleApplyFilter}
              />
              <button
                className="w-25 sm:w-[275px] h-[44px] flex items-center justify-between px-4 border border-gray-300 rounded-lg shadow-sm cursor-pointer"
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
        {!loading && !error && hasSearchContext && <StayList hotels={sortedHotels} />}
        {!loading && !error && !hasSearchContext && (
          <div className="mx-4 sm:mx-10 my-10 rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">{staySearchLabel()}</h2>
            <p className="mt-2 text-sm text-gray-600">
              Start a stay search to see results and pricing.
            </p>
            <button
              className="mt-4 rounded-lg bg-[#023E8A] px-4 py-2 text-white"
              onClick={() => navigate(bookingFlowRoutes.staySearch)}
            >
              Go to search
            </button>
          </div>
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
