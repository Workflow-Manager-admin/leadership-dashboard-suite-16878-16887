import React from "react";
import { useAuth } from "../../auth/AuthProvider";

/**
 * PUBLIC_INTERFACE
 * ProfilePage - shows basic user info/JWT claims.
 */
function ProfilePage() {
  const { user } = useAuth();
  if (!user) return <div className="page-content">Not signed in.</div>;

  return (
    <div className="page-content" style={{ maxWidth: 520, margin: "54px auto" }}>
      <h1 className="section-title">My Profile</h1>
      <div style={{ margin: "24px 0", background: "var(--background-tertiary)", padding: 32, borderRadius: 12, border: "1.5px solid var(--border-color)", fontSize: 16 }}>
        <div><b>Username:</b> {user.username || user.sub}</div>
        {user.email && <div><b>Email:</b> {user.email}</div>}
        {user.role && <div><b>Role:</b> {user.role}</div>}
        <div><b>Issued At:</b> {user.iat ? new Date(user.iat * 1000).toLocaleString() : "[n/a]"}</div>
        <div><b>Expires:</b> {user.exp ? new Date(user.exp * 1000).toLocaleString() : "[n/a]"}</div>
      </div>
    </div>
  );
}
export default ProfilePage;
