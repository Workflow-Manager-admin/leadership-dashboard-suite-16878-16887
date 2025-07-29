import React, { useState } from "react";
import "./TopBar.css";
import { useAuth } from "../auth";

/**
 * PUBLIC_INTERFACE
 * TopBar component at the top of the main panel.
 * Shows account info and logout if authenticated, plus global actions.
 */
function TopBar({ title }) {
  const { user, logout, projects, teams, token } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="topbar">
      <div className="topbar-title">{title || "Dashboard"}</div>
      <div className="topbar-actions" style={{ position: "relative" }}>
        {/* Global buttons can be added here */}
        {user && token && (
          <div
            style={{ display: "flex", alignItems: "center", cursor: "pointer", position: "relative" }}
            onClick={() => setDropdownOpen((v) => !v)}
            tabIndex={0}
            onBlur={() => setTimeout(() => setDropdownOpen(false), 80)}
          >
            <span
              style={{
                marginRight: 9,
                fontWeight: 500,
                color: "var(--primary)",
                letterSpacing: 0.01,
              }}
            >
              {user.full_name ? user.full_name : user.email}
            </span>
            <span
              style={{
                background: "#f0b65b",
                color: "#fff",
                fontSize: 18,
                borderRadius: "50%",
                width: 34,
                height: 34,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                border: "1px solid #eee",
                letterSpacing: "2px",
              }}
              title={user.email}
            >
              {user.full_name
                ? user.full_name.charAt(0).toUpperCase()
                : (user.email || "#")[0]}
            </span>
            <span style={{ marginLeft: 7, fontSize: 16, color: "#444" }}>▼</span>
            {dropdownOpen && (
              <div
                style={{
                  position: "absolute",
                  top: 37,
                  right: 0,
                  background: "var(--bg-primary,#fff)",
                  border: "1px solid var(--border-color,#e2e7f3)",
                  borderRadius: 7,
                  minWidth: 200,
                  padding: "5px 0",
                  zIndex: 10,
                  boxShadow: "0 4px 24px rgba(22,40,82,0.13)",
                }}
              >
                <div style={{ padding: "9px 18px", borderBottom: "1px solid #eee", fontSize: 17, color: "var(--primary)" }}>
                  {user.full_name || user.email}
                </div>
                <div style={{ padding: "8px 18px", color: "#666", fontSize: 15 }}>
                  <div>
                    <span style={{ fontWeight: 500 }}>Email:</span> {user.email}
                  </div>
                  <div>
                    <span style={{ fontWeight: 500 }}>Teams:</span>{" "}
                    {teams.length ? teams.map((t) => t.name).join(", ") : "(none)"}
                  </div>
                  <div>
                    <span style={{ fontWeight: 500 }}>Projects:</span>{" "}
                    {projects.length
                      ? projects.map((p) => p.name).join(", ")
                      : "(none)"}
                  </div>
                </div>
                <button
                  style={{
                    margin: "12px 18px 5px 18px",
                    padding: "8px 12px",
                    background: "#f76a6a",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    fontWeight: 600,
                    width: "calc(100% - 36px)",
                  }}
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default TopBar;
