// src/api/services/api.ts -- the single HTTP client for travelmate_backend.
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { logout, updateToken } from '../../features/account/slices/authSlice';

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '');

// The slice of the Redux store this client needs. It is injected from main.tsx
// rather than imported, because store -> flightApi -> api -> store is a cycle.
export type AuthStore = {
  getState: () => { auth: { accessToken: string | null; refreshToken: string | null } };
  dispatch: (action: ReturnType<typeof logout> | ReturnType<typeof updateToken>) => unknown;
};

let authStore: AuthStore | null = null;

export const injectStore = (store: AuthStore) => {
  authStore = store;
};

type RetryableRequest = InternalAxiosRequestConfig & { _retry?: boolean };

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Attach the current access token unless the caller already set one
api.interceptors.request.use((config) => {
  const accessToken = authStore?.getState().auth.accessToken;
  if (accessToken && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// One refresh at a time: parallel 401s all wait on the same request
let pendingRefresh: Promise<string> | null = null;

const refreshAccessToken = (refresh: string): Promise<string> => {
  pendingRefresh ??= axios
    .post<{ access: string }>(`${API_BASE_URL}/auth/jwt/token/refresh/`, { refresh }, { withCredentials: true })
    .then((res) => res.data.access)
    .finally(() => {
      pendingRefresh = null;
    });
  return pendingRefresh;
};

// A refresh that failed because the refresh token is expired or revoked, as
// opposed to a network error or server outage, which shouldn't end the session.
const isRejectedRefresh = (error: unknown) =>
  axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 400);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetryableRequest | undefined;
    if (error.response?.status !== 401 || !original || original._retry || !authStore) {
      return Promise.reject(error);
    }
    original._retry = true;

    const { accessToken, refreshToken } = authStore.getState().auth;
    if (refreshToken) {
      try {
        const newAccessToken = await refreshAccessToken(refreshToken);
        authStore.dispatch(updateToken(newAccessToken));
        original.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(original);
      } catch (refreshError) {
        if (!isRejectedRefresh(refreshError)) return Promise.reject(error);
      }
    }

    // The session can't be recovered. Drop it, then retry once without
    // credentials: DRF rejects a stale bearer token even on public (AllowAny)
    // endpoints, while protected ones will 401 again and PrivateRoute takes
    // the user to sign in.
    if (accessToken) authStore.dispatch(logout());
    if (original.headers.Authorization) {
      original.headers.delete('Authorization');
      return api(original);
    }
    return Promise.reject(error);
  }
);

export default api;
