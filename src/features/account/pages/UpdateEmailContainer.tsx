import { useCallback, useEffect, useState } from "react";
import UpdateEmailPresenter from "./UpdateEmailPresenter";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import api from "../../../api/services/api";
import axios from "axios";

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data as
      | { error?: string; message?: string }
      | undefined;

    return responseData?.error || responseData?.message || error.message || String(error);
  }
  return error instanceof Error ? error.message : String(error);
}
// import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function UpdateEmailContainer() {
  const user = useSelector((state: RootState) => state.auth.user);
//   const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  // const navigate = useNavigate()

  const [hasReceivedOtp, setHasReceivedOtp] = useState(false);
  const [hasReceiveNewOtp, setHasReceiveNewOtp] = useState(false)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isOtpValid, setIsOtpValid] = useState(false);
  const safeUser = (user ?? {}) as {
    id: number;
    first_name?: string;
    last_name?: string;
    email?: string;
    name?: string;
  };

  
    const requestEmailResetToken = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append("email", safeUser.email ?? "");

            const response = await api.post(
            `${API_BASE_URL}/users/reset_email/`,
            formData,
            {
                headers: {
                "Content-Type": "multipart/form-data",
                },
            }
            );

            if (response.status === 204) {
            const resendFormData = new FormData();
            resendFormData.append("email", safeUser.email ?? "");
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
        const formData = new FormData();
        const displayName = `${safeUser.first_name ?? safeUser.name ?? ""} ${safeUser.last_name ?? ""}`.trim();
        formData.append("name", displayName);
        formData.append("email", safeUser.email ?? "");

        const res = await api.post(`${API_BASE_URL}/users/resend_reset_token/`,
            formData,
            {
                headers:{
                    "Content-Type":"multipart/form-data"
                }
            }
        )
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
        const formData = new FormData();
        formData.append("token", emailToken);
        formData.append("email", safeUser.email ?? "");

        const res = await api.post(
        `${API_BASE_URL}/users/validate-reset-token/`,
        formData,
        {
            headers: {
            "Content-Type": "multipart/form-data",
            },
        }
        );

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

 const handleResetEmail = async (userNewEmail: string) => {
  setLoading(true);
  setError("");

  try {
    const formData = new FormData();
    formData.append("email", userNewEmail);

    const res = await api.post(
      `${API_BASE_URL}/users/reset_email/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        },
      }
    );

    if (res.status === 204) {
      setHasReceiveNewOtp(true)
    }
  } catch (error: unknown) {
    const msg = getErrorMessage(error);
    console.error("Email reset error:", msg);
    setError(msg || "Failed to update email.");
  } finally {
    setLoading(false);
  }
};

const handleConfirmEmail = async (
  userNewEmail: string,
  userToken: string,
) => {
  setLoading(true);
  setError("");

  try {
    const formData = new FormData();
    formData.append("uid", String(safeUser.id ?? 0));
    formData.append("token", userToken);
    formData.append("new_email", userNewEmail);


    const res = await api.post(
      `${API_BASE_URL}/users/confirm-new-email/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (res.status === 204) {
      console.log("Email updated successfully!");
      // navigate("/account/security");
    } else {
      setError("Unexpected response from server.");
    }
  } catch (error: unknown) {
    const msg = getErrorMessage(error);
    console.error("Confirm email error:", msg);
    console.error("Error response data:", msg);

    setError(msg || "Failed to confirm new email.");
  } finally {
    setLoading(false);
  }
};



  return (
    <UpdateEmailPresenter
      hasReceivedOtp={hasReceivedOtp}
      hasReceiveNewOtp={hasReceiveNewOtp}
      setHasReceivedOtp={setHasReceivedOtp}
      isOtpValid={isOtpValid}
      handleResendOtp={handleResendOtp}
      validateOtp={validateOtp}
      handleResetEmail={handleResetEmail}
      handleConfirmEmail={handleConfirmEmail}
      loading={loading}
      error={error}
    />
  );
}

export default UpdateEmailContainer;
