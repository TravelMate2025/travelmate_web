import React from "react";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "../store";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const token = useSelector((state: RootState) => state.auth.accessToken);

  if (!token) {
    const logoutReason = typeof window !== "undefined" ? localStorage.getItem("logout_reason") : null;
    if (logoutReason !== "logout" && logoutReason !== "account_deleted") {
      toast.error("You must be logged in to access that page.");
    }
    if (typeof window !== "undefined") localStorage.removeItem("logout_reason");
    return <Navigate to="/create-account" replace />;
  }

  return children;
};

export default PrivateRoute;
