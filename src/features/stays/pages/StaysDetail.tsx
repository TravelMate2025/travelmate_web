import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { clearSelectedHotel, fetchStayDetailsAsync, fetchStayPricingAsync, clearStayPricing, fetchStayRoomsAsync } from "../slice";
import UpdateSearchFilter from "../components/UpdateSearchFilter";
import Breadcrumbs from "../../../components/Breadcrumbs";
import {
  FaImages,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaHeart,
  FaShareAlt,
  FaStar,
  //  FaWifi, FaSwimmingPool, FaSnowflake, FaCar,
  FaExpandArrowsAlt,
  FaBed,
  FaTicketAlt,
} from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import AmenitiesModal from "../components/modals/AmenitiesModal";

// Assuming these are placeholder images, they will be replaced by API images
import StayImagePlaceholder from "../../../assets/images/StayImage.png";
import StayImage2Placeholder from "../../../assets/images/StayImage2.png";
import StayImageCopyPlaceholder from "../../../assets/images/StayImageCopy.png";

import Navbar from "../../../pages/homePage/Navbar";
import TravelmateApp from "../../../pages/homePage/TravelmateApp";
import Footer from "../../../components/2Footer";
import Reviews from "../components/Reviews";
import ReviewsModal from "../components/modals/ReviewModal";
import AllPhotosModal from "../components/modals/AllPhotosModal";
import ShareModal from "../components/modals/ShareModal";
import RefundCancellation from "../components/booking-progress/RefundCancellation";

import { useMediaQuery } from "react-responsive";
import StaysDetailSkeleton from "./StaysDetailsSkeleton";
import { getReviews } from "../api";
import {
  stayDetailsLabel,
  pricingSourceLabel,
  stayResultsLabel,
  stayTypeDisplayLabel,
  propertyTypeDisplayLabel,
} from "../../shared/booking/bookingFlowLabels";
import { bookingFlowRoutes } from "../../shared/bookingFlowRoutes";
import { CatalogReview } from "../types";
import { recordViewed, recentlyViewedFromHotel } from "../../shared/recentlyViewed";

