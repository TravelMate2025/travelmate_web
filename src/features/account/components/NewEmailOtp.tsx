import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import SuccessModal from "./SuccessModal";
import toast from "react-hot-toast";
import { logoutUser } from "../api/auth";
import { logout } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";

type EmailOtpProps = {
  handleResendOtp: () => Promise<void>;
  handleConfirmEmail: (userNewEmail: string, userToken:string) => Promise<void>;
  loading: boolean;
  error?: string;
  NewEmail: string;
  setEmailUpdatedSuccessfully: (value:boolean) => void;
  emailUpdatedSuccessfully: boolean;
};

function NewEmailOtp({
  handleResendOtp,
  handleConfirmEmail,
  loading,
  error,
  NewEmail,
  setEmailUpdatedSuccessfully,
  emailUpdatedSuccessfully
}: EmailOtpProps) {
  const user = useSelector((state: RootState) => state.auth.user);
  if (!user) return null;

  const [otp, setOtp] = useState(Array(4).fill(""));
  const inputRef = useRef<(HTMLInputElement | null)[]>([]);
  const [countDown, setCountDown] = useState(10);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const [logoutLoading, setLogoutLoading] = useState(false);


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

  // Handle OTP input change
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

    // If last input filled, trigger validation automatically
    const combinedOtp = newOtp.join("");
    if (combinedOtp.length === otp.length && newOtp.every((d) => d !== "")) {
      handleConfirmEmail(NewEmail, combinedOtp);
      setEmailUpdatedSuccessfully(true)
      navigate('/create-account')
      setTimeout(() => {
           handleLogout()
      },1000)
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
      {emailUpdatedSuccessfully && (
        <SuccessModal>
          <SuccessModal.Body>
              <p>Email Updated Successfully</p>
          </SuccessModal.Body>
        </SuccessModal>
      )}

      {/* Loading State */}
        {logoutLoading && (
          <div className="flex justify-center items-center h-[50vh]">
            <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
      )}


      <div className="text-center w-[370px] m-auto">
        <h2 className="font-semibold text-[18px] pb-1.5">Confirm Your Email</h2>
        <p className="text-gray-500 w-[350px] m-auto">
          To continue, kindly enter the 4-digit code we sent to {user.email}
        </p>
      </div>

      <div className="flex items-center gap-5 w-[300px] m-auto mt-5">
        {otp.map((digit, index) => (
          <input
            key={index}
            maxLength={1}
            type="text"
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={(el) => (inputRef.current[index] = el)}
            className="border border-gray-500 w-[60px] h-[60px] p-1 text-center rounded text-xl font-semibold"
            disabled={loading}
          />
        ))}
      </div>

      {/* Countdown / Resend */}
      <div className="w-[250px] m-auto mt-9 text-center">
        {countDown !== 0 ? (
          <p className="text-[14px]">
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
            className="text-blue-800 text-[14px] font-semibold cursor-pointer"
          >
            Resend another code
          </p>
        )}
      </div>

      {/* Optional: show error */}
      {error && <p className="text-red-600 text-center mt-3">{error}</p>}
    </div>
  );
}

export default NewEmailOtp;
