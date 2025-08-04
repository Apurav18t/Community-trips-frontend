import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("access_token");

  if (!user || !token) {
    return <Navigate to="/signin" />;
  }

  return children;
};

export default ProtectedRoute;
