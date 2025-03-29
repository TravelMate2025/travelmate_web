import React from "react";

const RoomDetails: React.FC = () => {
  return (
    <div className="bg-white">
      <h2 className="text-lg font-semibold mb-4">Room Details</h2>
      <div className="p-6 rounded-lg border border-gray-300">
        <p>Room Type: Standard King Room</p>
        <p>Bed Type: King Size</p>
        <p>Max Guests: 2 Adults</p>
      </div>
      
    </div>
  );
};

export default RoomDetails;
