import { useState, useEffect } from "react";
import UpdateEmailPresenter from "./UpdateEmailPresenter";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import api from "../../../api/services/api";
// import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function UpdateEmailContainer() {
  const user = useSelector((state: RootState) => state.auth.user);
//   const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  if (!user) return null;

  // const navigate = useNavigate()

  const [hasReceivedOtp, setHasReceivedOtp] = useState(false);
  const [hasReceiveNewOtp, setHasReceiveNewOtp] = useState(false)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isOtpValid, setIsOtpValid] = useState(false);

  
    const requestEmailResetToken = async () => {
        setLoading(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append("email", user.email);

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
            resendFormData.append("email", user.email);
            setHasReceivedOtp(true);
            }
        } catch (error: any) {
            console.error("Email reset error:", error);
            setError(
            error.response?.data?.error ||
                error.response?.data?.message ||
                "Failed to request email reset."
            );
        } finally {
            setLoading(false);
        }
    };


  useEffect(() => {
    requestEmailResetToken();
  }, []);

  const handleResendOtp = async () => {
    try {
        const formData = new FormData();
        formData.append("name", user.name);
        formData.append("email", user.email);

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
    } catch (error) {
        console.error("Resend OTP error:", error);
    }
  }

  const validateOtp = async (emailToken: string) => {
    setLoading(true);
    setError("");

    try {
        const formData = new FormData();
        formData.append("token", emailToken);
        formData.append("email", user.email);

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
    } catch (error: any) {
        console.error("OTP validation error:", error);
        setError(
        error.response?.data?.error ||
        error.response?.data?.Error ||
        error.response?.data?.message ||
        "Invalid or expired OTP. Please try again."
        );
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
  } catch (error: any) {
    console.error("Email reset error:", error);
    setError(
      error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to update email."
    );
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
    formData.append("uid", user.id.toString());
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
  } catch (error: any) {
    console.error("Confirm email error:", error);
    console.error("Error response data:", error.response?.data);

    setError(
      error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to confirm new email."
    );
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
