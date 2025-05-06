import React from "react";

type ReviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold ml-20 text-center">Delete Review</h2>
          <button onClick={onClose} className="text-gray-600 border border-gray-500 rounded-lg w-8 p-1">
            X
          </button>
        </div>
        <p className="text-gray-500 text-center my-5">Once deleted, your review will be permanently removed from your stay reviews.</p>
        <div className="mt-4 flex justify-between">
          <button className="border border-[#023E8A] text-[#023E8A] px-4 py-2 rounded w-[46%]" onClick={onClose}>
            Cancel
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded w-[46%]">
            Delete Review
          </button>
        </div>
      </div>
    </div>
  );
};
