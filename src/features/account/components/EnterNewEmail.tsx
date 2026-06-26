import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { FaRegEnvelope, FaLock, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

type EnterNewEmailProps = {
  newEmail: string;
  setNewEmail: React.Dispatch<React.SetStateAction<string>>;
  handleUpdateEmail: (userNewEmail: string, currentPassword: string) => Promise<void>;
  error?: string;
};

function EnterNewEmail({
  newEmail,
  setNewEmail,
  handleUpdateEmail,
  error,
}: EnterNewEmailProps) {
  const user = useSelector((state: RootState) => state.auth.user);
  const [currentPassword, setCurrentPassword] = useState("");
  const [localError, setLocalError] = useState("");

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (!newEmail || !currentPassword) {
      setLocalError("Please fill in all fields.");
      return;
    }

    await handleUpdateEmail(newEmail, currentPassword);
  };

  return (
    <div className="px-4 sm:px-6 md:px-0">
      {/* Close Button */}
      <Link to="/account/security">
        <div
          className="ml-4 md:ml-20 bg-white border border-gray-300 rounded-lg p-2 
            shadow-[0_4px_10px_rgba(0,0,0,0.12)] hover:shadow-[0_6px_14px_rgba(0,0,0,0.18)] 
            active:scale-95 transition-all duration-200 cursor-pointer w-[35px]"
        >
          <FaTimes size={20} />
        </div>
      </Link>

      {/* Heading Section */}
      <div className="max-w-md w-full mx-auto text-center mt-5">
        <h2 className="text-2xl text-[#1E1E1E] font-semibold pb-2">
          Update Email
        </h2>
        <p className="text-[14px] text-gray-500">
          Update your email address. We’ll verify the current email first, then
          use your current password to save the new one.
        </p>
      </div>

      {/* Form Section */}
      <div className="max-w-md w-full mx-auto mt-7 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-gray-700">Current Email</p>
        <p className="mt-1 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600 break-words">
          {user.email}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5 mt-5">
          <div>
            <p className="pb-2 text-sm font-medium text-gray-700">New Email</p>
            <div
              className={`flex items-center gap-2 rounded-xl border-2 bg-white px-3 py-2 transition-all ${
                localError && !newEmail ? "border-red-500" : "border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100"
              }`}
            >
              <FaRegEnvelope className="text-gray-500 shrink-0" />
              <input
                type="email"
                placeholder="name@mail.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full border-none bg-transparent text-sm outline-none placeholder:text-gray-400"
                required
              />
            </div>
          </div>

          <div>
            <p className="pb-2 text-sm font-medium text-gray-700">Current Password</p>
            <div
              className={`flex items-center gap-2 rounded-xl border-2 bg-white px-3 py-2 transition-all ${
                localError && !currentPassword ? "border-red-500" : "border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100"
              }`}
            >
              <FaLock className="text-gray-500 shrink-0" />
              <input
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full border-none bg-transparent text-sm outline-none placeholder:text-gray-400"
                required
              />
            </div>
          </div>

          {(localError || error) && (
            <p className="text-red-600 text-sm">{localError || error}</p>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-[#023E8A] px-4 py-3 text-white text-sm sm:text-base font-medium transition-colors hover:bg-[#0450A2]"
          >
            Save Email
          </button>
        </form>
      </div>
    </div>
  );
}

export default EnterNewEmail;
