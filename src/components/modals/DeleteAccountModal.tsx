import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import Modal from "./Modal";
import { deleteUserAccount } from "../../api/profile";
import { useNavigate } from "react-router-dom";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteAccountModal({ isOpen, onClose }: DeleteAccountModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [feedback, setFeedback] = useState("");

  const navigate = useNavigate();
  const { user, accessToken } = useSelector((state: RootState) => state.auth);
  const userId = user?.id;

  const handleDelete = async () => {
    if (!accessToken || !userId) {
      setError("You must be logged in to delete your account.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      console.log("Delete reason:", reason);
      console.log("Additional feedback:", feedback);
      await deleteUserAccount(userId, accessToken);
      // Clear local session here if needed (e.g., dispatch logout)
      navigate("/"); 
    } catch (err: any) {
      setError("Failed to delete account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Account"
      onSave={handleDelete}
      saveText="Delete Account"
      loading={loading}
    >
      <div className="space-y-4">
        {error && <p className="text-red-500">{error}</p>}
        <p className="font-semibold">Kindly select why you want to delete your account</p>
        <div className="space-y-2">
          {["Alternative", "Notifications", "Security"].map((option) => (
            <label className="flex items-center" key={option}>
              <input
                type="radio"
                name="reason"
                value={option}
                className="mr-2"
                onChange={(e) => setReason(e.target.value)}
              />
              {option === "Alternative" && "Found A Better Alternative App"}
              {option === "Notifications" && "Excessive Notifications and Email Overload"}
              {option === "Security" && "Account Security Concerns"}
            </label>
          ))}
        </div>

        <p className="font-semibold">Additional Feedback</p>
        <p className="text-gray-500 text-sm">
          We are committed to improving our services. Your honest insight helps us understand how we can do better.
        </p>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Type here..."
          className="w-full border rounded-md p-2 h-24 resize-none outline-none"
        ></textarea>
      </div>
    </Modal>
  );
}
