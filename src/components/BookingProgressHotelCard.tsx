import React from "react";
import { FaCheckCircle, FaMapMarkerAlt } from "react-icons/fa";
import { RiHotelBedLine } from "react-icons/ri";

interface HotelCardProps {
  imageUrl: string;
  name: string;
  location: string;
  roomDetails: string;
  refundableUntil: string;
}

const HotelCard: React.FC<HotelCardProps> = ({ imageUrl, name, location, roomDetails, refundableUntil }) => {
  return (
    <div className="md:border border-gray-300 rounded-lg p-4 flex items-start w-full space-x-4">
      {/* Hotel Image */}
      <img 
        src={imageUrl} 
        alt="Hotel" 
        className="w-[40%] max-w-[288px] h-[140px] md:h-[150px] rounded-lg object-cover" 
      />

      {/* Hotel Details */}
      <div className="flex-1 space-y-3 text-left">
        <h3 className="text-sm md:text-xl font-semibold">{roomDetails}</h3>

        <div className="flex items-center">
          <RiHotelBedLine className="mr-2" />
          <span className="text-gray-700 text-xs md:text-lg">{name}</span>
        </div>

        {/* Refund Policy */}
        <div className="flex items-center text-green-600">
          <FaCheckCircle className="mr-2" />
          <span className="text-xs md:text-lg">Fully Refundable before {refundableUntil}</span>
        </div>

        <div className="flex items-center text-gray-600">
          <FaMapMarkerAlt className="text-blue-600 mr-2 " />
          <span className="text-xs md:text-lg">{location}</span>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
