import Modal from "../../stays/components/modals/Modal";
import { useEffect, useState } from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { UserProfile, updateUserProfile } from "../api/profile";
import { RootState } from "../../../store";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

interface EditContactInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updated: UserProfile) => void;
  currentUserInfo: UserProfile | null;
}

export default function EditContactInfoModal({ isOpen, onClose, onUpdate, currentUserInfo }: EditContactInfoModalProps) {
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const profileId = useSelector((state: RootState) => state.auth.user?.profileId);

  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentUserInfo) {
      setPhone(currentUserInfo.mobile_number || "");
      setAddress(currentUserInfo.address || "");
    }
  }, [currentUserInfo]);

  const handleSave = async () => {
    if (!accessToken) {
      setError("Please login again to update your profile.");
      return;
    }
    if (!profileId) {
      setError("Profile not found. Please contact customer support.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const updated = await updateUserProfile(profileId, {
        mobile_number: phone,
        address,
      });
      onUpdate(updated);
      onClose();
      toast.success("Contact information updated successfully.");
    } catch (err: unknown) {
      if (err instanceof Error && err.message === "Unauthorized") {
        setError("Session expired. Please login again.");
      } else {
        setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Contact Information" onSave={handleSave} saveText="Save" loading={loading}>
      {error && <p className="text-red-500">{error}</p>}
      <div className="space-y-4">
        {/* Email — read-only; changed via Security → Update Email */}
        <div>
          <label className="block font-semibold">Email Address</label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">
              <FaEnvelope />
            </span>
            <input
              type="email"
              value={currentUserInfo?.email || ""}
              readOnly
              className="w-full border border-gray-200 rounded-lg pl-10 pr-3 py-2 bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">To change your email, go to Security settings.</p>
        </div>

        <div>
          <label className="block font-semibold">Mobile Number</label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">
              <FaPhone />
            </span>
            <input
              type="text"
              value={phone}
              onChange={(e) => {
                const input = e.target.value;
                if (/^\d*$/.test(input)) {
                  setPhone(input.slice(0, 14));
                }
              }}
              maxLength={14}
              className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2"
              placeholder="Enter phone number"
            />
          </div>
        </div>

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
