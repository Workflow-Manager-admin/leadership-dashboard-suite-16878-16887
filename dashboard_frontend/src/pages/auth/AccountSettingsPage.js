import React from "react";
import InfoCard from "../../components/InfoCard";
import { useAuth } from "../../auth/AuthProvider";

/**
 * PUBLIC_INTERFACE
 * AccountSettingsPage — future settings/preferences for user profile.
 */
function AccountSettingsPage() {
  const { user } = useAuth();
  return (
    <div className="page-content" style={{ maxWidth: 540, margin: "40px auto" }}>
      <h1 className="section-title">Account Settings</h1>
      <InfoCard title="User Info" description="Your basic account info">
        <div>
          <div><b>Username:</b> {user?.username || user?.sub}</div>
          <div><b>Email:</b> {user?.email || <i>[not set]</i>}</div>
        </div>
      </InfoCard>
      <InfoCard title="Password & Security" description="Change your password (coming soon)">
        <div style={{ color: "#aaa" }}>[Feature not implemented]</div>
      </InfoCard>
    </div>
  );
}
export default AccountSettingsPage;
