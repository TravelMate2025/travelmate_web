import React from "react";
import Footer from "../../../components/2Footer";
import Navbar from "../../../pages/homePage/Navbar";

const StaysDetailSkeleton: React.FC = () => {
  return (
    <div>
      <Navbar/>
      <div className="animate-pulse lg:mt-24 mt-12">
        {/* Main Image Grid Skeleton */}
        <div className="hidden md:grid grid-cols-2 gap-4 mt-2 p-10">
          <div className="bg-gray-200 h-[445px] rounded-lg"></div>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="bg-gray-200 h-[214px] rounded-lg"
              ></div>
            ))}
          </div>
        </div>

        {/* Mobile Image Skeleton */}
        <div className="md:hidden">
          <div className="bg-gray-200 w-full h-[80vw] max-h-[450px]"></div>
        </div>

        {/* Content Skeleton */}
        <div className="w-[93%] mx-auto px-4 mt-6">
          {/* Title and Location */}
          <div className="space-y-4 border-b border-gray-300 pb-6">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>

          {/* About Section */}
          <div className="py-6 border-b border-gray-300 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>

          {/* Amenities Section */}
          <div className="py-6 border-b border-gray-300">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className="h-4 bg-gray-200 rounded w-3/4"
                ></div>
              ))}
            </div>
          </div>

          {/* Rooms Section */}
          <div className="mt-10">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white shadow-lg rounded-lg p-4 border border-gray-200"
                >
                  <div className="bg-gray-200 h-[234px] rounded-lg"></div>
                  <div className="space-y-3 mt-4">
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-10 bg-gray-200 rounded w-full mt-4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StaysDetailSkeleton;
