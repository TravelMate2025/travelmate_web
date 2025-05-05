import axios from 'axios';
import { getAccessToken } from '../../utils/authUtils';

const API_BASE_URL = 'https://travelmate-backend-0suw.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically add the access token
api.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    if (accessToken && config.headers) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
