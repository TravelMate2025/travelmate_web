import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthNav from "../components/AuthNavbar";

export default function CheckEmail() {
  const [email] = useState("user@example.com");
  const [timer, setTimer] = useState(70);
  const navigate = useNavigate();

  useEffect(() => {
    if (timer === 0) return;

    const intervalId = setInterval(() => {
      setTimer((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timer]);

  const handleResendLink = () => {
    console.log("Resend link clicked");
    setTimer(300); // Reset timer to 5 minutes
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  const timerColor = timer < 60 ? "text-red-500" : "text-gray-600";

  return (
    <div className="flex flex-col min-h-screen">
      <AuthNav />

      <div className="flex flex-col items-center flex-1 px-6">
        <div className="px-8 py-10 text-center w-full max-w-[660px]">
          <h2 className="text-4xl font-bold mb-10">Check Your Email</h2>

          <ul className="text-gray-600 text-left list-disc list-inside mb-8 space-y-2">
            <li>We've sent a password reset link to <b>{email}</b>.</li>
            <li>The link will expire in <span 
            className={`text-lg font-semibold m-1 ${timerColor}`}>
              {formatTime(timer)}
               </span> mins.</li>
            <li>If you didn't receive the email, check your spam folder or request a new link.</li>
          </ul>


          {timer === 0 && (
            <div className="text-red-500 mb-4">
              The link has expired. Please click below to get a new one.
            </div>
          )}

          <button
            onClick={handleResendLink}
            className="bg-[#023E8A] text-white font-semibold py-2 rounded-lg w-[660px] max-w-full
               hover:bg-[#0450A2] transition"
          >
            Resend Link
          </button>

          <p
            onClick={() => navigate("/login")}
            className="mt-4 text-[#023E8A] font-semibold cursor-pointer hover:underline"
          >
            Back To Login
          </p>
        </div>
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
        </a>
      </p>
    </div>
  );
}
