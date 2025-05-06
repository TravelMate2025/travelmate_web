import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import AuthNavbar from "../components/AuthNavbar";
import Spinner from "../components/Spinner";
import { MdErrorOutline } from "react-icons/md";
import { verifyCode, resendCode } from "../api/auth";

export default function VerifyEmail() {
  const [code, setCode] = useState<string[]>(["", "", "", ""]);
  const [resendTimer, setResendTimer] = useState<number>(60);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [resendVisible, setResendVisible] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || localStorage.getItem("verify_email");


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
    if (code.every((digit) => digit !== "")) {
      handleAutoSubmit();
    }
  }, [code]);

  const handleAutoSubmit = async () => {
    if (!email) return;
    setIsLoading(true);
    const fullCode = code.join("");
    const res = await verifyCode(email, fullCode);
    console.log("Verification result:", res); 
  
    setIsLoading(false);
    if (res.Status === 200 && res.Error === false) {
      console.log("OTP verified, navigating...");
      localStorage.setItem("email", email);
      navigate("/create-password", { state: { email } });
    } else {
      console.error("OTP verification failed:", res.Message || res);
      setShowError(true);
      setCode(["", "", "", ""]);
      setTimeout(() => setShowError(false), 10000);
      setTimeout(() => {
        const firstInput = document.getElementById("code-0");
        if (firstInput) firstInput.focus();
      }, 100);
    }
  };
  

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setResendVisible(true);
    }
  }, [resendTimer]);

  const handleResend = async () => {
    setIsLoading(true);
    try {
      await resendCode();
      setCode(["", "", "", ""]);
      setResendTimer(60);
      setResendVisible(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 relative">
      <AuthNavbar />
      {isLoading && (
        <div className="absolute inset-0 bg-blue-100/50 bg-opacity-60 flex items-center justify-center z-50">
          <Spinner size="40px" />
        </div>
      )}
      <div className="flex flex-col items-center justify-center flex-grow px-6">
        <div className="text-center max-w-md">
          <h2 className="text-4xl font-bold text-gray-900">Verify Your Email</h2>
          <p className="text-gray-600 mt-2">
            Kindly enter the 4-digit code we sent to <span className="font-semibold">{email}</span>
          </p>

        </div>

        <div className="w-full max-w-md text-center mt-6">
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
              <span className="ml-2 text-lg"><MdErrorOutline /></span>
              <span className="ml-1">Invalid code. Please try again.</span>
            </p>
          )}
        </div>

        {resendVisible ? (
          <button
            onClick={handleResend}
            className="mt-4 text-[#023E8A] font-bold hover:underline hover:text-blue-800"
            disabled={isLoading}
          >
            Resend another Code
          </button>
        ) : (
          <div className="text-center mt-4">
            <p className="text-gray-600">Didn’t receive an email?</p>
            <p className="text-gray-500">
              You can request another in{" "}
              <span className="font-semibold text-[#023E8A]">{resendTimer}s</span>
            </p>
          </div>
        )}

        <p className="text-gray-500 text-sm mt-10 max-w-md text-center px-4">
          By continuing, you agree to our{" "}
          <Link to="/terms" className="text-blue-600 hover:underline">Terms of Use</Link> and{" "}
          <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
