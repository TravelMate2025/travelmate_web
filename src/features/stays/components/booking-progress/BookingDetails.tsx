import React from "react";
import { formatDate } from "../../../car_rentals/utilities/formatting";
interface BookingDetailsProps {
  roomType?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: string;
  bedType?:string
}

const BookingDetails: React.FC<BookingDetailsProps> = ({
  roomType,
  checkIn,
  checkOut,
  guests,

}) => {
  const formatDateString = (dateStr?: string) => {
    if (!dateStr) return "---";
    try {
      const date = new Date(dateStr);
      return formatDate(date);
    } catch (error) {
      return "---";
    }
  };
  return (
    <div className="w-full space-y-4">
      {/* Title */}
      <h3 className="text-lg font-semibold ml-3">Booking Details</h3>

      {/* Body */}
      <div className="md:border border-gray-300 border-b mb-4 lg:rounded-lg lg:p-6 p-4 space-y-4">
        {/* Room Type */}
        <div className="flex justify-between">
          <p className="font-medium">Room Type:</p>
          <span className="text-gray-700 capitalize">{roomType?.toLocaleLowerCase() || "---"}</span>
        </div>

        {/* Check-in Date */}
        <div className="flex justify-between">
          <p className="font-medium">Check-in Date:</p>
          <span className="text-gray-700">
            {formatDateString(checkIn) || "---"}
          </span>
        </div>

        {/* Check-out Date */}
        <div className="flex justify-between">
          <p className="font-medium">Check-out Date:</p>
          <span className="text-gray-700">
            {formatDateString(checkOut) || "---"}
          </span>
        </div>

        {/* Guest */}
        <div className="flex justify-between">
          <p className="font-medium">Guest:</p>
          <span className="text-gray-700">{guests || "---"}</span>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
