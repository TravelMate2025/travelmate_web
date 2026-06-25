import { useCallback, useEffect, useState } from "react"
import UpdatePasswordPresenter from "./UpdatePasswordPresenter"
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import api from "../../../api/services/api";

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

    const requestPasswordResetToken = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            if (!user?.email) {
                throw new Error("User email is not available.");
            }

            const response = await api.post(
                `${API_BASE_URL}/users/reset_password/`,
                { email: user.email }
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
            if (!user?.email) {
                setError("User information is not available.");
                return;
            }

            const res = await api.post(`${API_BASE_URL}/users/resend_reset_token/`, {
                email: user.email,
            });
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

            const res = await api.post(
                `${API_BASE_URL}/users/validate-reset-token/`,
                { token: passwordToken, email: user.email }
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

    const handleConfirmPassword = async (userNewPassword: string) => {
        setLoading(true);
        setError("");

        try {
            if (!user?.email) {
                setError("User information is not available.");
                setLoading(false);
                return;
            }

            const res = await api.post(
                `${API_BASE_URL}/users/set_new_password/`,
                { email: user.email, new_password: userNewPassword }
            );

            if (res.status === 204) {
                console.log("Password updated successfully!");
            } else {
                setError("Unexpected response from server.");
            }
        } catch (error: unknown) {
            console.error("Confirm password error:", error);
            setError(getErrorMessage(error, "Failed to update password."));
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
