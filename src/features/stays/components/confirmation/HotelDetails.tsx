import React from "react";

const HotelDetails: React.FC = () => {
  return (
    <div className="bg-white">
      <h2 className="text-lg font-semibold mb-2 sm:mb-4">Hotel Details</h2>
      <div className="rounded-lg sm:border border-gray-300 sm:p-6">
        <p>Maison Farhenheit Hotel</p>
        <p>80 Ademola Adetokumbo Street, Victorial Island, Lagos</p>
        {/* <p>Check-in: 12:00 PM | Check-out: 11:00 AM</p> */}
      </div>
      
    </div>
  );
};

export default HotelDetails;
