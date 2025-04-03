import { useState } from "react";
import UpdateSearchFilter from "../components/UpdateSearchFilter";
import Breadcrumbs from "../components/Breadcrumbs";
import { FaShareAlt, FaHeart, FaImages,FaMapMarkerAlt, FaCheckCircle,
     FaStar, FaWifi, FaSwimmingPool, FaSnowflake, FaCar, 
     FaExpandArrowsAlt,
     FaBed} from "react-icons/fa";
import Navbar from "./homePage/Navbar";
import TravelmateApp from "./homePage/TravelmateApp";
import Footer from "../components/2Footer";
import Reviews from "../components/Reviews";
import ReviewsModal from "../components/modals/ReviewModal";
import AllPhotosModal from "../components/modals/AllPhotosModal";
import ShareModal from "../components/modals/ShareModal";
import Policies from "../components/booking-progress/Policies";
import RefundCancellation from "../components/booking-progress/RefundCancellation";


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

    const cancellationDate = new Date();
    cancellationDate.setDate(cancellationDate.getDate() + 1);
    const formattedDate = cancellationDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const formattedTime = "11:59 PM";


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
            {/* Navbar */}
            <Navbar />

            <div className="mt-18">
                <UpdateSearchFilter />
            </div>

            <div className="mt-4 px-6 border-b border-gray-300">
                <Breadcrumbs items={breadcrumbs} />
            </div>

            {/* Image Gallery Section */}
            <div className="mt-4 px-6 relative">
                {/* Share & Favorite Buttons */}
                <div className="flex justify-end gap-4 mb-1 px-10">
                <button className="flex items-center gap-2 px-4 py-2 cursor-pointer border rounded-lg shadow-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setShowShareModal(true)}
                >
                    <FaShareAlt /> Share
                </button>
                <button className="flex items-center gap-2 px-4 py-2 cursor-pointer border rounded-lg shadow-sm text-gray-700 hover:bg-gray-100">
                    <FaHeart /> Add to Favorite
                </button>
                </div>

                {/* Images Grid */}
                <div className="grid grid-cols-2 gap-4 mt-2 p-10">

                    <div className="relative">
                        <img
                        src={roomImages[0]}
                        alt="Main Room"
                        className="w-full h-[445px] object-cover rounded-lg"
                        />
                        {/* Show All Photos Button */}
                        <button className="absolute bottom-4 left-4 flex items-center gap-2 bg-white cursor-pointer px-4 py-2 rounded-lg shadow-md"
                        onClick={() => setShowPhotosModal(true)}
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
                {showPhotosModal && <AllPhotosModal onClose={() => setShowPhotosModal(false)} images={roomImages} />}
                {showShareModal && <ShareModal onClose={() => setShowShareModal(false)} shareLink={hotel.shareLink} />}
            </div>



        <div className="w-[93%] mx-auto px-4">
            {/* Navigation Tabs */}
            <div className="border-b border-gray-300">
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
                        <div key={index} className="w-[411px] h-[542px] bg-white shadow-lg rounded-lg p-4">
                        {/* Room Image */}
                        <img
                            src={room.image}
                            alt={room.title}
                            className="w-[379px] h-[234px] object-cover rounded-lg"
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




