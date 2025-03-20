import Modal from "./Modal";
import { FaUser, FaCalendarAlt } from "react-icons/fa";

interface EditBasicInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditBasicInfoModal({ isOpen, onClose }: EditBasicInfoModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Basic Information" onSave={() => console.log("Saved")}>
      <div className="space-y-4">
        {/* First Name */}
        <div>
          <label className="block font-semibold mb-1">First Name</label>
          <div className="flex items-center border border-gray-300 p-2 rounded-md">
            <span className="text-gray-500 mr-2">
              <FaUser />
            </span>
            <input type="text" placeholder="Enter first name" className="w-full outline-none" />
          </div>
        </div>

        {/* Last Name */}
        <div>
          <label className="block font-semibold mb-1">Last Name</label>
          <div className="flex items-center border border-gray-300 p-2 rounded-md">
            <span className="text-gray-500 mr-2">
              <FaUser />
            </span>
            <input type="text" placeholder="Enter last name" className="w-full outline-none" />
          </div>
        </div>

        {/* Gender */}
        <div className="">
          <label className="block font-semibold mb-2">Gender</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input type="radio" name="gender" value="Male" className="mr-2" /> Male
            </label>
            <label className="flex items-center">
              <input type="radio" name="gender" value="Female" className="mr-2" /> Female
            </label>
            <label className="flex items-center">
              <input type="radio" name="gender" value="Not Say" className="mr-2" /> I prefer not to say
            </label>
          </div>
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block font-semibold mb-1">Date of Birth</label>
          <div className="flex items-center border border-gray-300 p-2 rounded-md">
            <span className="text-gray-500 mr-2">
              <FaCalendarAlt />
            </span>
            <input type="date" className="w-full outline-none" />
          </div>
        </div>
      </div>
    </Modal>
  );
}
