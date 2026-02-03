import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

type EmailOtpProps = {
  handleResendOtp: () => Promise<void>;
  validateOtp: (emailToken: string) => Promise<void>;
  loading: boolean;
  error?: string;
};

function EmailOtp({
  handleResendOtp,
  validateOtp,
  loading,
  error,
}: EmailOtpProps) {
  const user = useSelector((state: RootState) => state.auth.user);
  if (!user) return null;

  const [otp, setOtp] = useState(Array(4).fill(""));
  const inputRef = useRef<(HTMLInputElement | null)[]>([]);
  const [countDown, setCountDown] = useState(10);

  //Handle OTP input change
  function handleChange(value: string, index: number) {
    if (value.length > 1) return;
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next
    if (value && index < otp.length - 1) {
      inputRef.current[index + 1]?.focus();
    }

    // ✅ If last input filled, trigger validation automatically
    const combinedOtp = newOtp.join("");
    if (combinedOtp.length === otp.length && newOtp.every((d) => d !== "")) {
      validateOtp(combinedOtp);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>, index: number) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRef.current[index - 1]?.focus();
    }
  }

  useEffect(() => {
    inputRef.current[0]?.focus();
  }, []);

  // Countdown timer
  useEffect(() => {
    const countInterval = setInterval(() => {
      if (countDown <= 0) return;

      setCountDown((prev) => {
        if (prev <= 1) {
          clearInterval(countInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countInterval);
  }, [countDown]);


  return (
    <div>
      <div className="text-center w-full max-w-[370px] px-4 m-auto">
        <h2 className="font-semibold text-[18px] pb-1.5 hidden md:visible">Confirm Your Email</h2>
        <p className="text-gray-500 w-full max-w-[350px] m-auto text-sm sm:text-base">
          To continue, kindly enter the 4-digit code we sent to {user.email}
        </p>
      </div>

      <div className="flex items-center justify-center gap-3 sm:gap-5 w-full max-w-[300px] m-auto mt-5">
        {otp.map((digit, index) => (
          <input
            key={index}
            maxLength={1}
            type="text"
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={(el) => (inputRef.current[index] = el)}
            className="border border-gray-500 w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] p-1 text-center rounded text-lg sm:text-xl font-semibold"
            disabled={loading}
          />
        ))}
      </div>

      {/* Countdown / Resend */}
      <div className="w-full max-w-[250px] m-auto mt-9 text-center px-4">
        {countDown !== 0 ? (
          <p className="text-[13px] sm:text-[14px]">
            Didn’t receive an email? You can request another in{" "}
            <span className="text-blue-700">
              {countDown < 10 ? "0" + countDown : countDown}:00s
            </span>
          </p>
        ) : (
          <p
            onClick={async () => {
              try {
                await handleResendOtp();
                setCountDown(10); // Restart countdown after resend
              } catch (error) {
                console.error("Failed to resend OTP:", error);
              }
            }}
            className="text-blue-800 text-[13px] sm:text-[14px] font-semibold cursor-pointer"
          >
            Resend another code
          </p>
        )}
      </div>

      {/*  error */}
      {error && <p className="text-red-600 text-center mt-3 text-sm sm:text-base">{error}</p>}
    </div>
  );
}

export default EmailOtp;
