import React from "react";

const BookingDetails: React.FC = () => {
  return (
    <div className="w-full md:w-[628px] space-y-4">
      {/* Title */}
      <h3 className="text-lg font-semibold">Booking Details</h3>

      {/* Body */}
      <div className="md:border border-gray-300 rounded-lg p-6 space-y-4">
        {/* Room Type */}
        <div className="flex justify-between">
          <p className="font-medium">Room Type:</p>
          <span className="text-gray-700">Standard King Room</span>
        </div>

        {/* Check-in Date */}
        <div className="flex justify-between">
          <p className="font-medium">Check-in Date:</p>
          <span className="text-gray-700">April 10, 2025</span>
        </div>

        {/* Check-out Date */}
        <div className="flex justify-between">
          <p className="font-medium">Check-out Date:</p>
          <span className="text-gray-700">April 17, 2025</span>
        </div>

        {/* Guest */}
        <div className="flex justify-between">
          <p className="font-medium">Guest:</p>
          <span className="text-gray-700">2 Adults</span>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
