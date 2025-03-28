import React from "react";
import { FaTimes } from "react-icons/fa";

interface AllPhotosModalProps {
  onClose: () => void;
  images: string[];
}

const AllPhotosModal: React.FC<AllPhotosModalProps> = ({ onClose, images }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-[1000px] h-[80%] p-6 overflow-y-auto shadow-lg">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-xl font-bold mx-auto">All Photos</h2>
          <button onClick={onClose} className="text-gray-600">
            <FaTimes size={20} />
          </button>
        </div>

        {/* Images Section */}
        <div className="mt-4 space-y-4">
          {images.length > 0 && (
            <img src={images[0]} alt="Hotel Image" className="w-full rounded-lg" />
          )}
          <div className="grid grid-cols-2 gap-4">
            {images.slice(1).map((img, index) => (
              <img key={index} src={img} alt={`Hotel Image ${index + 2}`} className="w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllPhotosModal;
