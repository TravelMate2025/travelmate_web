import React from "react";
import { FaStar, FaMapMarkerAlt, FaCheckCircle, FaRegHeart } from "react-icons/fa";

interface StayCardProps {
  image: string;
  name: string;
  rating: number;
  reviews: number;
  location: string;
  pricePerNight: string;
  totalPrice: string;
  refundableUntil: string;
}

const StayCard: React.FC<StayCardProps> = ({
  image,
  name,
  rating,
  reviews,
  location,
  pricePerNight,
  totalPrice,
  refundableUntil,
}) => {
  return (
    <div className="w-[410px] h-[431px] bg-white rounded-lg border border-gray-300 shadow-lg p-4">
      {/* Image Section */}
      <div className="relative">
        <img
          src={image}
          alt={name}
          className="w-[378px] h-[224px] rounded-lg object-cover"
        />
        {/* Heart Icon Container */}
        <div className="absolute top-3 right-3 bg-white border-2 border-blue-900 rounded-md p-2 cursor-pointer">
          <FaRegHeart className="text-blue-900 text-2xl" />
        </div>
      </div>


      {/* Details Section */}
      <div className="mt-4">
        {/* Name & Rating */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{name}</h3>
          <div className="flex items-center text-orange-500">
            <FaStar className="mr-1" />
            <span className="font-medium text-black">{rating} ({reviews})</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center text-gray-500 mt-1">
          <FaMapMarkerAlt className="mr-2" />
          <span className="text-sm">{location}</span>
        </div>

        {/* Refund Policy */}
        <div className="flex items-center text-green-600 mt-1">
          <FaCheckCircle className="mr-2" />
          <span className="text-sm">Fully Refundable before {refundableUntil}</span>
        </div>

        {/* Pricing */}
        <div className="flex w-full justify-between items-end mt-4">
          <div>
            <span className="text-xl font-bold">N{pricePerNight}</span>
            <p className="text-gray-500 text-sm">Per Night</p>
          </div>
          <div className="ml-auto text-right">
            <span className="text-lg font-bold">N{totalPrice}</span>
            <p className="text-gray-500 text-sm">Total (Includes Taxes & Fees)</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StayCard;
