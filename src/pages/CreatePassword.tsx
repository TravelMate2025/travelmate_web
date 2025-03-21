import { useState } from "react";
import AuthNavbar from "../components/AuthNavbar";
import Spinner from "../components/Spinner";
import { FaCheck, FaTimes } from "react-icons/fa";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { MdLockOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function CreatePassword() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const navigate = useNavigate();

  const requirements = [
    { label: "At Least 8 Characters", check: password.length >= 8 },
    { label: "One Uppercase Letter (A-Z)", check: /[A-Z]/.test(password) },
    { label: "One Lowercase Letter (a-z)", check: /[a-z]/.test(password) },
    { label: "One Number (0-9)", check: /\d/.test(password) },
    { label: "One Special Character (!@#$%^&*)", check: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];

  const allValid = requirements.every((req) => req.check);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allValid) return;
  
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
  
      // Show success message
      setTimeout(() => {
        setShowSpinner(true);
  
        setTimeout(() => {
          setShowSpinner(false);
          navigate("/login");
        }, 4000);
      }, 2000);
    }, 2000);
  };
  

  return (
    <div className="h-screen flex flex-col relative">
      <AuthNavbar />

      {/* Overlay Spinner */}
      {showSpinner && (
        <>
          <div className="fixed inset-0 bg-[#CCD8E8] opacity-40 z-40"></div>

          <div className="fixed inset-0 flex justify-center items-center z-50">
            <Spinner size="50px"/>
          </div>
        </>
      )}

      <div className="flex-1 flex flex-col items-center justify-center bg-white px-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-[#023E8A]">Create Password</h1>
          <p className="text-gray-700 mt-2">
            Create a strong password to keep your TravelMate account secure.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-[660px]">
          {/* Password Input */}
          <div className="relative">
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <div className="relative">
              {/* Lock Icon */}
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
                placeholder="Enter Password"
              />
              {/* Eye Toggle Icon */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
              </button>
            </div>
          </div>

          {/* Validation Checklist */}
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

          {/* Create Password Button */}
          <button
            type="submit"
            disabled={!allValid || loading}
            className={`w-full text-white py-2 rounded-lg mt-4 flex items-center justify-center gap-2 transition ${
              allValid ? "bg-[#023E8A] hover:bg-[#0450A2]" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {allValid ? "Continue" : "Create Password"}
            {loading && <Spinner size="25px" />}
          </button>
        </form>

        {/* Success Message */}
        {success && (
          <div className="w-full max-w-[670px] mt-4 flex items-center gap-2 border border-green-500 bg-blue-50 px-4 py-2 rounded-lg text-green-700">
            <span className="w-6 h-6 flex items-center justify-center rounded-full bg-green-500 text-white">
              <FaCheck size={14} />
            </span>
            Password created successfully. Use this password when next you want to log in.
          </div>
        )}
      </div>

      {/* Terms and Privacy */}
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
