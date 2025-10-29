import { Dialog } from "@headlessui/react";
import { FaTimes } from "react-icons/fa";

interface AmenitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  amenities: { icon: React.ReactNode; name: string }[];
}


const AmenitiesModal: React.FC<AmenitiesModalProps> = ({ isOpen, onClose, amenities }) => {

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white w-full max-w-md mx-auto rounded-lg p-4 overflow-y-auto h-full max-h-full">
           <div className="flex items-center px-2 py-2 space-x-10 mb-6">
              <button 
                  onClick={onClose} 
                  className="text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md shadow-sm p-1"
                >
                 <FaTimes size={20} />
              </button>
              <Dialog.Title className="text-xl font-semibold mb-2">All Amenities</Dialog.Title>
          </div>

          <div className="flex flex-col gap-3">
            {amenities.map((item, index) => (
              <p key={index} className="flex items-center gap-2">
                {item.icon} {item.name}
              </p>
            ))}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AmenitiesModal;
