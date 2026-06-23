import { useEffect, useMemo, useRef, useState } from "react";
import { FaPencilAlt, FaSortAmountDown } from "react-icons/fa";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import Breadcrumbs from "../../../components/Breadcrumbs";
import Footer from "../../../components/2Footer";
import Navbar from "../../../pages/homePage/Navbar";
import TravelmateApp from "../../../pages/homePage/TravelmateApp";
import { AppDispatch, RootState } from "../../../store";
import { bookingFlowRoutes } from "../../shared/bookingFlowRoutes";
import {
  stayResultsLabel,
  staySearchLabel,
  stayTypeDisplayLabel,
} from "../../shared/booking/bookingFlowLabels";
import PartnerFlowPreview from "../../shared/booking/PartnerFlowPreview";
import UpdateSearchFilter from "../components/UpdateSearchFilter";
import FilterModal from "../components/modals/FilterModal";
import SortModal from "../components/modals/SortModal";
import StayList from "../components/StayList";
import { fetchHotelsAsync } from "../slice";

interface FilterState {
  priceRange: number[];
  selectedStars: number | null;
  amenities: string[];
  propertyTypes: string[];
}

export default function StaysSearchResults() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [queryParams] = useSearchParams();
  const { hotels, loading, error, searchParams, locationDetails } = useSelector(
    (state: RootState) => state.stays,
  );

  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [showUpdateSearch, setShowUpdateSearch] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Recommended");
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 1000000],
    selectedStars: null,
    amenities: [],
    propertyTypes: [],
  });
  const lastSearchSignature = useRef<string>("");

  const sortedHotels = useMemo(() => {
    const filtered = hotels.filter((hotel) => {
      const hotelCountry = (hotel.country ?? "").toLowerCase();
      const hotelAdmin = (hotel.adminLevel1 ?? "").toLowerCase();
      const hotelCity = (hotel.city ?? "").toLowerCase();
      const hotelDestination = (
        hotel.destination?.name ?? hotel.destination?.code ?? ""
      ).toLowerCase();
      const hotelStayType = (hotel.saleMode ?? hotel.accommodation_type ?? "").toLowerCase();

      const matchesCountry =
        !searchParams?.country ||
        !hotelCountry ||
        hotelCountry === searchParams.country.toLowerCase() ||
        hotelDestination.includes(searchParams.country.toLowerCase());
      const matchesAdmin =
        !searchParams?.adminLevel1 ||
        !hotelAdmin ||
        hotelAdmin === searchParams.adminLevel1.toLowerCase() ||
        hotelDestination.includes(searchParams.adminLevel1.toLowerCase());
      const matchesCity =
        !searchParams?.city ||
        !hotelCity ||
        hotelCity === searchParams.city.toLowerCase() ||
        hotelDestination.includes(searchParams.city.toLowerCase());
      const matchesStayType =
        !searchParams?.stayType ||
        !hotelStayType ||
        hotelStayType === searchParams.stayType.toLowerCase();

      return matchesCountry && matchesAdmin && matchesCity && matchesStayType;
    });

    console.debug("[Stays][search] hotels", {
      total: hotels.length,
      filtered: filtered.length,
      searchParams,
    });

    const sorted = [...filtered];
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
  }, [hotels, searchParams, selectedSort]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!searchParams) {
      return;
    }

    const signature = JSON.stringify({
      destination: searchParams.destination ?? "",
      country: searchParams.country ?? "",
      adminLevel1: searchParams.adminLevel1 ?? "",
      city: searchParams.city ?? "",
      stayType: searchParams.stayType ?? "",
      checkIn: searchParams.checkIn ?? "",
      checkOut: searchParams.checkOut ?? "",
      adults: searchParams.adults ?? 0,
      children: searchParams.children ?? 0,
      rooms: searchParams.rooms ?? 0,
      filters,
    });

    if (loading || lastSearchSignature.current === signature) {
      return;
    }

    lastSearchSignature.current = signature;
    dispatch(fetchHotelsAsync({ ...searchParams, ...filters }));
  }, [searchParams, filters, dispatch, loading]);

  const handleApplyFilter = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const breadcrumbs = [
    { name: "Home", link: "/" },
    {
      name: locationDetails?.name || searchParams?.destination || "Search",
    },
    { name: stayResultsLabel() },
  ];

  const formatDateRange = () => {
    if (!searchParams?.checkIn || !searchParams?.checkOut) {
      return "Select travel dates";
    }

    const checkInDate = new Date(searchParams.checkIn);
    const checkOutDate = new Date(searchParams.checkOut);
    const nights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    return `${checkInDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${checkOutDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} (${nights} night${nights > 1 ? "s" : ""})`;
  };

  const filterDetails = {
    state: searchParams?.country || locationDetails?.country_name || "Unknown",
    city: searchParams?.city || locationDetails?.name || "Unknown",
    admin: searchParams?.adminLevel1 || locationDetails?.adminLevel1 || "Unknown",
    dates: formatDateRange(),
    roomsGuests: searchParams
      ? `${searchParams.rooms ?? 1} Room${(searchParams.rooms ?? 1) > 1 ? "s" : ""}, ${(searchParams.adults ?? 0) + (searchParams.children ?? 0)} Guest${((searchParams.adults ?? 0) + (searchParams.children ?? 0)) > 1 ? "s" : ""}`
      : "1 Room, 1 Guest",
    stayType: searchParams?.stayType
      ? stayTypeDisplayLabel(searchParams.stayType)
      : "Any stay type",
  };

  const handleEditClick = () => setShowUpdateSearch(!showUpdateSearch);
  const hasSearchContext = Boolean(
    searchParams?.country ||
      searchParams?.adminLevel1 ||
      searchParams?.city ||
      searchParams?.stayType,
  );
  const partnerFlowMode = queryParams.get("flow") === "partner";

  return (
    <div className="mt-20 flex h-screen flex-col">
      <Navbar />
      {partnerFlowMode && <PartnerFlowPreview legacyLabel="Use legacy flow" />}
      {(!isMobile || showUpdateSearch) && !partnerFlowMode && <UpdateSearchFilter />}
      {!isMobile && <Breadcrumbs items={breadcrumbs} />}

      <div className="min-h-screen px-0">
        <div className="px-4 sm:px-10">
          {isMobile && !showUpdateSearch && (
            <button
              onClick={handleEditClick}
              className="my-4 flex w-full justify-between rounded-lg border bg-blue-100 px-4 py-3"
            >
              <div className="w-11/12 text-left">
                <p className="truncate text-sm">
                  {`${filterDetails.city}, ${filterDetails.admin}, ${filterDetails.state}`}
                </p>
                <p className="truncate text-sm">
                  {`${filterDetails.dates} • ${filterDetails.roomsGuests} • ${filterDetails.stayType}`}
                </p>
              </div>
              <span className="text-sm text-gray-700">
                <FaPencilAlt />
              </span>
            </button>
          )}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="ml-0 text-lg font-bold text-black sm:ml-4 mb-4 sm:mb-0">
              {loading
                ? "Searching..."
                : error
                  ? "Error"
                  : `${hotels.length} ${stayResultsLabel()}`}
            </span>
            <div className="flex gap-4">
              <button
                className="flex w-25 cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 shadow-sm sm:h-[44px] sm:w-[96px]"
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
                className="flex h-[44px] w-25 cursor-pointer items-center justify-between rounded-lg border border-gray-300 px-4 shadow-sm sm:w-[275px]"
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

        {loading && <div className="py-10 text-center">Loading hotels...</div>}
        {error && <div className="py-10 text-center text-red-600">{error}</div>}
        {!loading && !error && hasSearchContext && hotels.length > 0 && (
          <StayList hotels={sortedHotels} />
        )}
        {!loading && !error && hasSearchContext && hotels.length === 0 && (
          <div className="mx-4 my-10 rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center shadow-sm sm:mx-10">
            <h2 className="text-xl font-semibold text-gray-900">No stays found</h2>
            <p className="mt-2 text-sm text-gray-600">
              The partner inventory returned no listings for this search. Try a broader city or date range.
            </p>
            <button
              className="mt-4 rounded-lg bg-[#023E8A] px-4 py-2 text-white"
              onClick={() => navigate(bookingFlowRoutes.staySearch)}
            >
              Search again
            </button>
          </div>
        )}
        {!loading && !error && !hasSearchContext && (
          <div className="mx-4 my-10 rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center shadow-sm sm:mx-10">
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

        <div className="bg-gray-100 py-10">
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
