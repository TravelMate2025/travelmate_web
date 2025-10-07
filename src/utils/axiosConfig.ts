import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://travelmate-backend-0suw.onrender.com/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token expired and this is the first retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          // Try refreshing access token
          const res = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL || "https://travelmate-backend-0suw.onrender.com/"}auth/token/refresh/`,
            { refresh: refreshToken },
            { withCredentials: true }
          );

          const newAccessToken = res.data.access;
          localStorage.setItem("accessToken", newAccessToken);

          // Update header and retry original request
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return instance(originalRequest);
        } catch (refreshError) {
          console.error("🔒 Token refresh failed:", refreshError);
          // optional: clear storage and redirect to login
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login"; 
        }
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
