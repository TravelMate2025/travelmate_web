import React from "react";

const Policies: React.FC = () => {
  return (
    <div className="w-full space-y-4">
      {/* Title */}
      <h3 className="text-lg font-semibold">Policies</h3>

      {/* Body */}
      <div className="border border-gray-300 rounded-lg p-6 space-y-6">
        {/* Check-in Policy */}
        <div className="flex flex-row items-start justify-between md:flex-col">
          <p className="font-medium">Check-in Policy:</p>
          <p className="text-gray-700">Guests must check in after 3:00 PM with a valid ID.</p>
          <p className="text-gray-700">Guests must check in after 3:00 PM with a valid ID.</p>
          <p className="text-gray-700">Guests must check in after 3:00 PM with a valid ID.</p>
        </div>

        <hr className="border-gray-300" />

        <div className="flex flex-row items-start justify-between md:flex-col">
          <p className="font-medium">Reservation Policy:</p>
          <p className="text-gray-700">All bookings are non refundable.</p>
        </div>

        <hr className="border-gray-300" />

        {/* Pet Policy */}
        <div className="flex flex-row items-start justify-between md:flex-col">
          <p className="font-medium">Pet Policy:</p>
          <p className="text-gray-700">Pets are not allowed inside hotel rooms.</p>
        </div>

        <hr className="border-gray-300" />

        {/* Additional Guests */}
        <div className="flex flex-row items-start justify-between md:flex-col">
          <p className="font-medium">Additional Guests:</p>
          <p className="text-gray-700">Extra guests may be charged additional fees.</p>
          <p className="text-gray-700">Extra guests may be charged additional fees.</p>
        </div>
      </div>
    </div>
  );
};

export default Policies;
