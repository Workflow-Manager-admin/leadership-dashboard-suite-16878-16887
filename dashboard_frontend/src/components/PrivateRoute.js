import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth";

/**
 * PUBLIC_INTERFACE
 * PrivateRoute restricts children to authenticated users.
 * Usage: <Route element={<PrivateRoute />}><Route ... /></Route>
 */
function PrivateRoute({ redirectTo = "/login", children }) {
  const { token, loading } = useAuth();

  if (loading) return <div style={{textAlign:"center",paddingTop:"50px"}}>Loading...</div>;
  if (!token) return <Navigate to={redirectTo} replace />;
  return children ? children : <Outlet />;
}

export default PrivateRoute;
