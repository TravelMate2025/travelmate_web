import React, { useState } from "react";
import {
  FaStar,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaRegHeart,
  FaHeart,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
// import { toggleFavorite } from "../api/favorites"; // Keep this commented out until you provide the API logic
import toast from "react-hot-toast";

interface StayCardProps {
  id: string; // Changed from number to string to match hotel code
  image: string;
  name: string;
  rating: number;
  reviews: number;
  location: string;
  pricePerNight: string;
  totalPrice: string;
  refundableUntil: string;
  isFavorited?: boolean;
}

const StayCard: React.FC<StayCardProps> = ({
  id,
  image,
  name,
  rating,
  reviews,
  location,
  pricePerNight,
  totalPrice,
  refundableUntil,
  isFavorited = false,
}) => {
  const navigate = useNavigate();
  const [favorite, setFavorite] = useState(isFavorited);
  const [showTooltip, setShowTooltip] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      // You will need to uncomment and implement this once you have a favorites API endpoint.
      // await toggleFavorite(id, favorite);
      const newFavorite = !favorite;
      setFavorite(newFavorite);
      toast.success(`Stay ${newFavorite ? "added to" : "removed from"} favorite`);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div
      className="w-full sm:w-[380px] md:w-[410px] bg-white rounded-lg border border-gray-300 shadow-lg p-4 cursor-pointer relative"
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (!target.closest("button")) {
          navigate(`/stays-detail`);
        }
      }}
    >
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute top-6 right-20 bg-white text-black text-sm px-3 py-2 rounded shadow-md z-10">
          <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-white"></div>
          {favorite ? "Remove from favorite" : "Add to favorite"}
        </div>
      )}

      {/* Image Section */}
      <div className="relative">
        <div className="w-full h-[200px] sm:h-[210px] md:h-[224px] rounded-lg bg-gray-200 flex items-center justify-center relative overflow-hidden">
          {image && !imageError ? (
            <img
              src={image}
              alt={name}
                onError={() => setImageError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-600 text-sm font-medium">No Image Available</span>
          )}
        </div>

        <button
          onClick={handleFavoriteClick}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="absolute top-3 right-3 bg-white rounded-md p-2 cursor-pointer"
        >
          {favorite ? (
            <FaHeart className="text-red-600 text-2xl" />
          ) : (
            <FaRegHeart className="text-blue-900 text-2xl" />
          )}
        </button>
      </div>

      {/* Details Section */}
      <div className="mt-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{name}</h3>
          <div className="flex items-center text-orange-500">
            <FaStar className="mr-1" />
            <span className="font-medium text-black">
              {rating} ({reviews})
            </span>
          </div>
        </div>

        <div className="flex items-center text-gray-500 mt-1">
          <FaMapMarkerAlt className="mr-2" />
          <span className="text-sm">{location}</span>
        </div>

        <div className="flex items-center text-green-600 mt-1">
          <FaCheckCircle className="mr-2" />
          <span className="text-sm">
            {refundableUntil.startsWith("for")
              ? `Fully Refundable ${refundableUntil}`
              : refundableUntil}
          </span>

        </div>

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