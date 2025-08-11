import React from "react";

const RoomDetails: React.FC = () => {
  return (
    <div className="bg-white">
      <h2 className="text-lg font-semibold mb-2 sm:mb-4">Room Details</h2>
      <div className="sm:p-6 rounded-lg sm:border border-gray-300">
        <p>Standard King Room</p>
        <p>King Size Bed</p>
      </div>
      
    </div>
  );
};

export default RoomDetails;
