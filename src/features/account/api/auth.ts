import axios from "axios";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const submitEmail = async (email: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/registration_with_otp/submit_email/`, { email });
    return response.data;
  } catch (error: any) {
    console.error("❌ Error submitting email:", error.response?.data || error.message);
    throw error;
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
  } catch (error: any) {
    console.error("Error response:", error.response?.data);
    return { success: false, error: error.response?.data || error.message };
  }
};



export const resendCode = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/registration_with_otp/resend_code/`);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(`Error: ${error.response.data.error || "Something went wrong."}`);
      } else if (error.request) {
        throw new Error("No response received from the server.");
      } else {
        throw new Error(`Error: ${error.message}`);
      }
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }
};




export const createPassword = async (email: string, password: string) => {
  const payload = { email, password };

  try {
    const response = await axios.post(`${API_BASE_URL}/registration_with_otp/set_password/`,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error: any) {
    console.error("Password creation failed. Request payload:", payload);
    console.error("Error response:", error.response?.data || error.message);
    return { Status: 400, Error: true, Message: error.response?.data?.Message || error.message };
  }
};





export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/jwt/validate-password/`, {
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    console.error("❌ Login Error:", error.response?.data || error.message);
    throw error;
  }
};





// Corrected logoutUser function
export const logoutUser = async (accessToken: string) => {
  try {
    ("📤 Initiating logout request...");
   await axios.post(
      `${API_BASE_URL}/users/logout/`,
      {}, // empty body
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  } catch (error: any) {
    if (error.response) {
      console.error("❌ Logout request failed", error.response.status, error.response.data);
    } else if (error.request) {
      console.error("📭 No response received:", error.request);
    } else {
      console.error("🚨 Logout error:", error.message);
    }
    throw new Error("Logout failed. Check network and CORS settings.");
  }
};




export const refreshToken = async (access: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/jwt/token/refresh`, {
      access,
    });
    return response.data;

  } catch (error: any) {
    console.error("❌ Login Error:", error.response?.data || error.message);
    throw error;
  }
};


export const socialGoogleLogin = async (access_token: string) => {
  const response = await axios.post(`${API_BASE_URL}/auth/social/google/`, {
    access_token: access_token,
  }, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

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





// Password Reset API functions using Axios
export const requestPasswordReset = async (email: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/users/reset_password/`,
      { email },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.detail || 'Failed to send reset email'
      );
    }
    throw new Error('Failed to send reset email');
  }
};

export const validateResetToken = async (email: string, token: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/users/validate_reset_token/`,
      { email, token },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.Message || 'Invalid token'
      );
    }
    throw new Error('Invalid token');
  }
};

export const setNewPassword = async (email: string, new_password: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/users/set_new_password/`,
      { email, new_password },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    // For 204 No Content responses, axios returns null for data
    return response.status === 204 ? { success: true } : response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.Message || 'Failed to set new password'
      );
    }
    throw new Error('Failed to set new password');
  }
};