const StaysDetail: React.FC = () => {
  const { hotelId } = useParams<{ hotelId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { detailsLoading, searchParams, hotels, stayPricing, pricingLoading, pricingError } = useSelector(
    (state: RootState) => state.stays
  );
  const selectedHotelFromList = hotels.find((hotel) => (hotel.id ?? hotel.code) === hotelId);
  const selectedHotel = useSelector((state: RootState) => state.stays.selectedHotel) ?? selectedHotelFromList;
  const [activeTab, setActiveTab] = useState("Overview");
  const [openModal, setOpenModal] = useState(false);
  const [showPhotosModal, setShowPhotosModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const carouselRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  // Room rate plan selection state (inline expansion)
  const [expandedRoomId, setExpandedRoomId] = useState<string | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  const visibleCount = 8;
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const [reviews, setReviews] = useState<CatalogReview[]>([]);

  useEffect(() => {
    if (hotelId) {
      dispatch(fetchStayDetailsAsync({
        stayId: hotelId,
        checkIn: searchParams?.checkIn,
        checkOut: searchParams?.checkOut,
        adults: searchParams?.adults,
        children: searchParams?.children,
        rooms: searchParams?.rooms,
      }));
      dispatch(fetchStayPricingAsync(hotelId));
    }
    return () => {
      dispatch(clearSelectedHotel());
      dispatch(clearStayPricing());
    };
  }, [dispatch, hotelId, searchParams?.checkIn, searchParams?.checkOut, searchParams?.adults, searchParams?.children, searchParams?.rooms]);

  // Record once real data (not just the loading skeleton) is present --
  // recordViewed dedupes by id, so re-firing on incidental re-renders is harmless.
  useEffect(() => {
    if (selectedHotel) {
      recordViewed(recentlyViewedFromHotel(selectedHotel));
    }
  }, [selectedHotel]);

  // Sync the carousel with the current index when a navigation dot is clicked
  const handleSelectImage = (index: number) => {
    setCurrentIndex(index);
    if (carouselRef.current) {
      carouselRef.current.scrollTo({
        left: index * carouselRef.current.offsetWidth, // Use offsetWidth for correct scroll
        behavior: "smooth",
      });
    }
  };

  // Handle manual scrolling
  const handleScroll = useCallback(() => {
    if (carouselRef.current) {
      const scrollLeft = carouselRef.current.scrollLeft;
      const newIndex = Math.floor(scrollLeft / carouselRef.current.offsetWidth);
      setCurrentIndex((prev) => (prev === newIndex ? prev : newIndex));
    }
  }, []);

  // Listen for scroll events to update the current index
  useEffect(() => {
    const handleResize = () => {
      if (carouselRef.current) {
        // On resize, make sure scroll position and index are in sync
        const scrollLeft = carouselRef.current.scrollLeft;
        const newIndex = Math.floor(
          scrollLeft / carouselRef.current.offsetWidth
        );
        setCurrentIndex(newIndex);
        // Also adjust scroll position immediately on resize to prevent visual glitches
        carouselRef.current.scrollTo({
          left: newIndex * carouselRef.current.offsetWidth,
          behavior: "instant",
        });
      }
    };

    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener("scroll", handleScroll);
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (carousel) {
        carousel.removeEventListener("scroll", handleScroll);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [handleScroll]);

  const handleShowPhotosClick = () => {
    setShowPhotosModal(true);
  };

  const sections = [
    { name: "Overview" },
    { name: "About" },
    { name: "Amenities" },
    { name: "Select a room" },
    { name: "Reviews" },
    { name: "Refund and cancellations" },
    { name: "Policies" },
  ];

  const getCancellationPolicy = () => {
    const policy = availableRooms[0]?.rates?.[0]?.cancellationPolicies?.[0];
    if (!policy?.from) return "Partial cancellation — 60% refund";

    const cancelDate = new Date(policy.from);
    return `Fully refundable until ${cancelDate.toLocaleDateString()} at ${cancelDate.toLocaleTimeString(
      [],
      { hour: "2-digit", minute: "2-digit" }
    )}`;
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await getReviews(hotelId || "");
        setReviews(response ?? []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, [hotelId]);

  // Use actual images from selectedHotel or placeholders
  const hotelImages = selectedHotel?.images?.map((img) => img.secureUrl ?? img.url ?? "") || [
    StayImagePlaceholder,
    StayImage2Placeholder,
    StayImageCopyPlaceholder,
  ];

  // Use actual rooms from selectedHotel or empty array
  const availableRooms = selectedHotel?.rooms || [];

  const breadcrumbs = [
    { name: "Home", link: "/" },
    {
      name: selectedHotel?.destination?.name || "Location",
      // link: `/${}/${selectedHotel?.destination?.code || ""}`,
    },
    {
      name: stayResultsLabel(),
      link: `${bookingFlowRoutes.staySearch}?location=${selectedHotel?.destination?.code}&checkin=${searchParams?.checkIn}&checkout=${searchParams?.checkOut}&adults=${searchParams?.adults}&children=${searchParams?.children}&rooms=${searchParams?.rooms}`,
    },
    { name: selectedHotel?.name || stayDetailsLabel() },
  ];

  const amenities: { icon: JSX.Element; name: string }[] =
    selectedHotel?.amenities?.map((amenity: string) => ({
      icon: <FaCheckCircle className="text-blue-600" />,
      name: amenity,
    })) || [];

  const isRoomLevel =
    (selectedHotel?.saleMode ?? selectedHotel?.accommodation_type) === "room_level";

  // Live per-room remainingInventory/isExhausted -- only available from the
  // dedicated rooms endpoint, and only meaningful once we know this is a
  // room_level stay (unit-level properties have no rooms[] to enrich).
  useEffect(() => {
    if (hotelId && isRoomLevel) {
      dispatch(fetchStayRoomsAsync(hotelId));
    }
  }, [dispatch, hotelId, isRoomLevel]);

  const roomSummary = (selectedHotel?.roomSummary ?? {}) as Record<string, unknown>;
  const mediaSummary = (selectedHotel?.mediaSummary ?? {}) as Record<string, unknown>;
  const coordinates = selectedHotel?.coordinates;
  const formatSummaryValue = (value: unknown) => {
    if (value === null || value === undefined || value === "") return null;
    if (typeof value === "number") return value.toLocaleString();
    if (typeof value === "boolean") return value ? "Yes" : "No";
    return String(value);
  };
  const summaryRows = [
    { label: "Base rate", value: formatSummaryValue(roomSummary.minBaseRate ?? selectedHotel?.priceFrom) },
    { label: "Rooms", value: formatSummaryValue(roomSummary.totalRooms ?? roomSummary.availableRooms ?? selectedHotel?.rooms?.length) },
    { label: "Media items", value: formatSummaryValue(mediaSummary.total ?? mediaSummary.imagesCount ?? selectedHotel?.images?.length) },
    { label: "Check-in", value: formatSummaryValue(selectedHotel?.checkInTime) },
    { label: "Check-out", value: formatSummaryValue(selectedHotel?.checkOutTime) },
    { label: "Rating", value: formatSummaryValue(selectedHotel?.ratingScore) },
    { label: "Latitude", value: formatSummaryValue(coordinates?.latitude) },
    { label: "Longitude", value: formatSummaryValue(coordinates?.longitude) },
  ].filter((row): row is { label: string; value: string } => Boolean(row.value));

  // Pre-select the first cancellation option for unit_level when pricing loads
  useEffect(() => {
    if (!isRoomLevel && stayPricing?.cancellationOptions?.length) {
      setSelectedOptionId((prev) => prev ?? stayPricing!.cancellationOptions[0].optionId);
    }
  }, [isRoomLevel, stayPricing]);

  /** Returns the cancellation options to display for a given room. */
  const getRoomOptions = (roomId: string) => {
    if (!stayPricing) return [];
    if (isRoomLevel) {
      return (
        stayPricing.roomCancellationOptions?.find((r) => r.roomId === roomId)
          ?.cancellationOptions ?? []
      );
    }
    return stayPricing.cancellationOptions ?? [];
  };

  const resolveRatePlanId = (roomId: string, optionId?: string) => {
    if (!isRoomLevel) return null;
    const wantsRefundable = optionId === "FREE_CANCELLATION";
    const matched = stayPricing?.ratePlans?.find((plan) => {
      if (plan.roomId !== roomId || !plan.isActive) return false;
      return wantsRefundable ? plan.planType === "refundable" : plan.planType === "non_refundable";
    });
    return matched?.id ?? stayPricing?.ratePlans?.find((plan) => plan.roomId === roomId && plan.isActive)?.id ?? null;
  };

  const handleReserveUnitLevel = () => {
    const options = stayPricing?.cancellationOptions ?? [];
    const option = options.find((o) => o.optionId === selectedOptionId) ?? options[0];
    if (!option) return;
    navigate(bookingFlowRoutes.stayBookingReview, {
      state: {
        selectedOption: option,
        selectedRoom: null,
        hotel: selectedHotel,
        checkIn: searchParams?.checkIn,
        checkOut: searchParams?.checkOut,
        guestsAdults: searchParams?.adults,
        guestsChild: searchParams?.children,
      },
    });
  };

  const handleBookRoom = (roomId: string) => {
    const room = availableRooms.find((r) => (r.id ?? r.code) === roomId);
    const options = getRoomOptions(roomId);
    const option = options.find((o) => o.optionId === selectedOptionId) ?? options[0];
    if (!room || !option) return;
    navigate(bookingFlowRoutes.stayBookingReview, {
      state: {
        selectedOption: option,
        selectedRoom: room,
        hotel: selectedHotel,
        checkIn: searchParams?.checkIn,
        checkOut: searchParams?.checkOut,
        guestsAdults: searchParams?.adults,
        guestsChild: searchParams?.children,
        ratePlanId: resolveRatePlanId(roomId, option.optionId),
      },
    });
  };
 
  // Conditional Rendering for Loading/Error states
  if (detailsLoading) {
    return <StaysDetailSkeleton />;
  }

  // if (detailsError) {
  //   return (
  //     <div className="flex justify-center items-center h-screen">
  //       <p className="text-xl font-semibold text-red-600">
  //         Error: {detailsError}
  //       </p>
  //     </div>
  //   );
  // }

  // if (!selectedHotel) {
  //   return (
  //     <div className="flex justify-center items-center h-screen">
  //       <p className="text-xl font-semibold">No hotel details found.</p>
  //     </div>
  //   );
  // }

  return (
    <div>
      {/* Navbar - Hidden on mobile */}
      {!isMobile && <Navbar />}

      <div className="px-4 sm:px-10 mt-4 flex items-center gap-3 flex-wrap">
        <h1 className="text-2xl font-bold">{stayDetailsLabel()}</h1>
        {propertyTypeDisplayLabel(selectedHotel?.propertyType ?? selectedHotel?.category) && (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
            {propertyTypeDisplayLabel(selectedHotel?.propertyType ?? selectedHotel?.category)}
          </span>
        )}
        <span className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700">
          {stayTypeDisplayLabel(selectedHotel?.saleMode ?? selectedHotel?.accommodation_type)}
        </span>
      </div>

      {/* Pricing summary banner */}
      <div className="mx-4 sm:mx-10 mt-3 rounded-xl border border-blue-100 bg-blue-50/80 px-4 py-3 text-sm text-blue-900">
        {pricingLoading && (
          <div className="text-blue-500 animate-pulse">{pricingSourceLabel()} — Loading pricing…</div>
        )}
        {pricingError && !pricingLoading && (
          <div className="text-red-500">Could not load pricing. Try refreshing.</div>
        )}
        {stayPricing && !pricingLoading && (() => {
          const bd = stayPricing.priceBreakdown;
          const from = bd?.total?.amount ?? stayPricing.baseRate;
          const weekday = bd?.rateBands?.weekday?.amount ?? stayPricing.weekdayRate;
          const weekend = bd?.rateBands?.weekend?.amount ?? stayPricing.weekendRate;
          const currency = stayPricing.currency;
          return (
            <div className="flex flex-wrap gap-x-6 gap-y-1 items-center">
              <span className="text-lg font-bold text-blue-900">
                {currency} {from.toLocaleString()}
                <span className="text-sm font-normal text-blue-700 ml-1">/ night</span>
              </span>
              <span className="text-xs text-blue-600">
                Weekday: {currency} {weekday.toLocaleString()}
                {" · "}
                Weekend: {currency} {weekend.toLocaleString()}
              </span>
              {"taxesInclusive" in (bd ?? {}) && (bd as { taxesInclusive?: boolean })?.taxesInclusive && (
                <span className="text-xs text-blue-500">Taxes &amp; fees inclusive</span>
              )}
            </div>
          );
        })()}
      </div>

      {/* Search Filter - Hidden on mobile */}
      {!isMobile && (
        <div className="mt-18">
          <UpdateSearchFilter />
        </div>
      )}

      {/* Breadcrumbs - Hidden on mobile */}
      <div className="mt-4 px-6 border-b border-gray-300 hidden md:block">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <div className="mt-0 sm:mt-4 px-0 sm:px-6 relative">
        {/* Desktop Grid (Hidden on Mobile) */}
        <div className="hidden md:grid grid-cols-2 gap-4 mt-2 p-10">
          <div className="relative">
            <img
              src={hotelImages[0] || StayImagePlaceholder} // Use first image or placeholder
              alt={selectedHotel?.name}
              className="w-full h-[445px] object-cover rounded-lg"
              onError={(e) => (e.currentTarget.src = StayImagePlaceholder)} // Fallback on error
            />
            <button
              className="absolute bottom-4 left-4 flex items-center gap-2 bg-white cursor-pointer px-4 py-2 rounded-lg shadow-md"
              onClick={handleShowPhotosClick}
            >
              <FaImages className="text-gray-600" />
              Show all {hotelImages.length} photos
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {hotelImages.slice(1, 5).map((image, index) => (
              <img
                key={index}
                src={image || StayImage2Placeholder} // Use image or placeholder
                alt={`${selectedHotel?.name} ${index + 2}`}
                className="w-full h-[214px] object-cover rounded-lg"
                onError={(e) => (e.currentTarget.src = StayImage2Placeholder)} // Fallback on error
              />
            ))}
          </div>
        </div>

        {/* Mobile Carousel (Hidden on Desktop) */}
        <div className="md:hidden flex flex-col items-center relative">
          {/* Image Carousel with Buttons on Top */}
          <div className="relative w-full h-[80vw] max-h-[450px]">
            <div className="absolute top-4 left-0 right-0 z-10 px-4 flex justify-between items-center">
              <button
                className="bg-white p-2 rounded-md shadow"
                onClick={() => navigate(-1)}
              >
                {/* Back Button with React Icon */}
                <FaArrowLeft className="w-5 h-5 text-gray-800" />
              </button>

              <div className="flex gap-2">
                <button
                  className="bg-white p-2 rounded-md shadow"
                  onClick={() => setShowShareModal(true)}
                >
                  {/* Share Button with React Icon */}
                  <FaShareAlt className="w-5 h-5 text-gray-800" />
                </button>
                <button className="bg-white p-2 rounded-md shadow">
                  {/* Favorite Button with React Icon */}
                  <FaHeart className="w-5 h-5 text-gray-800" />
                </button>
              </div>
            </div>

            {/* Image Carousel - Make it scrollable */}
            <div
              className="flex overflow-x-auto h-full snap-x snap-mandatory"
              ref={carouselRef}
            >
              {hotelImages.map((image, index) => (
                <img
                  key={index}
                  src={image || StayImagePlaceholder} // Use image or placeholder
                  alt={`${selectedHotel?.name} ${index + 1}`}
                  className="w-full h-full object-cover flex-shrink-0 snap-center"
                  onError={(e) => (e.currentTarget.src = StayImagePlaceholder)} // Fallback on error
                />
              ))}
            </div>

            {/* Photo Indicator - Displayed Below the Image */}
            <div className="absolute bottom-6 right-3 flex items-center border border-white gap-2 bg-opacity-75 px-3 py-1 rounded-md ">
              <span className="text-white text-sm">
                {currentIndex + 1} out of {hotelImages.length}
              </span>
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex gap-2 mt-4 overflow-x-scroll flex-wrap px-12">
            {hotelImages.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full ${
                  currentIndex === index ? "bg-orange-500" : "bg-gray-300"
                }`}
                onClick={() => handleSelectImage(index)}
              />
            ))}
          </div>
        </div>

        {showPhotosModal && (
          <AllPhotosModal
            onClose={() => setShowPhotosModal(false)}
            images={hotelImages}
          />
        )}
        {showShareModal && selectedHotel && (
          <ShareModal
            onClose={() => setShowShareModal(false)}
            shareLink={`/stay-details/${selectedHotel?.code}`}
          />
        )}
      </div>

      <div className="relative w-[93%] mx-auto px-4">
        {/* Navigation Tabs */}

        {/* Navigation Tabs */}
        <div className="sticky top-0 bg-white z-50 border-b border-gray-300 hidden md:block">
          <div className="px-6 mx-auto">
            <ul className="flex gap-6 text-gray-600 text-sm font-medium w-full justify-between px-6">
              {sections.map((section) => (
                <li
                  key={section.name}
                  className={`cursor-pointer pb-3 ${
                    activeTab === section.name
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : ""
                  }`}
                  onClick={() => {
                    setActiveTab(section.name);
                    const sectionElement = document.getElementById(
                      section.name
                    );
                    if (sectionElement) {
                      const offset = 70; // Adjust this value based on your header height
                      const elementPosition =
                        sectionElement.getBoundingClientRect().top;
                      const offsetPosition =
                        elementPosition + window.pageYOffset - offset;

                      window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth",
                      });
                    }
                  }}
                >
                  {section.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <section id="Overview">
          {/* Overview Section */}
          <div id="Overview" className="py-6 border-b border-gray-300">
            <h1 className="text-2xl font-bold text-black">
              {selectedHotel?.name}
            </h1>
            <p className="text-gray-700 flex items-center gap-2 mt-2">
              <FaMapMarkerAlt className="text-gray-500" />
              {selectedHotel?.address}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {summaryRows.map((row) => (
                <div key={row.label} className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                  <p className="text-[11px] uppercase tracking-wide text-gray-500">{row.label}</p>
                  <p className="text-sm font-semibold text-gray-900">{row.value}</p>
                </div>
              ))}
            </div>
            {/* Refundability info is not directly in HotelDetail, you might need to infer from rooms */}
            <p className="text-green-600 flex items-center gap-2 mt-2">
              <FaCheckCircle />
              {getCancellationPolicy()}
            </p>
            {/* Rating and Reviews - Assuming these are static for now or fetched separately */}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-yellow-500 flex items-center gap-1">
                <FaStar />
                {selectedHotel?.ratingScore ?? "N/A"}
              </span>
              <span className="text-gray-600">
                ({selectedHotel?.reviewsCount ?? reviews.length ?? "0"})
              </span>
              {reviews?.length > 0 && (
                <button
                  className="text-blue-600 underline cursor-pointer"
                  onClick={() => setOpenModal(true)}
                >
                  Show all {reviews?.length || "0"} reviews
                </button>
              )}
            </div>
            {openModal && (
              <ReviewsModal
                onClose={() => setOpenModal(false)}
                reviews={reviews}
              />
            )}
          </div>
        </section>
        <section id="About">
          {/* About Section */}
          <div id="About" className="py-6 border-b border-gray-300">
            <h2 className="text-xl font-semibold">About this Hotel</h2>
            <p className="text-gray-700 mt-2">
              {selectedHotel?.description || "No description available."}
              <br />
              <strong>Check-in:</strong> {selectedHotel?.checkInTime || "3pm"}, <strong>Check-out:</strong> {selectedHotel?.checkOutTime || "12pm"}.
            </p>
          </div>
        </section>
        <section id="Amenities" className="py-6 border-b border-gray-300">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              Amenities ({amenities.length})
            </h2>
            <button
              className="text-blue-600 text-sm flex items-center md:hidden"
              onClick={() => setIsOpen(true)}
            >
              Show all <span className="ml-1">{">"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 mt-2 md:grid-cols-3 lg:grid-cols-4">
            {!isMobile &&
              amenities.map((item, index) => (
                <p key={index} className="flex items-center gap-2">
                  {item.icon} {item.name}
                </p>
              ))}
            {isMobile &&
              amenities.slice(0, visibleCount).map((item, index) => (
                <p key={index} className="flex items-center gap-2">
                  {item.icon} {item.name}
                </p>
              ))}
          </div>
        </section>
        {/* Show the modal */}
        <AmenitiesModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          amenities={amenities}
        />
        <section id="Select a room" className="mt-10">
          {!isRoomLevel ? (
            /* ── unit_level: full-property reserve panel ── */
            <div>
              <h3 className="font-semibold mx-1 my-2 text-xl">Reserve this property</h3>
              {pricingLoading && (
                <p className="text-blue-500 animate-pulse text-sm mt-2">Loading rates…</p>
              )}
              {stayPricing?.cancellationOptions?.length ? (
                <div className="border border-blue-100 rounded-xl overflow-hidden max-w-lg mt-4">
                  <div className="bg-blue-50 px-4 py-2 text-xs text-blue-700 font-medium">
                    Choose your rate
                  </div>
                  {stayPricing.cancellationOptions.map((option) => (
                    <label
                      key={option.optionId}
                      className={`flex items-start gap-3 px-4 py-3 cursor-pointer border-b border-gray-100 last:border-0 hover:bg-gray-50 ${
                        selectedOptionId === option.optionId ? "bg-blue-50/60" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="unit-rate"
                        value={option.optionId}
                        checked={selectedOptionId === option.optionId}
                        onChange={() => setSelectedOptionId(option.optionId)}
                        className="mt-0.5 accent-[#023E8A]"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center gap-2">
                          <span className="font-semibold text-sm">{option.label}</span>
                          <span className="font-bold text-sm whitespace-nowrap">
                            {stayPricing.currency} {option.amount.toLocaleString()}
                            <span className="text-xs font-normal text-gray-500">/night</span>
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {option.policyCopy}
                          {option.refundPercent != null && ` · ${option.refundPercent}% refund if cancelled on time`}
                        </p>
                      </div>
                    </label>
                  ))}
                  <div className="px-4 py-4 bg-white">
                    <button
                      className="w-full bg-[#023E8A] text-white py-2.5 rounded-lg hover:bg-[#023E9E] transition-colors cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
                      disabled={!selectedOptionId || !searchParams?.checkIn}
                      onClick={handleReserveUnitLevel}
                    >
                      Reserve
                    </button>
                    {!searchParams?.checkIn && (
                      <p className="text-xs text-center text-gray-400 mt-2">
                        Select dates above to continue
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                !pricingLoading && (
                  <p className="text-sm text-gray-500 mt-2">
                    No rates available. Try refreshing.
                  </p>
                )
              )}
            </div>
          ) : (
          /* ── room_level: per-room cards ── */
          <div>
          <h3 className="font-semibold mx-1 my-2 text-xl">Select a room</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableRooms.length > 0 ? (
              availableRooms.map((room) => {
                const roomId = room.id ?? room.code ?? "";
                // "from" price: cheapest option from pricing endpoint, otherwise baseRate
                const roomOptions = getRoomOptions(roomId);
                const fromPrice =
                  roomOptions[0]?.amount ?? room.baseRate ??
                  (room.rates?.[0]?.net ? parseFloat(room.rates[0].net) : null);

                return (
                  <div
                    key={roomId}
                    className="relative w-full h-auto flex flex-col bg-white shadow-lg rounded-lg p-4 border border-gray-200"
                  >
                    {/* Room Image - with priority image sources */}
                    <div className="relative h-[234px] bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={
                          room.images?.[0]?.secureUrl ?? room.images?.[0]?.url ??
                          selectedHotel?.images?.[0]?.secureUrl ?? selectedHotel?.images?.[0]?.url ??
                          StayImage2Placeholder
                        }
                        alt={room.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = StayImage2Placeholder;
                          e.currentTarget.onerror = null;
                        }}
                      />
                      {(room.occupancy ?? room.max_occupancy) && (
                        <span className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-sm">
                          Max {room.occupancy ?? room.max_occupancy} guests
                        </span>
                      )}
                      {/* Prefer live inventory from fetchStayRoomsAsync; fall
                          back to the static totalInventory from the detail
                          response while that call is still loading (or if
                          it failed) so the badge isn't blank on first paint. */}
                      {(() => {
                        const roomInventory = room.remainingInventory ?? room.totalInventory;
                        if (roomInventory == null) return null;
                        return (
                          <span
                            className={`absolute top-2 left-2 px-2 py-1 rounded text-sm font-medium ${
                              room.isExhausted
                                ? "bg-red-100 text-red-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {room.isExhausted ? "Sold out" : `${roomInventory} left`}
                          </span>
                        );
                      })()}
                    </div>

                    {/* Room Details */}
                    <div className="mt-4 flex flex-col flex-1">
                      <h3 className="text-lg font-bold">
                        {room.description || room.name || "Room"}
                      </h3>

                      {/* Amenities List */}
                      <div className="mt-3 space-y-2">
                        {room.size_sqm != null && (
                          <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <FaExpandArrowsAlt />
                            <span>{room.size_sqm}m²</span>
                          </div>
                        )}

                        {room && (
                          <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <FaBed />
                            <span>{room.bedConfiguration ?? room.bedType ?? room.bed_type ?? room.name}</span>
                          </div>
                        )}

                        {(room.amenities?.length ?? 0) > 0 && (
                          <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <FaCheckCircle />
                            <span>{room.amenities!.slice(0, 2).join(", ")}</span>
                            {room.amenities!.length > 2 && (
                              <span className="text-xs text-gray-400">
                                +{room.amenities!.length - 2} more
                              </span>
                            )}
                          </div>
                        )}
                        {room.rates?.[0]?.boardName && (
                          <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <FaCheckCircle />
                            <span>{room.rates[0].boardName}</span>
                          </div>
                        )}
                        {room.maxPerBooking != null && (
                          <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <FaTicketAlt />
                            <span>Max {room.maxPerBooking} per booking</span>
                          </div>
                        )}
                        {/* Sourced from the same pricing endpoint as the "from"
                            price below (roomOptions), not room.rates -- keeps
                            the price and the policy copy shown together
                            consistent with each other. */}
                        {(roomOptions[0]?.policyCopy ?? roomOptions[0]?.label) && (
                          <div className="flex items-center gap-2 text-green-700 text-sm">
                            <FaCheckCircle />
                            <span>{roomOptions[0]?.policyCopy ?? roomOptions[0]?.label}</span>
                          </div>
                        )}
                      </div>

                      {/* Pricing — "from" price using cheapest rate plan */}
                      <div className="mt-4 flex items-center justify-between gap-2">
                        {fromPrice != null ? (
                          <p className="text-xl font-bold">
                            from ₦{fromPrice.toLocaleString()}
                            <span className="text-sm font-normal text-gray-500 ml-1">/ night</span>
                          </p>
                        ) : (
                          <p className="text-sm text-gray-400">Price on selection</p>
                        )}
                        {roomOptions.length > 0 && (
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {roomOptions.length} rate option{roomOptions.length === 1 ? "" : "s"}
                          </span>
                        )}
                      </div>

                      {/* Rate plan selector — expands inline when room is selected */}
                          <div className="mt-auto pt-4">
                        {expandedRoomId !== roomId ? (
                          <button
                            disabled={room.isExhausted}
                            className="w-full bg-[#023E8A] text-white py-2 rounded-lg hover:bg-[#023E9E] transition-colors cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
                            onClick={() => {
                              setExpandedRoomId(roomId);
                              setSelectedOptionId(
                                getRoomOptions(roomId)[0]?.optionId ?? null
                              );
                            }}
                          >
                            {room.isExhausted ? "Sold out" : "Select"}
                          </button>
                        ) : (
                          <div className="border border-blue-100 rounded-lg overflow-hidden">
                            <div className="bg-blue-50 px-3 py-2 text-xs text-blue-700 font-medium flex justify-between">
                              <span>Choose your rate</span>
                              <button
                                className="text-gray-400 hover:text-gray-600"
                                onClick={() => setExpandedRoomId(null)}
                              >
                                ✕
                              </button>
                            </div>
                            {getRoomOptions(roomId).map((option) => (
                              <label
                                key={option.optionId}
                                className={`flex items-start gap-3 px-3 py-3 cursor-pointer border-b border-gray-100 last:border-0 hover:bg-gray-50 ${
                                  selectedOptionId === option.optionId
                                    ? "bg-blue-50/60"
                                    : ""
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`rate-${roomId}`}
                                  value={option.optionId}
                                  checked={selectedOptionId === option.optionId}
                                  onChange={() => setSelectedOptionId(option.optionId)}
                                  className="mt-0.5 accent-[#023E8A]"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-center gap-2">
                                    <span className="font-semibold text-sm">
                                      {option.label}
                                    </span>
                                    <span className="font-bold text-sm whitespace-nowrap">
                                      ₦{option.amount.toLocaleString()}
                                      <span className="text-xs font-normal text-gray-500">/night</span>
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-500 mt-0.5">
                                    {option.policyCopy}
                                  </p>
                                </div>
                              </label>
                            ))}
                            <div className="px-3 py-3 bg-white">
                              <button
                                className="w-full bg-[#023E8A] text-white py-2 rounded-lg hover:bg-[#023E9E] transition-colors cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
                                disabled={!selectedOptionId}
                                onClick={() => handleBookRoom(roomId)}
                              >
                                Book this room
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center text-gray-600 py-10">
                No rooms available for this hotel.
              </div>
            )}
          </div>
          </div>
          )}
        </section>
        <section id="Reviews" className="mt-10">
          <hr className="text-gray-300" />
          <Reviews
            reviews={reviews}
            closeModal={() => setOpenModal(false)}
            openModal={() => setOpenModal(true)}
          />
        </section>
        <section id="Refund and cancellations" className="mt-10">
          <hr className="text-gray-300 mb-8" />
          <RefundCancellation
            policyCopy={stayPricing?.cancellationOptions?.[0]?.policyCopy}
            refundPercent={stayPricing?.cancellationOptions?.[0]?.refundPercent}
            deadlineLabel={
              stayPricing?.cancellationOptions?.[0]?.cancelDeadlineHoursBeforeCheckIn
                ? `${stayPricing.cancellationOptions[0].cancelDeadlineHoursBeforeCheckIn} hours before check-in`
                : stayPricing?.cancellationOptions?.[0]?.deadlineType === "service_date"
                  ? "the service date"
                  : undefined
            }
          />
        </section>
      </div>

      <div className="bg-gray-100 py-10">
        <TravelmateApp />
      </div>
      <Footer />
    </div>
  );
};

export default StaysDetail;
