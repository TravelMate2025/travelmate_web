// import React { useState } from "react";
import UpdateSearchFilter from "../components/UpdateSearchFilter";
import Breadcrumbs from "../components/Breadcrumbs";
import { FaShareAlt, FaHeart, FaImages } from "react-icons/fa";
import Navbar from "./homePage/Navbar";



const StaysDetail: React.FC = () => {

  const roomImages = [
    "src/assets/images/StayImage.png",
    "src/assets/images/StayImage.png",
    "src/assets/images/StayImage.png",
    "src/assets/images/StayImage.png",
    "src/assets/images/StayImage.png",
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
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg shadow-sm text-gray-700 hover:bg-gray-100">
            <FaShareAlt /> Share
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg shadow-sm text-gray-700 hover:bg-gray-100">
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
                <button className="absolute bottom-4 left-4 flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md">
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



      </div>
    </div>
  );
};

export default StaysDetail;
