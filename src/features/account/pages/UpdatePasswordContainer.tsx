import { useCallback, useEffect, useState } from "react"
import UpdatePasswordPresenter from "./UpdatePasswordPresenter"
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import api from "../../../api/services/api";
// import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getErrorMessage = (error: unknown, fallback: string) => {
    if (error && typeof error === "object" && "response" in error) {
        const response = (error as { response?: { data?: { error?: string; message?: string; Error?: string } } }).response;
        return response?.data?.error || response?.data?.message || response?.data?.Error || fallback;
    }

    if (error instanceof Error) {
        return error.message || fallback;
    }

    return fallback;
};

function UpdatePasswordContainer() {
    const user = useSelector((state: RootState) => state.auth.user);

    const [hasReceivedOtp, setHasReceivedOtp] = useState(false)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isOtpValid, setIsOtpValid] = useState(false);

    // const navigate = useNavigate()

    const requestPasswordResetToken = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            if (!user?.email) {
                throw new Error("User email is not available.");
            }

            const formData = new FormData();
            formData.append("email", user.email);

            const response = await api.post(
            `${API_BASE_URL}/users/reset_password/`,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
            );

            if (response.status >= 200 && response.status < 300) {
                setHasReceivedOtp(true);
            } else {
                console.warn("Unexpected status code:", response.status);
            }
        } catch (error: unknown) {
            console.error("Email reset error:", error);
            setError(getErrorMessage(error, "Failed to request password reset."));
        } finally {
            setLoading(false);
        }
    }, [user?.email]);

    useEffect(() => {
        void requestPasswordResetToken();
    }, [requestPasswordResetToken]);

    const handleResendOtp = async () => {
        try {
            if (!user || !user.name || !user.email) {
                setError("User information is not available.");
                return;
            }
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
    
    const validateOtp = async (passwordToken: string) => {
        setLoading(true);
        setError("");

        try {
            if (!user || !user.email) {
                setError("User email is not available.");
                setLoading(false);
                return;
            }
            const formData = new FormData();
            formData.append("token", passwordToken);
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
        } catch (error: unknown) {
            console.error("OTP validation error:", error);
            setError(getErrorMessage(error, "Invalid or expired OTP. Please try again."));
        } finally {
            setLoading(false);
        }
    };
    
    const handleConfirmPassword = async (
      userNewPassword: string
    ) => {
      setLoading(true);
      setError("");
    
      try {
        if (!user || !user.id) {
          setError("User information is not available.");
          setLoading(false);
          return;
        }
        const formData = new FormData();
        formData.append("email", user.email);
        formData.append("new_password", userNewPassword);
    
    
        const res = await api.post(
          `${API_BASE_URL}/users/set_new_password/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
    
        if (res.status === 204) {
          console.log("Email updated successfully!");
          // setTimeout(() => {
          //   navigate("/account/security");
          // }, 3000)
        } else {
          setError("Unexpected response from server.");
        }
      } catch (error: unknown) {
        console.error("Confirm email error:", error);
        console.error("Error response data:", (error as { response?: { data?: unknown } })?.response?.data);

        setError(getErrorMessage(error, "Failed to confirm new email."));
      } finally {
        setLoading(false);
      }
    };

    return (
        <div>
            <UpdatePasswordPresenter
            hasReceivedOtp={hasReceivedOtp}
            setHasReceivedOtp={setHasReceivedOtp}
            isOtpValid={isOtpValid}
            handleResendOtp={handleResendOtp}
            validateOtp={validateOtp}
            handleConfirmPassword={handleConfirmPassword}
            loading={loading}
            error={error}
            />
        </div>
    )
}
export default UpdatePasswordContainer
