import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useParams
import { useSelector } from "react-redux"; // Import Redux hooks
import { RootState } from "../../../store";
// import { fetchHotelDetailsAsync, clearSelectedHotel } from "../slice"; // Import the new thunk and action
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
import Policies from "../components/booking-progress/Policies";
import RefundCancellation from "../components/booking-progress/RefundCancellation";

import { useMediaQuery } from "react-responsive";
import PartialPolicies from "../components/booking-progress/PartialPolicies";
import StaysDetailSkeleton from "./StaysDetailsSkeleton";
import { getReviews } from "../api";
import SelectOptions from "../components/modals/SelectOptions";
import { Rate } from "../types";

const StaysDetail: React.FC = () => {
  const { hotelId } = useParams<{ hotelId: string }>(); // Get hotelId from URL
  const navigate = useNavigate();
  // Get hotel details and loading/error states from Redux store
  const { detailsLoading, detailsError, searchParams, hotels } = useSelector(
    (state: RootState) => state.stays
  );
  const selectedHotel = hotels.find((hotel) => hotel.code === hotelId);
  const [activeTab, setActiveTab] = useState("Overview");
  const [openModal, setOpenModal] = useState(false);
  const [showPhotosModal, setShowPhotosModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const carouselRef = useRef<HTMLDivElement>(null);

  const cancellationDate = new Date();
  cancellationDate.setDate(cancellationDate.getDate() + 1);
  const formattedDate = cancellationDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const formattedTime = "11:59 PM";
  const [isOpen, setIsOpen] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [selectedRate, setSelectedRate] = useState<Rate | null>(null);

  const visibleCount = 8;
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const [reviews, setReviews] = useState<any[]>([]);
  // Effect to fetch hotel details when component mounts or hotelId/accessToken changes

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
  const handleScroll = () => {
    if (carouselRef.current) {
      const scrollLeft = carouselRef.current.scrollLeft;
      const newIndex = Math.floor(scrollLeft / carouselRef.current.offsetWidth); // Use offsetWidth
      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
      }
    }
  };

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
  }, [currentIndex]);

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
    if (!policy?.from) return "Non-refundable";

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
        setReviews(response);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, [hotelId]);

  // Use actual images from selectedHotel or placeholders
  const hotelImages = selectedHotel?.images?.map((img) => img.url) || [
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
      link: `/locations/${selectedHotel?.destination?.code || ""}`,
    },
    { name: "Search Results", link: "/stays-search-result" },
    { name: selectedHotel?.name || "Hotel Details" },
  ];

  const amenities =
    selectedHotel?.amenities?.map((amenity) => ({
      icon: <FaCheckCircle className="text-blue-600" />,
      name: amenity,
    })) || [];

  const handleRateSelection = (rate: Rate) => {
    setSelectedRate(rate);
    navigate("/booking-progress", {
      state: {
        selectedRate: rate,
        selectedRoom: availableRooms.find(
          (room) => room.code === selectedRoomId
        ),
        hotel: selectedHotel,
        checkIn: searchParams?.checkIn,
        checkOut: searchParams?.checkOut,
        guestsAdults: searchParams?.adults,
        guestsChild: searchParams?.children
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
      {showOptions && selectedRoomId && (
        <SelectOptions
          closeDialog={() => {
            setShowOptions(false);
            setSelectedRoomId(null);
          }}
          rooms={availableRooms}
          roomId={selectedRoomId}
          onRateSelect={handleRateSelection}
        />
      )}
      {/* Navbar - Hidden on mobile */}
      {!isMobile && <Navbar />}

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
            shareLink={`/stays-detail/${selectedHotel?.code}`}
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
            {/* Refundability info is not directly in HotelDetail, you might need to infer from rooms */}
            <p className="text-green-600 flex items-center gap-2 mt-2">
              <FaCheckCircle />
              {getCancellationPolicy()}
            </p>
            {/* Rating and Reviews - Assuming these are static for now or fetched separately */}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-yellow-500 flex items-center gap-1">
                <FaStar />
                {selectedHotel &&
                  reviews.length > 0 &&
                  parseInt(selectedHotel?.category?.match(/\d+/)?.[0] || "0")}
              </span>
              <span className="text-gray-600">({reviews?.length || "0"})</span>
              {reviews.length > 0 && (
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
              <strong>Check-in:</strong> 3pm, <strong>Check-out:</strong> 12pm.
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
              amenities.map((item: any, index: any) => (
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
          <h3 className="font-semibold mx-1 my-2 text-xl">Select a room</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableRooms.length > 0 ? (
              availableRooms.map((room) => {
                // Get the first rate for pricing info
                const firstRate = room.rates?.[0];
                const nights = 7;
                // Calculate total price based on nights
                const totalPrice = firstRate?.net
                  ? parseFloat(firstRate.net) * nights
                  : null;

                return (
                  <div
                    key={room.code}
                    className="w-full h-auto bg-white shadow-lg rounded-lg p-4 border border-gray-200"
                  >
                    {/* Room Image - with better fallbacks */}
                    <div className="relative h-[234px] bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={
                          room.images?.[0]?.url ||
                          selectedHotel?.images?.[0]?.url ||
                          StayImage2Placeholder
                        }
                        alt={room.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = StayImage2Placeholder;
                          e.currentTarget.onerror = null;
                        }}
                      />
                      {room.max_occupancy && (
                        <span className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-sm">
                          Max {room.max_occupancy} guests
                        </span>
                      )}
                    </div>

                    {/* Room Details */}
                    <div className="mt-4">
                      <h3 className="text-lg font-bold">
                        {room.description || "Standard Room"}
                      </h3>

                      {/* Amenities List */}
                      <div className="mt-3 space-y-2">
                        {room && (
                          <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <FaExpandArrowsAlt />
                            <span>{room.size_sqm || "25"}m²</span>
                          </div>
                        )}

                        {room && (
                          <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <FaBed />
                            <span>{room.bedType || room.name}</span>
                          </div>
                        )}

                        {room.amenities?.length > 0 && (
                          <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <FaCheckCircle />
                            <span>{room.amenities.slice(0, 2).join(", ")}</span>
                            {room.amenities.length > 2 && (
                              <span className="text-xs text-gray-400">
                                +{room.amenities.length - 2} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Pricing */}
                      <div className="mt-4 flex justify-between items-end">
                        <div>
                          {firstRate?.net && (
                            <>
                              <p className="text-xl font-bold">
                                €
                                {parseFloat(firstRate.net).toLocaleString()}
                              </p>
                              <span className="text-gray-500 text-sm">
                                per night
                              </span>
                            </>
                          )}
                        </div>

                        {totalPrice && (
                          <div className="text-right">
                            <p className="text-lg font-bold">
                             €{totalPrice.toLocaleString()}
                            </p>
                            <span className="text-gray-500 text-sm">
                              {nights > 1 ? `for ${nights} nights` : "total"}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Select Button */}
                      <button
                        className="mt-4 w-full bg-[#023E8A] text-white py-2 rounded-lg hover:bg-[#023E9E] transition-colors cursor-pointer"
                        onClick={() => {
                          setShowOptions(true);
                          setSelectedRoomId(room.code);
                        }}
                      >
                        Select
                      </button>
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
            formattedTime={formattedTime}
            formattedDate={formattedDate}
            refundableUntil={formattedTime}
          />
        </section>
        <section id="Policies" className="mt-10 mb-10">
          <hr className="text-gray-300 mb-8" />

          {!isMobile ? <Policies /> : <PartialPolicies />}
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
