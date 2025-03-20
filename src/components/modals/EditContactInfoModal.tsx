import Modal from "./Modal";
import { useState } from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

interface EditContactInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditContactInfoModal({ isOpen, onClose }: EditContactInfoModalProps) {
  const [email, setEmail] = useState("elvis@gmail.com");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleSave = () => {
    console.log({ email, phone, address }); 
    onClose(); 
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Contact Information" onSave={handleSave} saveText="Save">
      <div className="space-y-4">
        {/* Email Input */}
        <div>
          <label className="block font-semibold">Email Address</label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">
              <FaEnvelope />
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2"
              placeholder="Enter email"
            />
          </div>
        </div>

        {/* Phone Input */}
        <div>
          <label className="block font-semibold">Mobile Number</label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">
              <FaPhone />
            </span>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2"
              placeholder="Enter phone number"
            />
          </div>
        </div>

        {/* Address Input */}
        <div>
          <label className="block font-semibold">Address</label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">
              <FaMapMarkerAlt />
            </span>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2"
              placeholder="Enter address"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
