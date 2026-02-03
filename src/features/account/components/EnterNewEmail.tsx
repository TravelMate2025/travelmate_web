import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { FaRegEnvelope, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

type EnterNewEmailProps = {
  setHasReceivedOtp: React.Dispatch<React.SetStateAction<boolean>>;
  newEmail: string;
  setNewEmail: React.Dispatch<React.SetStateAction<string>>;
  confirmEmail: string;
  setConfirmEmail: React.Dispatch<React.SetStateAction<string>>;
  handleResetEmail: (userNewEmail: string) => Promise<void>;
};

function EnterNewEmail({
  handleResetEmail,
  newEmail,
  setNewEmail,
  confirmEmail,
  setConfirmEmail,
}: EnterNewEmailProps) {
  const user = useSelector((state: RootState) => state.auth.user);
  if (!user) return null;

  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!newEmail || !confirmEmail) {
      setError("Please fill in both fields.");
      return;
    }

    if (newEmail !== confirmEmail) {
      setError("Emails do not match.");
      return;
    }

    await handleResetEmail(newEmail);
  };

  return (
    <div className="px-4 sm:px-6 md:px-0">
      {/* Close Button */}
      <Link to="/account/security">
        <div
          className="ml-4 md:ml-20 bg-white border border-gray-300 rounded p-1.5 
            shadow-[0_4px_10px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_14px_rgba(0,0,0,0.25)] 
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
          Update your email address. You'll need to verify the new email before
          you can use it to log in.
        </p>
      </div>

      {/* Form Section */}
      <div className="max-w-md w-full mx-auto mt-7">
        <p>Current Email</p>
        <p className="text-gray-500 text-sm break-words">{user.email}</p>

        <form onSubmit={handleSubmit}>
          <div className="mt-5">
            <p className="pb-2">New Email</p>
            <div className="flex items-center gap-1 border-2 border-gray-300 rounded p-1">
              <FaRegEnvelope />
              <input
                type="email"
                placeholder="name@mail.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="outline-none border-none indent-1 flex-1 text-sm"
                required
              />
            </div>
          </div>

          <div className="mt-5">
            <p className="pb-2">Confirm Email</p>
            <div className="flex items-center gap-1 border-2 border-gray-300 rounded p-1">
              <FaRegEnvelope />
              <input
                type="email"
                placeholder="name@mail.com"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                className="outline-none border-none indent-1 flex-1 text-sm"
                required
              />
            </div>
          </div>

          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

          <button
            type="submit"
            className="border-none text-white mt-10 outline-none bg-blue-800 rounded p-2 w-full 
              hover:bg-blue-900 transition-all text-sm sm:text-base"
          >
            Send Verification Code
          </button>
        </form>
      </div>
    </div>
  );
}

export default EnterNewEmail;
