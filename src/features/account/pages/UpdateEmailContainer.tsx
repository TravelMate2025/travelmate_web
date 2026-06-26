import { useCallback, useEffect, useState } from "react";
import UpdateEmailPresenter from "./UpdateEmailPresenter";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import api from "../../../api/services/api";
import axios from "axios";
import { updateUserEmail } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data;

    if (typeof responseData === "string") {
      return responseData;
    }

    if (Array.isArray(responseData)) {
      return responseData.map((value) => String(value)).join(" ");
    }

    if (responseData && typeof responseData === "object") {
      const entries = Object.values(responseData as Record<string, unknown>)
        .flatMap((value) => (Array.isArray(value) ? value : [value]))
        .map((value) => String(value))
        .filter(Boolean);

      if (entries.length > 0) {
        return entries.join(" ");
      }
    }

    return error.message || "Request failed.";
  }
  return error instanceof Error ? error.message : String(error);
}

function UpdateEmailContainer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const [hasReceivedOtp, setHasReceivedOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isOtpValid, setIsOtpValid] = useState(false);
  const safeUser = (user ?? {}) as {
    email?: string;
  };

  
  const requestEmailResetToken = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      if (!safeUser.email) {
        throw new Error("User email is not available.");
      }

      const response = await api.post("/users/reset_email/", {
        email: safeUser.email,
      });

      if (response.status >= 200 && response.status < 300) {
        setHasReceivedOtp(true);
      }
    } catch (error: unknown) {
      const msg = getErrorMessage(error);
      console.error("Email reset error:", msg);
      setError(msg || "Failed to request email reset.");
    } finally {
      setLoading(false);
    }
  }, [safeUser.email]);


  useEffect(() => {
    void requestEmailResetToken();
  }, [requestEmailResetToken]);

  const handleResendOtp = async () => {
    try {
      if (!safeUser.email) {
        throw new Error("User email is not available.");
      }

      const res = await api.post("/users/resend_reset_token/", {
        email: safeUser.email,
      });

      if (res.status === 200) {
        console.log("OTP resent successfully!");
      }
    } catch (error: unknown) {
      console.error("Resend OTP error:", String(error));
    }
  }

  const validateOtp = async (emailToken: string) => {
    setLoading(true);
    setError("");

    try {
      if (!safeUser.email) {
        throw new Error("User email is not available.");
      }

      const res = await api.post("/users/validate-reset-token/", {
        token: emailToken,
        email: safeUser.email,
      });

      if (res.status === 200) {
        setIsOtpValid(true);
      }
    } catch (error: unknown) {
      const msg = getErrorMessage(error);
      console.error("OTP validation error:", msg);
      setError(msg || "Invalid or expired OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmail = async (userNewEmail: string, currentPassword: string) => {
    setLoading(true);
    setError("");

    try {
      if (!userNewEmail.trim()) {
        throw new Error("Please enter a new email address.");
      }

      if (!currentPassword.trim()) {
        throw new Error("Please enter your current password.");
      }

      const res = await api.post("/users/set_email/", {
        new_email: userNewEmail.trim(),
        current_password: currentPassword,
      });

      if (res.status >= 200 && res.status < 300) {
        dispatch(updateUserEmail(userNewEmail.trim()));
        toast.success("Email updated successfully.");
        navigate("/account/security");
      } else {
        setError("Unexpected response from server.");
      }
    } catch (error: unknown) {
      const msg = getErrorMessage(error);
      console.error("Email update error:", msg);
      setError(msg || "Failed to update email.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <UpdateEmailPresenter
      hasReceivedOtp={hasReceivedOtp}
      isOtpValid={isOtpValid}
      handleResendOtp={handleResendOtp}
      validateOtp={validateOtp}
      handleUpdateEmail={handleUpdateEmail}
      loading={loading}
      error={error}
    />
  );
}

export default UpdateEmailContainer;
