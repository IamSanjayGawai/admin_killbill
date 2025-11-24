import React from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const token = localStorage.getItem("adminToken");

  // If no token → redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Else allow access
  return children;
};

export default ProtectedRoute;


