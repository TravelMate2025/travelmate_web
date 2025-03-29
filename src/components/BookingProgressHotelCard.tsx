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
      <div className="border border-gray-300 rounded-lg p-4 flex flex-col md:flex-row items-center w-full">
        {/* Hotel Image */}
        <img src={imageUrl} alt="Hotel" className="w-full md:w-[288px] h-[180px] md:h-[157px] rounded-lg object-cover" />
  
        {/* Hotel Details */}
        <div className="mt-4 md:mt-0 md:ml-6 space-y-3 text-left">
          <h3 className="text-lg md:text-xl font-semibold">{roomDetails}</h3>
  
          <div className="flex items-center my-3">
            <RiHotelBedLine className="mr-2" />
            <span className="text-gray-700">{name}</span>
          </div>
  
          {/* Refund Policy */}
          <div className="flex items-center text-green-600">
            <FaCheckCircle className="mr-2" />
            <span className="text-sm">Fully Refundable before {refundableUntil}</span>
          </div>
  
          <div className="flex items-center text-gray-600">
            <FaMapMarkerAlt className="text-blue-600 mr-2" />
            <span>{location}</span>
          </div>
        </div>
      </div>
    );
  };
  
  
export default HotelCard;
