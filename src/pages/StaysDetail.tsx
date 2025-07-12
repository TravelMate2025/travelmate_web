import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useParams
import { useSelector, useDispatch } from "react-redux"; // Import Redux hooks
import { RootState, AppDispatch } from "../store";
import { fetchHotelDetailsAsync, clearSelectedHotel } from "../features/stay/staysSlice"; // Import the new thunk and action
import UpdateSearchFilter from "../components/UpdateSearchFilter";
import Breadcrumbs from "../components/Breadcrumbs";
import { FaImages, FaMapMarkerAlt, FaCheckCircle, FaHeart, FaShareAlt,
     FaStar, FaWifi, FaSwimmingPool, FaSnowflake, FaCar,
     FaExpandArrowsAlt,
     FaBed} from "react-icons/fa";
import { FaArrowLeft } from 'react-icons/fa';
import AmenitiesModal from "../components/modals/AmenitiesModal";

// Assuming these are placeholder images, they will be replaced by API images
import StayImagePlaceholder from "../assets/images/StayImage.png";
import StayImage2Placeholder from "../assets/images/StayImage2.png";
import StayImageCopyPlaceholder from "../assets/images/StayImageCopy.png";


import Navbar from "./homePage/Navbar";
import TravelmateApp from "./homePage/TravelmateApp";
import Footer from "../components/2Footer";
import Reviews from "../components/Reviews";
import ReviewsModal from "../components/modals/ReviewModal";
import AllPhotosModal from "../components/modals/AllPhotosModal";
import ShareModal from "../components/modals/ShareModal";
import Policies from "../components/booking-progress/Policies";
import RefundCancellation from "../components/booking-progress/RefundCancellation";

import { useMediaQuery } from "react-responsive";
import PartialPolicies from "../components/booking-progress/PartialPolicies";


// Remove StaysDetailProps interface as data will come from Redux
// interface StaysDetailProps {
//     hotel: {
//       images: string[];
//       shareLink: string;
//     };
//   }

