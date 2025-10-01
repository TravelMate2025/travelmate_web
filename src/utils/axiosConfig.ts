import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://travelmate-backend-0suw.onrender.com/",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
  },
  withCredentials: true,
});

export default instance;
