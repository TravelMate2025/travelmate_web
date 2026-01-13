import React, { useState } from "react";
import { useMediaQuery } from "react-responsive";
import RefundCancellationModal from "../modals/RefundCancellationModal";

interface RefundCancellationProps {
  formattedTime: string;
  formattedDate: string;
  refundableUntil: string;
}
const RefundCancellation: React.FC<RefundCancellationProps> = ({
  formattedTime,
  formattedDate,
  refundableUntil,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 767 });

  return (
    <div className="w-full space-y-4 px-2 pt-4 lg:pt-0">
      {/* Title and Mobile Show All Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Refund & Cancellations</h3>
        {isMobile && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-blue-600 font-medium flex items-center gap-1"
          >
            Show all <span className="text-xl pb-1">{">"}</span>
          </button>
        )}
      </div>

      {/* Refund & Cancellation Section */}
      <div className="sm:border border-gray-300 rounded-lg space-y-6 lg:p-4">
        <div>
          <p className="font-medium mb-4 md:mr-60 hidden md:block">Refunds</p>
          <ul className="text-gray-700 ml-4 list-disc">
            <li>Fully Refundable before {refundableUntil}</li>
          </ul>
        </div>

        <hr className="border-gray-300" />

        <div className="flex flex-col gap-2 justify-normal">
          <p className="font-medium mb-4 md:mr-50">Cancellations</p>
          <ul className="text-gray-700 ml-4 list-disc">
            <li>
              Cancellations made after {formattedTime} on {formattedDate} or
              no-shows are subject to a fee equal to 100% of the amount paid
              for the reservation.
            </li>
          </ul>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <RefundCancellationModal
          onClose={() => setIsModalOpen(false)}
          formattedTime={formattedTime}
          formattedDate={formattedDate}
          refundableUntil={refundableUntil}
        />
      )}
    </div>
  );
};

export default RefundCancellation;


