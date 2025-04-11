import React from "react";
import { IoMdClose } from "react-icons/io";
import { FaCheck } from "react-icons/fa";

interface CardSuccessModalProps {
  onClose: () => void;
}

const CardSuccessModal: React.FC<CardSuccessModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white w-[518px] h-[314px] rounded-[20px] p-6 flex flex-col items-center justify-center relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 text-xl">
          <IoMdClose />
        </button>
        <div className="w-[80px] h-[80px] rounded-full bg-green-500 flex items-center justify-center mb-6">
          <FaCheck className="text-white text-3xl" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Card Added Successfully!</h2>
        <p className="text-center text-gray-600 max-w-[80%]">
          Your new card has been securely saved and is ready for payments.
        </p>
      </div>
    </div>
  );
};

export default CardSuccessModal;
