import { useState } from "react";
import AuthNavbar from "../components/AuthNavbar";
import Spinner from "../components/Spinner";
import { FaCheck, FaTimes } from "react-icons/fa";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { MdLockOutline } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import { setNewPassword } from "../api/auth";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../slices/authSlice";

export default function CreateNewPassword() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const dispatch = useDispatch();

  const requirements = [
    { label: "At Least 8 Characters", check: password.length >= 8 },
    { label: "One Uppercase Letter (A-Z)", check: /[A-Z]/.test(password) },
    { label: "One Lowercase Letter (a-z)", check: /[a-z]/.test(password) },
    { label: "One Number (0-9)", check: /\d/.test(password) },
    { label: "One Special Character (!@#$%^&*)", check: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];

  const allValid = requirements.every((req) => req.check);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allValid || !email) return;

    setLoading(true);
    try {
      await setNewPassword(email, password);
      setSuccess(true);
      toast.success("Password reset successfully");
      
      // Optional: Automatically log the user in after password reset
      dispatch(
        loginSuccess({
          accessToken: '', // You might want to implement login after reset
          refreshToken: '',
          user: {
            id: 0,
            email: email,
            name: "",
          },
          registrationComplete: true,
        })
      );
      
      setTimeout(() => setShowSpinner(true), 2000);
      setTimeout(() => {
        setShowSpinner(false);
        navigate("/login"); // Redirect to login page
      }, 4000);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to set new password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col relative">
      <AuthNavbar />

      {showSpinner && (
        <>
          <div className="fixed inset-0 bg-[#CCD8E8] opacity-40 z-40"></div>
          <div className="fixed inset-0 flex justify-center items-center z-50">
            <Spinner size="50px" />
          </div>
        </>
      )}

      <div className="flex-1 flex flex-col items-center justify-center bg-white px-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">Create New Password</h1>
          <p className="text-gray-700 mt-2">
            Create a secure password to regain access to your TravelMate account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-[660px]">
          <div className="relative">
            <label className="block text-gray-700 font-medium mb-1">New Password</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl">
                <MdLockOutline />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  if (e.target.value.length <= 20) setPassword(e.target.value);
                }}
                className="w-full border border-gray-300 rounded-lg pl-10 pr-12 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter New Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
              </button>
            </div>
          </div>

          <p className="text-gray-700 text-sm mt-3">Password must include:</p>
          <ul className="mt-2">
            {requirements.map((req, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-gray-700 mt-2">
                <span
                  className={`w-5 h-5 flex items-center justify-center rounded-full border ${
                    req.check
                      ? "bg-blue-500 border-blue-500 text-white"
                      : "bg-red-500 border-red-500 text-white"
                  }`}
                >
                  {req.check ? <FaCheck size={12} /> : <FaTimes size={12} />}
                </span>
                {req.label}
              </li>
            ))}
          </ul>

          <button
            type="submit"
            disabled={!allValid || loading}
            className={`w-full text-white py-2 rounded-lg mt-4 flex items-center justify-center gap-2 transition ${
              allValid ? "bg-[#023E8A] hover:bg-[#0450A2]" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {allValid ? "Continue" : "Create New Password"}
            {loading && <Spinner size="25px" />}
          </button>
        </form>

        {success && (
          <div className="w-full max-w-[670px] mt-4 flex items-center gap-2 border border-green-500 bg-blue-50 px-4 py-2 rounded-lg text-green-700">
            <span className="min-w-6 h-6 flex items-center justify-center rounded-full bg-green-500 text-white">
              <FaCheck size={14} />
            </span>
            New password set successfully. You can now use it to log in.
          </div>
        )}
      </div>

      <p className="text-gray-700 text-sm text-center mb-6">
        By continuing, you have read and agree with our{" "}
        <a href="#" className="text-[#023E8A] font-medium hover:underline">
          Terms of Use
        </a>{" "}
        and{" "}
        <a href="#" className="text-[#023E8A] font-medium hover:underline">
          Privacy Policy
        </a>.
      </p>
    </div>
  );
}