import { useEffect } from "react";
import { useAuth } from "../auth";
import { Navigate } from "react-router-dom";

/**
 * PUBLIC_INTERFACE
 * Logout page automatically logs user out and redirects to login.
 */
function LogoutPage() {
  const { logout } = useAuth();
  useEffect(() => {
    logout();
  }, [logout]);
  return <Navigate to="/login" replace />;
}

export default LogoutPage;
