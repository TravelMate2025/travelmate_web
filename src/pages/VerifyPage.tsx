import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthNavbar from "../components/AuthNavbar";
import Spinner from "../components/Spinner";
import { MdErrorOutline } from "react-icons/md";
// import { verifyCode } from "../api/verifyCode"; 

export default function VerifyEmail() {
  const [code, setCode] = useState<string[]>(["", "", "", ""]);
  const [resendTimer, setResendTimer] = useState<number>(60);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const firstInputRef = useRef<HTMLInputElement | null>(null);

  // const [, setIsVerified] = useState<boolean | null>(null); 
  const navigate = useNavigate();

  const handleChange = (index: number, value: string) => {
    if (/^\d?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 3) {
        document.getElementById(`code-${index + 1}`)?.focus();
      }

      if (newCode.every(digit => digit !== "")) {
        // Trigger validation when the code is complete
        handleValidateCode(newCode.join(""));
      }
    }
  };

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleValidateCode = async (codeInput: string) => {
    setIsLoading(true);
    await new Promise(res => setTimeout(res, 1500));
    try {
      // const response = await verifyCode(codeInput);
      const isCorrect = codeInput === "3030";
  
      if (isCorrect) {
        // setIsVerified(true);
        navigate("/create-password");
      } else {
        // setIsVerified(false);
        setShowError(true);
        setCode(["", "", "", ""]);
        setTimeout(() => setShowError(false), 5000);
        setTimeout(() => firstInputRef.current?.focus(), 100);
      }
    } catch (error) {
      // setIsVerified(false);
      setShowError(true);
      setCode(["", "", "", ""]);
      setTimeout(() => setShowError(false), 5000);
      setTimeout(() => firstInputRef.current?.focus(), 100);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <AuthNavbar />
      <div className="flex flex-col items-center justify-center flex-grow px-6 relative">
        {isLoading && (
          <div className="fixed inset-0 bg-blue-200/50 bg-opacity-50 flex justify-center items-center z-50">
            <Spinner size="40px" borderWidth={8} />
          </div>
        )}

        <div className="text-center max-w-md">
          <h2 className="text-4xl font-bold text-gray-900">Verify Your Email</h2>
          <p className="text-gray-600 mt-2">Kindly enter the 4-digit code we sent to Name@gmail.com</p>
        </div>

        <div className="w-full max-w-md text-center mt-6">
          <div className="flex justify-center gap-4 relative group">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                ref={index === 0 ? firstInputRef : null}
                type="text"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                maxLength={1}
                className="w-16 h-16 text-3xl text-center border rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
            ))}
             <span className="absolute -top-8 text-xs bg-blue-700 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              Use "3030" as the correct testing code
            </span>
          </div>

          {showError && (
            <p className="flex items-center text-red-600 text-sm mt-2 pl-2 sm:pl-18">
              <MdErrorOutline />
              <span className="ml-1">Incorrect code, try again</span>
            </p>
          )}
        </div>

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
