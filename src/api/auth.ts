import axios from "axios";

const API_BASE_URL = 'https://travelmate-backend-0suw.onrender.com'

export const submitEmail = async (email: string) => {
  try {
    console.log("📤 Submitting email to backend:", email);
    const response = await axios.post(`${API_BASE_URL}/api/registration_with_otp/submit_email/`, { email });
    console.log("✅ Backend Response:", response.data);
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
      console.log("Sending to backend:", { email, otp });
      const response = await axios.post(
        `${API_BASE_URL}/api/registration_with_otp/verify_otp/`,
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
    const response = await axios.post(`${API_BASE_URL}/api/registration_with_otp/resend_code/`);
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
  
    console.log("Sending password creation request:", payload);
  
    try {
      const response = await axios.post(`${API_BASE_URL}/api/registration_with_otp/set_password/`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
  
      console.log("Password creation response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Password creation failed. Request payload:", payload);
      console.error("Error response:", error.response?.data || error.message);
      return { Status: 400, Error: true, Message: error.response?.data?.Message || error.message };
    }
  };
  




export const loginUser = async (email: string, password: string) => {
  try {
    console.log("📤 Logging in with:", { email, password });
    const response = await axios.post(`${API_BASE_URL}/api/auth/jwt/validate-password/`, {
      email,
      password,
    });
    console.log("✅ Login Response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Login Error:", error.response?.data || error.message);
    throw error;
  }
};





// Corrected logoutUser function
export const logoutUser = async (accessToken: string): Promise<void> => {
  try {
    console.log("📤 Initiating logout request...");
    console.log("🔐 Access Token:", accessToken);

    const response = await axios.post(
      `${API_BASE_URL}/users/logout/`,
      {}, // empty body
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log("✅ Logout successful:", response.status); // Should log 204
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
        console.log("Attempting to refresh token with:", access);
        const response = await axios.post(`${API_BASE_URL}/api/auth/jwt/token/refresh`, {
            access,
        });
        console.log("Refresh token response:", response.data);
        return response.data;

    } catch (error: any) {
        console.error("❌ Login Error:", error.response?.data || error.message);
        throw error;
    }
};


export const socialGoogleLogin = async (access_token: string) => {
  const response = await axios.post(`${API_BASE_URL}/api/auth/social/google/`, {
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
    `${API_BASE_URL}/api/auth/social/facebook/`,
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
      `${API_BASE_URL}/api/users/reset_password/`,
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
      `${API_BASE_URL}/api/users/validate_reset_token/`,
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
      `${API_BASE_URL}/api/users/set_new_password/`,
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