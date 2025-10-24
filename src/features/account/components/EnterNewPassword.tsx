import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { FiLock } from "react-icons/fi";
import { FaCheck, FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";
import { useState } from "react";
import SuccessModal from "./SuccessModal";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { logoutUser } from "../api/auth";
import { logout } from "../slices/authSlice";

type EnterNewPasswordProps = {
  setHasReceivedOtp: React.Dispatch<React.SetStateAction<boolean>>;
  handleConfirmPassword: (userNewPassword: string) => Promise<void>;
  newPassword: string;
  confirmPassword: string;
  setNewPassword: React.Dispatch<React.SetStateAction<string>>;
  setConfirmPassword: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  setPassUpdatedSuccessfully: (value: boolean) => void;
  passUpdatedSuccessfully: boolean;
};

function EnterNewPassword({
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  handleConfirmPassword,
  loading,
  setPassUpdatedSuccessfully,
  passUpdatedSuccessfully,
}: EnterNewPasswordProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ newPassword?: string; confirmPassword?: string }>({});
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const passwordRules = [
    { label: "At Least 8 Characters", test: (pw: string) => pw.length >= 8 },
    { label: "One Uppercase Letter (A-Z)", test: (pw: string) => /[A-Z]/.test(pw) },
    { label: "One Lowercase Letter (a-z)", test: (pw: string) => /[a-z]/.test(pw) },
    { label: "One Number (0-9)", test: (pw: string) => /[0-9]/.test(pw) },
    { label: "One Special Character (!@#$%^&*)", test: (pw: string) => /[!@#$%^&*]/.test(pw) },
  ];

  const user = useSelector((state: RootState) => state.auth.user);
  if (!user) return null;

   const handleLogout = async () => {
      if (!accessToken) {
        toast.error("User session expired. Login again to continue.");
        return;
      }
    
      setLogoutLoading(true);
        try {
          await logoutUser(accessToken);
          dispatch(logout());
          localStorage.clear();
          navigate("/create-account");
        } catch (error) {
          console.error("Logout failed", error);
          toast.error("Logout failed. Please try again.");
        } finally {
          setLogoutLoading(false);
        }
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { newPassword?: string; confirmPassword?: string } = {};

    if (!newPassword) {
      newErrors.newPassword = "Please enter a new password.";
    } else if (!passwordRules.every((rule) => rule.test(newPassword))) {
      newErrors.newPassword = "Password does not meet all requirements.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        await handleConfirmPassword(newPassword);
        setPassUpdatedSuccessfully(true);

        setTimeout(() => {
          setPassUpdatedSuccessfully(false);
        },3000);
        navigate("/create-account");
        handleLogout()
      } catch (err) {
        console.error(err);
      }
    }
  };

  const isButtonDisabled =
    !newPassword ||
    !confirmPassword ||
    !passwordRules.every((rule) => rule.test(newPassword)) ||
    newPassword !== confirmPassword;

  return (
    <div className="px-4 sm:px-6 md:px-0">
      {passUpdatedSuccessfully && (
        <SuccessModal>
          <SuccessModal.Body>
            <p>Password Updated Successfully</p>
          </SuccessModal.Body>
        </SuccessModal>
      )}

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

      {/* Header */}
      <div className="text-center mb-7 mt-5">
        <h2 className="text-2xl text-[#1E1E1E] font-semibold pb-2">
          Update Password
        </h2>
        <p className="text-sm text-gray-500 w-full max-w-sm mx-auto">
          Enter a new password to keep your TravelMate account secure.
        </p>
      </div>

      {/* Form */}
      {loading || logoutLoading ? (
        <div className="absolute inset-0 bg-white bg-opacity-60 flex justify-center items-center z-50">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 w-full max-w-md mx-auto">
          {/* New Password */}
          <div>
            <p className="pb-2">New Password</p>
            <div
              className={`flex items-center justify-between border-2 rounded p-2 ${
                errors.newPassword ? "border-red-500" : "border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2 flex-1">
                <FiLock size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="outline-none border-none w-full text-sm sm:text-base"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <p className="pb-2">Confirm Password</p>
            <div
              className={`flex items-center justify-between border-2 rounded p-2 ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2 flex-1">
                <FiLock size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Re-enter New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="outline-none border-none w-full text-sm sm:text-base"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Password Rules */}
          <div className="mt-5 space-y-1">
            <p className="pb-1 text-sm sm:text-base">Password Must Include</p>
            {passwordRules.map((rule, idx) => {
              const passed = rule.test(newPassword);
              const hasTyped = newPassword.length > 0;

              return (
                <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                  {!hasTyped ? (
                    <div className="bg-gray-300 rounded-full w-[15px] h-[15px]" />
                  ) : passed ? (
                    <FaCheck className="text-white p-0.5 bg-blue-950 rounded-full w-[15px] h-[15px]" />
                  ) : (
                    <FaTimes className="text-white p-0.5 bg-red-500 rounded-full w-[15px] h-[15px]" />
                  )}
                  <span className={`${hasTyped && passed ? "text-gray-400" : ""}`}>
                    {rule.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isButtonDisabled}
            className="w-full mt-5 bg-blue-800 text-white rounded p-2 text-sm sm:text-base disabled:opacity-50"
          >
            Update Password
          </button>
        </form>
      )}
    </div>
  );
}

export default EnterNewPassword;
