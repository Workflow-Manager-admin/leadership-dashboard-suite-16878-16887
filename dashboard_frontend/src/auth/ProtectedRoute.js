import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

// PUBLIC_INTERFACE
// ProtectedRoute - only renders children if user is authenticated, otherwise redirects to /login
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default ProtectedRoute;
