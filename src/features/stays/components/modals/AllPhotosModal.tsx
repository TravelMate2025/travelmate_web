import React from "react";
import { FaTimes } from "react-icons/fa";

interface AllPhotosModalProps {
  onClose: () => void;
  images: string[];
}

const AllPhotosModal: React.FC<AllPhotosModalProps> = ({ onClose, images }) => {
  return (
    <div className="fixed inset-0 top-14 flex items-center justify-center bg-opacity-50">
      <div className="bg-white rounded-lg w-[1000px] h-[90%] p-6 shadow-[0_9px_60px_rgba(0,0,0,0.9)] z-50">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-xl font-bold mx-auto">All Photos</h2>
          <button onClick={onClose} className="text-gray-600 border border-gray-300 p-1 rounded-md">
            <FaTimes size={20} />
          </button>
        </div>

        {/* Images Section */}
        <div className="mt-4 space-y-4 overflow-y-auto h-[90%]">
            {images?.length ? (
            <>
                <img src={images[5]} alt="Hotel Image" className="w-full h-[300px] object-cover rounded-lg" />
                <div className="grid grid-cols-2 gap-4">
                {images.slice(1).map((img, index) => (
                    <img key={index} src={img} alt={`Hotel Image ${index + 2}`} className="w-full rounded-lg" />
                ))}
                </div>
            </>
            ) : (
            <p className="text-center text-gray-500">No images available</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default AllPhotosModal;
