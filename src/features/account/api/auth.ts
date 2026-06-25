import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type ApiErrorPayload = {
  error?: string;
  detail?: string;
  Message?: string;
  message?: string;
};

const toErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorPayload | string | undefined;

    if (typeof data === "string") return data;
    return (
      data?.error ||
      data?.detail ||
      data?.Message ||
      data?.message ||
      error.message
    );
  }

  return error instanceof Error ? error.message : String(error);
};

export const submitEmail = async (email: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/registration_with_otp/submit_email/`,
      { email }
    );
    return response.data;
  } catch (error: unknown) {
    const msg = toErrorMessage(error);
    console.error("❌ Error submitting email:", msg);
    throw new Error(msg);
  }
};

export const verifyCode = async (email: string, otp: string) => {
  if (!email || !otp) {
    return { success: false, error: "Email and OTP are required." };
  }

  try {
    const response = await axios.post(
      `${API_BASE_URL}/registration_with_otp/verify_otp/`,
      { email, otp },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error: unknown) {
    const msg = toErrorMessage(error);
    console.error("Error response:", msg);
    return { success: false, error: msg };
  }
};

export const resendCode = async (email: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/registration_with_otp/resend_otp/`,
      { email }
    );
    return response.data;
  } catch (error: unknown) {
    const msg = toErrorMessage(error);
    throw new Error(Array.isArray(msg) ? msg[0] : msg);
  }
};

export const createPassword = async (email: string, password: string) => {
  const payload = { email, password };

  try {
    const response = await axios.post(
      `${API_BASE_URL}/registration_with_otp/set_password/`,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error: unknown) {
    const msg = toErrorMessage(error);
    console.error("Password creation failed. Request payload:", payload);
    console.error("Error response:", msg);
    return {
      Status: 400,
      Error: true,
      Message: msg,
    };
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/jwt/validate-password/`,
      {
        email,
        password,
      }
    );
    return response.data;
  } catch (error: unknown) {
    const msg = toErrorMessage(error);
    console.error("❌ Login Error:", msg);
    throw new Error(msg);
  }
};

export const logoutUser = async (accessToken: string) => {
  try {
    console.debug("📤 Initiating logout request...");
    await axios.post(
      `${API_BASE_URL}/users/logout/`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  } catch (error: unknown) {
    const msg = toErrorMessage(error);
    console.error("Logout failed:", msg);
    throw new Error("Logout failed. Check network and CORS settings.");
  }
};

export const refreshToken = async (refresh: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/jwt/token/refresh/`, {
      refresh,
    });
    return response.data;
  } catch (error: unknown) {
    const msg = toErrorMessage(error);
    console.error("❌ Token refresh error:", msg);
    throw new Error(msg);
  }
};

export const socialGoogleLogin = async (access_token: string) => {
  const response = await axios.post(
    `${API_BASE_URL}/auth/social/google/`,
    {
      access_token,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

export const socialFacebookLogin = async (access_token: string) => {
  const response = await axios.post(
    `${API_BASE_URL}/auth/social/facebook/`,
    { access_token },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

export const requestPasswordReset = async (email: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/users/reset_password/`,
      { email },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    const msg = toErrorMessage(error);
    throw new Error(msg || "Failed to send reset email");
  }
};

export const validateResetToken = async (email: string, token: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/users/validate-reset-token/`,
      { email, token },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    const msg = toErrorMessage(error);
    throw new Error(msg || "Invalid token");
  }
};

export const setNewPassword = async (email: string, new_password: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/users/set_new_password/`,
      { email, new_password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.status === 204 ? { success: true } : response.data;
  } catch (error: unknown) {
    const msg = toErrorMessage(error);
    throw new Error(msg || "Failed to set new password");
  }
};
