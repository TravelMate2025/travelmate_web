import Modal from "./Modal";
import { useEffect, useState } from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { UserProfile } from "../../api/profile";
import { RootState } from "../../store";
import { useSelector } from "react-redux";
import { updateUserProfile } from "../../api/profile";

interface EditContactInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserInfo: UserProfile | null;
}

export default function EditContactInfoModal({ isOpen, onClose, currentUserInfo }: EditContactInfoModalProps) {
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const profileId = useSelector((state: RootState) => state.auth.user?.profileId);
  
  // const userId = user?.id;

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentUserInfo) {
      setEmail(currentUserInfo.email || "");
      setPhone(currentUserInfo.mobile_number || "");
      setAddress(currentUserInfo.address || "");
    }
  }, [currentUserInfo]);

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!accessToken) {
        setError("Please login again to update your profile.");
        return;
      }

      if (!profileId) {
        setError("this user does not exist. Please contact customer support.");
        return;
      }

      const updatedData = {
        email: email,
        mobile_number: phone,
        address: address,
      };

      console.log("Sending contact update:", updatedData);
      await updateUserProfile(profileId, updatedData);
      onClose();
      window.location.reload();
    } catch (err: any) {
      if (err.message === "Unauthorized") {
        setError("Session expired. Please login again.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Contact Information" onSave={handleSave} saveText="Save" loading={loading}>
      {error && <p className="text-red-500">{error}</p>}
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
