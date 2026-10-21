import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { toReturnPath, type ReturnPathState } from "./returnPath";

interface PrivateRouteProps {
  children: React.ReactNode;
}

// A fixed id stops duplicate toasts (StrictMode runs effects twice in development)
const AUTH_REQUIRED_TOAST_ID = "auth-required";

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const location = useLocation();
  // Read during render, cleared in the effect: the effect's closure keeps this value
  // even when it runs a second time.
  const logoutReason = token ? null : localStorage.getItem("logout_reason");

  useEffect(() => {
    if (token) return;
    if (logoutReason !== "logout" && logoutReason !== "account_deleted") {
      toast.error("You must be logged in to access that page.", { id: AUTH_REQUIRED_TOAST_ID });
    }
    localStorage.removeItem("logout_reason");
  }, [token, logoutReason]);

  if (!token) {
    const state: ReturnPathState = { from: toReturnPath(location) };
    return <Navigate to="/create-account" replace state={state} />;
  }

  return children;
};

export default PrivateRoute;
