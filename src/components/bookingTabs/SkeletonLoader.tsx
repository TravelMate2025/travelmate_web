import React from "react";

const BookingsSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="flex justify-between lg:max-w-3xl w-full items-start gap-2 p-4 rounded-xl mb-4 animate-pulse"
        >
          {/* Image Skeleton */}
          <div className="flex justify-normal items-start gap-2 flex-1">
            <div className="h-20 w-20 bg-gray-200 rounded-xl flex-shrink-0"></div>
            
            {/* Text Content Skeleton */}
            <div className="flex-1 space-y-3">
              {/* Hotel Name */}
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              
              {/* Date Range */}
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              
              {/* Price */}
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>

          {/* Cancel Button Skeleton */}
          <div className="flex justify-end items-center gap-1">
            <div className="h-4 w-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-12"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookingsSkeleton;