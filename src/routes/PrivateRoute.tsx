import React from "react";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "../store";

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const token = useSelector((state: RootState) => state.auth.accessToken);

  if (!token) {
    toast.error("You must be logged in to access that page.");
    return <Navigate to="/create-account" replace />;
  }

  return children;
};

export default PrivateRoute;