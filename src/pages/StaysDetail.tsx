import { useEffect, useRef, useState } from "react";
import UpdateSearchFilter from "../components/UpdateSearchFilter";
import Breadcrumbs from "../components/Breadcrumbs";
import { FaImages,FaMapMarkerAlt, FaCheckCircle,FaHeart, FaShareAlt,
     FaStar, FaWifi, FaSwimmingPool, FaSnowflake, FaCar, 
     FaExpandArrowsAlt,
     FaBed} from "react-icons/fa";
import { FaArrowLeft } from 'react-icons/fa';

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
    
    

interface StaysDetailProps {
    hotel: {
      images: string[];
      shareLink: string;
    };
  }

const StaysDetail: React.FC<StaysDetailProps> = ({ hotel }) => {
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

    const isMobile = useMediaQuery({ maxWidth: 768 });

    // Sync the carousel with the current index when a navigation dot is clicked
    const handleSelectImage = (index: number) => {
        setCurrentIndex(index);
        if (carouselRef.current) {
            carouselRef.current.scrollTo({
                left: index * window.innerWidth,
                behavior: 'smooth',
            });
        }
    };

    // Handle manual scrolling
    const handleScroll = () => {
        if (carouselRef.current) {
            // Get the scroll position of the carousel
            const scrollLeft = carouselRef.current.scrollLeft;

            // Calculate the index of the currently visible image
            const newIndex = Math.floor(scrollLeft / window.innerWidth);
            if (newIndex !== currentIndex) {
                setCurrentIndex(newIndex); // Update the current index
            }
        }
    };

    // Listen for scroll events to update the current index
    useEffect(() => {
        const handleResize = () => {
            if (carouselRef.current) {
                // On resize, make sure scroll position and index are in sync
                const scrollLeft = carouselRef.current.scrollLeft;
                const newIndex = Math.floor(scrollLeft / window.innerWidth);
                setCurrentIndex(newIndex);
            }
        };

        // Attach scroll and resize event listeners
        const carousel = carouselRef.current;
        if (carousel) {
            carousel.addEventListener('scroll', handleScroll);
            window.addEventListener('resize', handleResize);
        }

        // Cleanup event listeners on component unmount
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
    
    const roomImages = [
        "src/assets/images/StayImage.png",
        "src/assets/images/StayImage2.png",
        "src/assets/images/StayImage.png",
        "src/assets/images/StayImage.png",
        "src/assets/images/StayImage2.png",
        "src/assets/images/StayImageCopy.png",
    ];


    const rooms = [
        { image: "src/assets/images/StayImage2.png", title: "King Size Room", size: 32, bedType: "King Size Bed", pricePerNight: "10,000", pricePerWeek: "70,000" },
        { image: "src/assets/images/StayImage2.png", title: "Deluxe Room", size: 28, bedType: "Queen Size Bed", pricePerNight: "12,000", pricePerWeek: "84,000" },
        { image: "src/assets/images/StayImage2.png", title: "Executive Suite", size: 40, bedType: "King Size Bed", pricePerNight: "15,000", pricePerWeek: "105,000" },
        { image: "src/assets/images/StayImage2.png", title: "Standard Room", size: 25, bedType: "Double Bed", pricePerNight: "8,000", pricePerWeek: "56,000" },
        { image: "src/assets/images/StayImage2.png", title: "Family Suite", size: 45, bedType: "2 Queen Beds", pricePerNight: "18,000", pricePerWeek: "126,000" },
        { image: "src/assets/images/StayImage2.png", title: "Penthouse Suite", size: 50, bedType: "King Size Bed", pricePerNight: "25,000", pricePerWeek: "175,000" },
    ];
      


      // Breadcrumb Navigation
    const breadcrumbs = [
        { name: "Home", link: "/" },
        { name: "Ikeja", link: "/locations/ikeja" },
        { name: "Search Results", link: "/stays-search-result" },
        { name: "Maison Farheinheit Hotel", },
    ];


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
                        src={roomImages[0]}
                        alt="Main Room"
                        className="w-full h-[445px] object-cover rounded-lg"
                    />
                    <button
                        className="absolute bottom-4 left-4 flex items-center gap-2 bg-white cursor-pointer px-4 py-2 rounded-lg shadow-md"
                        onClick={handleShowPhotosClick}
                    >
                        <FaImages className="text-gray-600" />
                        Show all {roomImages.length} photos
                    </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                    {roomImages.slice(1, 5).map((image, index) => (
                        <img
                        key={index}
                        src={image}
                        alt={`Room ${index + 2}`}
                        className="w-full h-[214px] object-cover rounded-lg"
                        />
                    ))}
                    </div>
                </div>

                

{/* Mobile Carousel (Hidden on Desktop) */}
<div className="md:hidden flex flex-col items-center relative">
    {/* Image Carousel with Buttons on Top */}
    <div className="relative w-full h-[80vw] max-h-[450px]">
        <div className="absolute top-4 left-0 right-0 z-10 px-4 flex justify-between items-center">
            <button className="bg-white p-2 rounded-md shadow">
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
        <div className="flex overflow-x-auto h-full" ref={carouselRef}>
            {roomImages.map((image, index) => (
                <img
                    key={index}
                    src={image}
                    alt={`Room ${index + 1}`}
                    className="w-full h-full object-cover flex-shrink-0"
                />
            ))}
        </div>

        {/* Photo Indicator - Displayed Below the Image */}
        <div className="absolute bottom-6 right-3 flex items-center border border-white gap-2 bg-opacity-75 px-3 py-1 rounded-md">
            <span className="text-white text-sm">
                {currentIndex + 1} out of {roomImages.length}
            </span>
        </div>
    </div>

    {/* Navigation Dots */}
    <div className="flex gap-2 mt-4">
        {roomImages.map((_, index) => (
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

{showPhotosModal && <AllPhotosModal onClose={() => setShowPhotosModal(false)} images={roomImages} />}
{showShareModal && <ShareModal onClose={() => setShowShareModal(false)} shareLink={hotel.shareLink} />}



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
                    <h1 className="text-2xl font-bold text-black">Maison Fahrenheit Hotel</h1>
                    <p className="text-gray-700 flex items-center gap-2 mt-2">
                    <FaMapMarkerAlt className="text-gray-500" />
                    80 Adetokunbo Ademola Street, Victoria Island, Lagos
                    </p>
                    <p className="text-green-600 flex items-center gap-2 mt-2">
                    <FaCheckCircle />
                    Fully Refundable before Feb 9
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                    <span className="text-yellow-500 flex items-center gap-1">
                        <FaStar /> 4.5
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
                    Luxury Hotel in Abuja's prestigious Maitama district. 24-hour service with modern amenities and panoramic city views.
                    <br />
                    <strong>Check-in:</strong> 3pm, <strong>Check-out:</strong> 12pm.
                    </p>
                </div>

            </section>
      
            <section id="Amenities" className="py-6 border-b border-gray-300">
                    <h2 className="text-xl font-semibold">Amenities (10)</h2>
                <div className="grid grid-cols-2 gap-4 mt-2">
                    <p className="flex items-center gap-2"><FaWifi className="text-blue-600" /> Wifi</p>
                    <p className="flex items-center gap-2"><FaSwimmingPool className="text-blue-600" /> Pool</p>
                    <p className="flex items-center gap-2"><FaSnowflake className="text-blue-600" /> Air Conditioning</p>
                    <p className="flex items-center gap-2"><FaCar className="text-blue-600" /> Free Parking</p>
                    <p className="flex items-center gap-2"><FaCheckCircle className="text-blue-600" /> 24-hour Room Service</p>
                    <p className="flex items-center gap-2"><FaCheckCircle className="text-blue-600" /> Fitness Center</p>
                    <p className="flex items-center gap-2"><FaCheckCircle className="text-blue-600" /> Restaurant</p>
                    <p className="flex items-center gap-2"><FaCheckCircle className="text-blue-600" /> Bar & Lounge</p>
                    <p className="flex items-center gap-2"><FaCheckCircle className="text-blue-600" /> Laundry Service</p>
                    <p className="flex items-center gap-2"><FaCheckCircle className="text-blue-600" /> Business Center</p>
                </div>
            </section>


            <section id="Select a room" className="mt-10">
                <h3 className="font-semibold mx-1 mt-2 mb-2 text-xl">Select a room</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rooms.map((room, index) => (
                    <div
                        key={index}
                        className="w-full sm:w-[411px] h-auto bg-white shadow-lg rounded-lg p-4"
                    >
                        {/* Room Image */}
                        <img
                        src={room.image}
                        alt={room.title}
                        className="w-full h-[234px] object-cover rounded-lg"
                        />

                        {/* Room Details */}
                        <h3 className="mt-3 text-lg font-bold">{room.title}</h3>

                        <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                        <FaExpandArrowsAlt />
                        <span>Room size: {room.size}m²</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
                        <FaBed />
                        <span>{room.bedType}</span>
                        </div>

                        <div className="flex items-center gap-2 text-green-600 text-sm mt-2">
                        <FaCheckCircle />
                        <span>Fully Refundable before Feb 9</span>
                        </div>

                        {/* Pricing */}
                        <div className="flex justify-between items-end mt-4">
                        <div>
                            <p className="text-xl font-bold">N{room.pricePerNight}</p>
                            <span className="text-gray-500 text-sm">per Night</span>
                        </div>
                        <div>
                            <p className="text-xl font-bold">N{room.pricePerWeek}</p>
                            <span className="text-gray-500 text-sm pl-7">7 Nights</span>
                        </div>
                        </div>

                        {/* Availability Notice */}
                        <p className="text-red-600 text-sm mt-2">2 left at this price</p>

                        {/* Select Button */}
                        <button className="mt-3 w-full bg-[#023E8A] text-white py-2 rounded-lg cursor-pointer hover:bg-[#023E9E]">
                        Select
                        </button>
                    </div>
                    ))}
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
                <Policies />
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




