import React from "react";

interface RefundCancellationProps {
  formattedTime: string;
  formattedDate: string;
  refundableUntil: string;
}

const RefundCancellation: React.FC<RefundCancellationProps> = ({ formattedTime, formattedDate, refundableUntil }) => {
  return (
    <div className="w-full space-y-4">
      {/* Title */}
      <h3 className="text-lg font-semibold">Refund & Cancellations</h3>

      {/* Body */}
      <div className="border border-gray-300 rounded-lg p-6 space-y-6">
        {/* Cancellations */}
        <div className="flex flex-row items-start justify-between md:flex-col">
          <p className="font-medium">Cancellations:</p>
          <p className="text-gray-700">
            Cancellations made after {formattedTime} on {formattedDate} or no-shows are subject to a fee  
            equal to 100% of the amount paid for the reservation.
          </p>
        </div>

        <hr className="border-gray-300" />

        {/* Refunds */}
        <div className="flex flex-row items-start justify-between md:flex-col">
          <p className="font-medium">Details: Refunds</p>
          <p className="text-gray-700">
            Fully Refundable before {refundableUntil}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RefundCancellation;
