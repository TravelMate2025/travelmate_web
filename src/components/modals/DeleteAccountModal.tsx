import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import Modal from "./Modal";
import { deleteUserAccount } from "../../api/profile";
import { useNavigate } from "react-router-dom";
import { logout } from "../../features/auth/authSlice";
import Spinner from "../../components/Spinner";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const REASONS = [
  "Found another app",
  "Too many notifications",
  "Overloaded with content",
  "Security concern",
  "Others",
];

export default function DeleteAccountModal({ isOpen, onClose }: DeleteAccountModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [feedback, setFeedback] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state: RootState) => state.auth);

  const handleDelete = async () => {
    if (!accessToken) {
      setError("You must be logged in to delete your account.");
      return;
    }

    if (!reason) {
      setError("Please select a reason for account deletion.");
      return;
    }

    if (reason === "Others" && feedback.trim() === "") {
      setError("Please provide additional feedback for 'Others'.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await deleteUserAccount(accessToken, reason, feedback);

      dispatch(logout());
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("email");
      localStorage.removeItem("verify_email");

      navigate("/create-account");
    } catch (err: any) {
      const backendMessage = err?.response?.data?.Message || err?.response?.data?.message;
      setError(backendMessage || "Failed to delete account. Please try again.");
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
      // loading={loading}
    >
      <div className="space-y-4">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
          <div className="w-16 h-16 flex items-center justify-center bg-[#CCD8E8] rounded-full bg-opacity-50 z-50">
            <Spinner />
          </div>
        </div>
      )}
        {error && <p className="text-red-500">{error}</p>}
        <p className="font-semibold">Kindly select why you want to delete your account</p>
        <div className="space-y-2">
          {REASONS.map((option) => (
            <label className="flex items-center" key={option}>
              <input
                type="radio"
                name="reason"
                value={option}
                checked={reason === option}
                className="mr-2"
                onChange={(e) => setReason(e.target.value)}
              />
              {option}
            </label>
          ))}
        </div>

        <p className="font-semibold">Additional Feedback</p>
        <p className="text-gray-500 text-sm">
          {reason === "Others"
            ? "Please tell us more about your reason for deleting your account."
            : "Optional: Your feedback helps us improve our service."}
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
