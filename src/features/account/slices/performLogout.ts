import { createAsyncThunk } from "@reduxjs/toolkit";
import { flightsApi } from "../../flights/api/flightApi";
import { logoutUser } from "../api/auth";
import { logout, type AuthState } from "./authSlice";

// Browser-stored data that belongs to the signed-in user. Device-level keys
// (recent searches, recently viewed, selected tab) are deliberately kept.
export const USER_STORAGE_KEYS = [
  "email",
  "verify_email",
  "google_access_token",
  "cards",
  "bookingData",
  "transferPaymentSuccess",
  "carBookingForm",
] as const;

export type LogoutReason = "logout" | "account_deleted";

type LogoutOptions = {
  reason?: LogoutReason;
  // false when the server session is already gone (e.g. the account was deleted)
  revokeSession?: boolean;
};

// The one way to end a session. Always succeeds locally: if the server can't be
// reached, the user is still signed out on this device.
export const performLogout = createAsyncThunk<void, LogoutOptions | void, { state: { auth: AuthState } }>(
  "auth/performLogout",
  async (options, { dispatch, getState }) => {
    const { reason = "logout", revokeSession = true } = options ?? {};
    const { accessToken } = getState().auth;

    if (revokeSession && accessToken) {
      try {
        await logoutUser(accessToken);
      } catch {
        // Already logged by logoutUser; the local logout below still happens
      }
    }

    USER_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
    localStorage.setItem("logout_reason", reason);

    // The root reducer resets every user-scoped slice on this action
    dispatch(logout());
    dispatch(flightsApi.util.resetApiState());
  }
);
