import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthNavbar from "../components/AuthNavbar";
import Spinner from "../components/Spinner";
import { MdErrorOutline } from "react-icons/md";

export default function VerifyEmail() {
  const [code, setCode] = useState<string[]>(["", "", "", ""]);
  const [resendTimer, setResendTimer] = useState<number>(60);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (index: number, value: string) => {
    if (/^\d?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 3) {
        document.getElementById(`code-${index + 1}`)?.focus();
      }
    }
  };

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (code.some((digit) => digit === "")) {
      setShowError(true);
      setTimeout(() => setShowError(false), 10000);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      console.log("Submitted Code:", code.join(""));
      setIsLoading(false);
      navigate("/create-password"); // Temporary navigation
    }, 2000);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <AuthNavbar />
      <div className="flex flex-col items-center justify-center flex-grow px-6">
        <div className="text-center max-w-md">
          <h2 className="text-4xl font-bold text-gray-900">Verify Your Email</h2>
          <p className="text-gray-600 mt-2">Kindly enter the 4-digit code we sent to Name@gmail.com</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-md text-center mt-6">
          <div className="flex justify-center gap-4">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                maxLength={1}
                className="w-16 h-16 text-3xl text-center border rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
            ))}
          </div>

          {showError && (
            <p className="flex items-center text-red-600 text-sm mt-2">
              <span className="ml-2 sm:ml-18 text-lg" ><MdErrorOutline /></span>
              <span className="ml-1">Kindly enter the 4-digit code</span> 
            </p>
          )}

          <button
            type="submit"
            className="w-76 bg-[#023E8A] text-white py-2 rounded-lg mt-6 hover:bg-[#0450A2] transition"
            disabled={isLoading}
          >
            <div className="flex items-center justify-center w-full">
              {isLoading ? <Spinner size="24px" borderWidth="8px" color="white" /> : "Continue"}
            </div>
          </button>
        </form>

        <p className="text-gray-600 mt-4">Didn’t receive an email?</p>
        <p className="text-gray-500">
          You can request another in <span className="font-semibold text-[#023E8A]">{resendTimer}s</span>
        </p>

        <p className="text-gray-500 text-sm mt-22 max-w-md text-center px-4">
          By continuing, you have read and agree to our{" "}
          <Link to="/terms" className="text-blue-600 hover:underline">Terms of Use</Link> and{" "}
          <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
