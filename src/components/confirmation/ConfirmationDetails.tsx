import React from "react";

const ConfirmationDetails: React.FC = () => {
  return (
    <div className="bg-white">
      <h2 className="text-lg font-semibold mb-2 text-left">Confirmation Details</h2>
      <div className="space-y-3 rounded-lg sm:p-6 sm:border border-gray-300">
        <p className="flex justify-between">
          <span className="font-medium">Confirmation Number</span> WER423761
        </p>
        <p className="flex justify-between">
          <span className="font-medium">Pin Code</span> 1234
        </p>
        <p className="flex justify-between">
          <span className="font-medium">Payment Status</span> <span className="text-green-600 font-semibold">Paid</span>
        </p>
        <p className="flex justify-between">
          <span className="font-medium">Booked on</span> March 25, 2025
        </p>
        <p className="flex justify-between">
          <span className="font-medium">Check-In Date</span> April 1, 2025
        </p>
        <p className="flex justify-between">
          <span className="font-medium">Check-Out Date</span> April 8, 2025
        </p>
      </div>
    </div>
  );
};

export default ConfirmationDetails;
