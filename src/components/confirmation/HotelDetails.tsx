import React from "react";

const HotelDetails: React.FC = () => {
  return (
    <div className="bg-white">
      <h2 className="text-lg font-semibold mb-4">Hotel Details</h2>
      <div className="rounded-lg border border-gray-300 p-6">
        <p>Hotel Name: The Grand Resort</p>
        <p>Address: 123 Luxury Street, Lagos, Nigeria</p>
        <p>Check-in: 12:00 PM | Check-out: 11:00 AM</p>
      </div>
      
    </div>
  );
};

export default HotelDetails;