// No longer needs props, fetches data from Redux
const StaysDetail: React.FC = () => {
    const { hotelId } = useParams<{ hotelId: string }>(); // Get hotelId from URL
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    // Get hotel details and loading/error states from Redux store
    const { selectedHotel, detailsLoading, detailsError, searchParams } = useSelector((state: RootState) => state.stays);
    const { accessToken } = useSelector((state: RootState) => state.auth);


    const [activeTab, setActiveTab] = useState("Overview");
    const [openModal, setOpenModal] = useState(false);
    const [showPhotosModal, setShowPhotosModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const carouselRef = useRef<HTMLDivElement>(null);

    const cancellationDate = new Date();
    cancellationDate.setDate(cancellationDate.getDate() + 1);
    const formattedDate = cancellationDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const formattedTime = "11:59 PM";
    const [isOpen, setIsOpen] = useState(false);


    const isLargeScreen = useMediaQuery({ minWidth: 1024 });
    const visibleCount = isLargeScreen ? 10 : 4;
    const isMobile = useMediaQuery({ maxWidth: 768 });

    // Effect to fetch hotel details when component mounts or hotelId/accessToken changes
    useEffect(() => {
        if (hotelId && accessToken && searchParams) {
            dispatch(clearSelectedHotel()); // Clear previous details
            dispatch(fetchHotelDetailsAsync({
                hotelId,
                checkIn: searchParams.checkIn,
                checkOut: searchParams.checkOut,
                adults: searchParams.adults,
                children: searchParams.children,
                rooms: searchParams.rooms,
                token: accessToken
            }));
            console.log("Search parameters:", searchParams)
        } else if (!hotelId) {
            console.error("Hotel ID is missing in URL parameters.");
            navigate('/stays-search-result');
        } else if (!accessToken) {
            console.error("Authentication token missing. Please login again.");
            // Optionally redirect to login or show a message
        } else if (!searchParams) {
            console.error("Search parameters missing. Cannot fetch hotel details without them.");
            navigate('/stays-search-result'); // Redirect if search params are missing
        }
    }, [hotelId, accessToken, searchParams, dispatch, navigate]);



    // Sync the carousel with the current index when a navigation dot is clicked
    const handleSelectImage = (index: number) => {
        setCurrentIndex(index);
        if (carouselRef.current) {
            carouselRef.current.scrollTo({
                left: index * carouselRef.current.offsetWidth, // Use offsetWidth for correct scroll
                behavior: 'smooth',
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
                const newIndex = Math.floor(scrollLeft / carouselRef.current.offsetWidth);
                setCurrentIndex(newIndex);
                // Also adjust scroll position immediately on resize to prevent visual glitches
                carouselRef.current.scrollTo({
                    left: newIndex * carouselRef.current.offsetWidth,
                    behavior: 'instant',
                });
            }
        };

        const carousel = carouselRef.current;
        if (carousel) {
            carousel.addEventListener('scroll', handleScroll);
            window.addEventListener('resize', handleResize);
        }

        return () => {
            if (carousel) {
                carousel.removeEventListener('scroll', handleScroll);
            }
            window.removeEventListener('resize', handleResize);
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

    // Use actual images from selectedHotel or placeholders
    const hotelImages = selectedHotel?.images?.map(img => img.url) || 
        [StayImagePlaceholder, StayImage2Placeholder, StayImageCopyPlaceholder]; // Fallback placeholders

    // Use actual rooms from selectedHotel or empty array
    const availableRooms = selectedHotel?.rooms || [];


    // Breadcrumb Navigation - dynamically set hotel name
    const breadcrumbs = [
        { name: "Home", link: "/" },
        { 
            name: selectedHotel?.destination?.name || "Location", 
            link: `/locations/${selectedHotel?.destination?.code || ''}` 
        },
        { name: "Search Results", link: "/stays-search-result" },
        { name: selectedHotel?.name || "Hotel Details" }, // Use hotel name if available
    ];

    // Dummy amenities for now, replace with actual hotel amenities if available in backend response
    const amenities = [
        { icon: <FaWifi className="text-blue-600" />, name: "Wifi" },
        { icon: <FaSwimmingPool className="text-blue-600" />, name: "Pool" },
        { icon: <FaSnowflake className="text-blue-600" />, name: "Air Conditioning" },
        { icon: <FaCar className="text-blue-600" />, name: "Free Parking" },
        { icon: <FaCheckCircle className="text-blue-600" />, name: "24-hour Room Service" },
        { icon: <FaCheckCircle className="text-blue-600" />, name: "Fitness Center" },
        { icon: <FaCheckCircle className="text-blue-600" />, name: "Restaurant" },
        { icon: <FaCheckCircle className="text-blue-600" />, name: "Bar & Lounge" },
        { icon: <FaCheckCircle className="text-blue-600" />, name: "Laundry Service" },
        { icon: <FaCheckCircle className="text-blue-600" />, name: "Business Center" },
      ];

  // Conditional Rendering for Loading/Error states
  if (detailsLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold">Loading hotel details...</p>
      </div>
    );
  }

  if (detailsError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold text-red-600">Error: {detailsError}</p>
      </div>
    );
  }

  if (!selectedHotel) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold">No hotel details found.</p>
      </div>
    );
  }

  return (
        <div>
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
                        alt={selectedHotel.name}
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
                        alt={`${selectedHotel.name} ${index + 2}`}
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
                            <button className="bg-white p-2 rounded-md shadow" onClick={() => navigate(-1)} >
                                {/* Back Button with React Icon */}
                                <FaArrowLeft className="w-5 h-5 text-gray-800" />
                            </button>

                            <div className="flex gap-2">
                                <button className="bg-white p-2 rounded-md shadow" onClick={() => setShowShareModal(true)}>
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
                        <div className="flex overflow-x-auto h-full snap-x snap-mandatory" ref={carouselRef}>
                            {hotelImages.map((image, index) => (
                                <img
                                    key={index}
                                    src={image || StayImagePlaceholder} // Use image or placeholder
                                    alt={`${selectedHotel.name} ${index + 1}`}
                                    className="w-full h-full object-cover flex-shrink-0 snap-center"
                                    onError={(e) => (e.currentTarget.src = StayImagePlaceholder)} // Fallback on error
                                />
                            ))}
                        </div>

                        {/* Photo Indicator - Displayed Below the Image */}
                        <div className="absolute bottom-6 right-3 flex items-center border border-white gap-2 bg-opacity-75 px-3 py-1 rounded-md">
                            <span className="text-white text-sm">
                                {currentIndex + 1} out of {hotelImages.length}
                            </span>
                        </div>
                    </div>

                    {/* Navigation Dots */}
                    <div className="flex gap-2 mt-4">
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

                {showPhotosModal && <AllPhotosModal onClose={() => setShowPhotosModal(false)} images={hotelImages} />}
                {showShareModal && selectedHotel && <ShareModal onClose={() => setShowShareModal(false)} shareLink={`/stays-detail/${selectedHotel.code}`} />}
            </div>


                <div className="w-[93%] mx-auto px-4">
                    {/* Navigation Tabs */}
                    <div className="border-b border-gray-300 hidden md:block">
                            <ul className="flex gap-6 text-gray-600 text-sm font-medium w-full justify-between px-6">
                        {sections.map((section) => (
                        <li
                            key={section.name}
                            className={`cursor-pointer pb-3 ${
                            activeTab === section.name ? "text-blue-600 border-b-2 border-blue-600" : ""
                            }`}
                            onClick={() => {
                            setActiveTab(section.name);
                            const sectionElement = document.getElementById(section.name);
                            if (sectionElement) {
                                window.scrollTo({
                                top: sectionElement.offsetTop - 70,
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


            <section id="Overview">
                {/* Overview Section */}
                <div id="Overview" className="py-6 border-b border-gray-300">
                    <h1 className="text-2xl font-bold text-black">{selectedHotel.name}</h1>
                    <p className="text-gray-700 flex items-center gap-2 mt-2">
                    <FaMapMarkerAlt className="text-gray-500" />
                    {selectedHotel.address}
                    </p>
                    {/* Refundability info is not directly in HotelDetail, you might need to infer from rooms */}
                    <p className="text-green-600 flex items-center gap-2 mt-2">
                    <FaCheckCircle />
                    Fully Refundable before {formattedDate}
                    </p>
                    {/* Rating and Reviews - Assuming these are static for now or fetched separately */}
                    <div className="flex items-center gap-2 mt-2">
                    <span className="text-yellow-500 flex items-center gap-1">
                        <FaStar />
                        {selectedHotel && parseInt(selectedHotel.category?.match(/\d+/)?.[0] || '0')}
                    </span>
                    <span className="text-gray-600">(180)</span>
                    <button className="text-blue-600 underline cursor-pointer"
                     onClick={() => setOpenModal(true)}>Show all 180 reviews</button>
                    </div>
                    {openModal && <ReviewsModal onClose={() => setOpenModal(false)} />}
                </div>

            </section>


            <section id="About">
                {/* About Section */}
                <div id="About" className="py-6 border-b border-gray-300">
                    <h2 className="text-xl font-semibold">About this Hotel</h2>
                    <p className="text-gray-700 mt-2">
                    {selectedHotel.description || "No description available."}
                    <br />
                    <strong>Check-in:</strong> 3pm, <strong>Check-out:</strong> 12pm.
                    </p>
                </div>

            </section>

            <section id="Amenities" className="py-6 border-b border-gray-300">
                <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Amenities ({amenities.length})</h2>
                    <button
                        className="text-blue-600 text-sm flex items-center md:hidden"
                        onClick={() => setIsOpen(true)}
                    >
                    Show all <span className="ml-1">{">"}</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-4 mt-2 md:grid-cols-3 lg:grid-cols-4">
                    {amenities.slice(0, visibleCount).map((item, index) => (
                        <p key={index} className="flex items-center gap-2">
                        {item.icon} {item.name}
                        </p>
                    ))}
                </div>
            </section>

            {/* Show the modal */}
            <AmenitiesModal isOpen={isOpen} onClose={() => setIsOpen(false)} />



            <section id="Select a room" className="mt-10">
                <h3 className="font-semibold mx-1 my-2 text-xl">Select a room</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {availableRooms.length > 0 ? (
                        availableRooms.map((room) => (
                        <div key={room.code} className="w-full sm:w-[411px] h-auto bg-white shadow-lg rounded-lg p-4">
                            {/* Room Image - use first room image or placeholder */}
                            <img
                            src={room.images?.[0]?.url || StayImage2Placeholder}
                            alt={room.name}
                            className="w-full h-[234px] object-cover rounded-lg"
                            onError={(e) => (e.currentTarget.src = StayImage2Placeholder)}
                            />

                            <h3 className="mt-3 text-lg font-bold">{room.name}</h3>

                            <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                            <FaExpandArrowsAlt />
                            <span>Room size: {room.size_sqm ? `${room.size_sqm}m²` : "N/A"}</span>
                            </div>

                            {room.bedType && (
                            <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
                                <FaBed />
                                <span>{room.bedType}</span>
                            </div>
                            )}

                            {/* Pricing - show first rate's price */}
                            {room.rates?.[0]?.price && (
                            <div className="flex justify-between items-end mt-4">
                                <div>
                                <p className="text-xl font-bold">
                                    {room.rates[0].price.currency} {room.rates[0].price.amount.toLocaleString()}
                                </p>
                                <span className="text-gray-500 text-sm">per Night</span>
                                </div>
                            </div>
                            )}

                            <button 
                            className="mt-3 w-full bg-[#023E8A] text-white py-2 rounded-lg hover:bg-[#023E9E]"
                            onClick={() => navigate("/booking-progress")}
                            >
                            Select
                            </button>
                        </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center text-gray-600 py-10">
                            No rooms available for this hotel.
                        </div>
                    )}
                </div>
            </section>


            <section id="Reviews" className="mt-10">
            <hr className="text-gray-300" />
                    <Reviews />
            </section>

            <section id="Refund and cancellations" className="mt-10">
            <hr className="text-gray-300 mb-8" />
             <RefundCancellation formattedTime={formattedTime} formattedDate={formattedDate} refundableUntil={formattedTime} />
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
