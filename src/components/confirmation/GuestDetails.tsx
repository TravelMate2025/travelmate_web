import React from "react";

const GuestDetails: React.FC = () => {
  return (
    <div className="bg-white">
      <h2 className="text-lg font-semibold mb-4">Guest Details</h2>
      <div className="p-6 rounded-lg border border-gray-300">
        <p className="font-medium">Name: Elvis Presley</p>
        <p>Email: elvis@gmail.com</p>
        <p>Phone: +234 800 123 4567</p>
      </div>
    </div>
  );
};

export default GuestDetails;
