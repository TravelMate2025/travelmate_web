import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "../store";

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    const logoutReason = localStorage.getItem("logout_reason");

    if (!token) {
      // Only show the toast if logout wasn't intentional
      if (logoutReason !== "logout" && logoutReason !== "account_deleted") {
        toast.error("You must be logged in to access that page.");
      }
      localStorage.removeItem("logout_reason");
      setShouldRedirect(true);
    }
  }, [token]);


  if (shouldRedirect) {
    return <Navigate to="/create-account" replace />;
  }

  if (!token) return null; 

  return children;
};

export default PrivateRoute;
