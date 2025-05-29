// src/api/api.ts
import axios from 'axios';
import { getAccessToken } from '../../utils/authUtils';

const API_BASE_URL = 'https://travelmate-backend-0suw.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach the access token
api.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    if (accessToken && config.headers) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Redirect to login on token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      typeof window !== 'undefined'
    ) {
      console.warn('[AUTH] Access token expired. Redirecting...');
      window.location.href = '/create-account';
    }
    return Promise.reject(error);
  }
);

export default api;
