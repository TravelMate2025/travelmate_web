import { useEffect, useState } from "react"
import UpdatePasswordPresenter from "./UpdatePasswordPresenter"
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import api from "../../../api/services/api";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function UpdatePasswordContainer() {
    const user = useSelector((state: RootState) => state.auth.user);

    const [hasReceivedOtp, setHasReceivedOtp] = useState(false)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isOtpValid, setIsOtpValid] = useState(false);

    const navigate = useNavigate()

    const requestPasswordResetToken = async () => {
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
        } catch (error: any) {
            console.error("Email reset error:", error);
            setError(
            error.response?.data?.error ||
                error.response?.data?.message ||
                "Failed to request password reset."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
      requestPasswordResetToken();
    }, []);

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
          setTimeout(() => {
            navigate("/account/security");
          }, 3000)
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