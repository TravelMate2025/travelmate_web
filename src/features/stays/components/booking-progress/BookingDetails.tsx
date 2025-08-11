import React from "react";

interface BookingDetailsProps {
  roomType?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: string;
}

const BookingDetails: React.FC<BookingDetailsProps> = ({ 
  roomType = 'Standard King Room', 
  checkIn = 'April 10, 2025', 
  checkOut = 'April 17, 2025', 
  guests = '2 Adults' 
}) => {
  return (
    <div className="w-full md:w-[628px] space-y-4">
      {/* Title */}
      <h3 className="text-lg font-semibold ml-5">Booking Details</h3>

      {/* Body */}
      <div className="md:border border-gray-300 rounded-lg p-6 space-y-4">
        {/* Room Type */}
        <div className="flex justify-between">
          <p className="font-medium">Room Type:</p>
          <span className="text-gray-700">{roomType}</span>
        </div>

        {/* Check-in Date */}
        <div className="flex justify-between">
          <p className="font-medium">Check-in Date:</p>
          <span className="text-gray-700">{checkIn}</span>
        </div>

        {/* Check-out Date */}
        <div className="flex justify-between">
          <p className="font-medium">Check-out Date:</p>
          <span className="text-gray-700">{checkOut}</span>
        </div>

        {/* Guest */}
        <div className="flex justify-between">
          <p className="font-medium">Guest:</p>
          <span className="text-gray-700">{guests}</span>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
