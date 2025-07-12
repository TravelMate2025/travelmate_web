import React, { useState } from "react";
import { FaStar, FaMapMarkerAlt, FaCheckCircle, FaRegHeart, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Hotel } from "../types/stays";

interface StayCardProps {
  hotel: Hotel;
  checkIn?: string;
  checkOut?: string;
  isFavorited?: boolean;
}

const StayCard: React.FC<StayCardProps> = ({
  hotel,
  checkIn,
  checkOut,
  isFavorited = false,
}) => {
  const navigate = useNavigate();
  const [favorite, setFavorite] = useState(isFavorited);
  const [showTooltip, setShowTooltip] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Extract all relevant data
  const firstRoom = hotel.rooms?.[0];
  const firstRate = firstRoom?.rates?.[0];
  const mainImage = hotel.images?.[0]?.url || '';
  const ratingMatch = hotel.category?.match(/\d+/);
  const rating = ratingMatch ? parseInt(ratingMatch[0]) : 0;
  const location = hotel.destination?.name || hotel.address || 'Unknown location';
  const reviewsCount = hotel.reviewsCount || 0;

  // Calculate number of nights
  const nights = checkIn && checkOut 
    ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
    : 1;

  // Handle cancellation policy
  const getRefundText = () => {
    if (!firstRate?.cancellationPolicies?.length) {
      return "Cancellation policy not available";
    }
    
    const policy = firstRate.cancellationPolicies[0];
    if (!policy.from) return "Non-refundable";
    
    const fromDate = new Date(policy.from);
    const now = new Date();
    const timeDiff = fromDate.getTime() - now.getTime();
    
    if (timeDiff <= 0) return "Cancellation not allowed";
    
    const hoursLeft = Math.ceil(timeDiff / (1000 * 60 * 60));
    return `Fully refundable for ${hoursLeft} more hour${hoursLeft === 1 ? '' : 's'}`;
  };

  // Format price with currency
  const formatPrice = (amount?: number) => {
    if (amount === undefined) return "N/A";
    return `N${amount.toLocaleString()}`;
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      // TODO: Implement favorites API integration
      // await toggleFavorite(hotel.code, favorite);
      const newFavorite = !favorite;
      setFavorite(newFavorite);
      toast.success(`Stay ${newFavorite ? "added to" : "removed from"} favorites`);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div
      className="w-full sm:w-[380px] md:w-[410px] bg-white rounded-lg border border-gray-300 shadow-lg p-4 cursor-pointer relative hover:shadow-xl transition-shadow duration-200"
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (!target.closest("button")) {
          navigate(`/stays-detail/${hotel.code}`, {
            state: { checkIn, checkOut }
          });
        }
      }}
    >
      {/* Favorite button tooltip */}
      {showTooltip && (
        <div className="absolute top-6 right-20 bg-white text-black text-sm px-3 py-2 rounded shadow-md z-10">
          <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-white"></div>
          {favorite ? "Remove from favorites" : "Add to favorites"}
        </div>
      )}

      {/* Image Section */}
      <div className="relative">
        <div className="w-full h-[200px] sm:h-[210px] md:h-[224px] rounded-lg bg-gray-200 flex items-center justify-center relative overflow-hidden">
          {mainImage && !imageError ? (
            <img
              src={mainImage}
              alt={hotel.name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <span className="text-gray-600 text-sm font-medium">No Image Available</span>
          )}
        </div>

        {/* Show available status if provided */}
        {hotel.available !== undefined && (
          <span className={`absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-medium ${
            hotel.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {hotel.available ? 'Available' : 'Unavailable'}
          </span>
        )}

        <button
          onClick={handleFavoriteClick}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="absolute top-3 right-3 bg-white rounded-md p-2 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
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
          <h3 className="text-lg font-semibold line-clamp-1 hover:text-blue-600 transition-colors duration-200">
            {hotel.name}
          </h3>
          <div className="flex items-center text-orange-500">
            <FaStar className="mr-1" />
            <span className="font-medium text-black">
              {rating || 'N/A'} {reviewsCount ? `(${reviewsCount})` : ''}
            </span>
          </div>
        </div>

        <div className="flex items-center text-gray-500 mt-1">
          <FaMapMarkerAlt className="mr-2" />
          <span className="text-sm line-clamp-1">{location}</span>
        </div>

        {/* Show category if available */}
        {hotel.category && (
          <div className="text-sm text-gray-500 mt-1">
            {hotel.category.replace(/\d+/g, '').trim()}
          </div>
        )}

        <div className="flex items-center text-green-600 mt-1">
          <FaCheckCircle className="mr-2" />
          <span className="text-sm">
            {getRefundText()}
          </span>
        </div>

        {/* Show first 3 amenities if available */}
        {hotel.amenities?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {hotel.amenities.slice(0, 3).map((amenity, index) => (
              <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                {amenity}
              </span>
            ))}
            {hotel.amenities.length > 3 && (
              <span className="text-xs text-gray-500">+{hotel.amenities.length - 3} more</span>
            )}
          </div>
        )}

        <div className="flex w-full justify-between items-end mt-4">
          <div>
            <span className="text-xl font-bold">
              {formatPrice(firstRate?.price?.amount)}
            </span>
            <p className="text-gray-500 text-sm">Per Night</p>
          </div>
          <div className="ml-auto text-right">
            <span className="text-lg font-bold">
              {formatPrice(firstRate?.price?.amount ? firstRate.price.amount * nights : undefined)}
            </span>
            <p className="text-gray-500 text-sm">
              {nights > 1 ? `Total for ${Math.round(nights)} nights` : 'Total (Includes Taxes & Fees)'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StayCard;