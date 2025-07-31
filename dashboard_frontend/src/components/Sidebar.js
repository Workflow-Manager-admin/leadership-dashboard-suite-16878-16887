import React from "react";

/**
 * PUBLIC_INTERFACE
 * Sidebar — persistent navigation and settings sidebar for dashboard UI.
 * Props:
 *   - menus: array of { name: string, key: string, icon?: ReactNode }
 *   - selected: string (menu key)
 *   - onMenuSelect: (key: string) => void
 */
import { useAuth } from "../auth/AuthProvider";
import { Link, useNavigate } from "react-router-dom";

function Sidebar({ menus, selected, onMenuSelect }) {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <aside
      className="sidebar-nav"
      style={{
        width: 224,
        background: "var(--background-tertiary)",
        borderRight: "2.6px solid var(--border-color)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "22px 0 0 0",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 30,
        boxShadow: "1.5px 0 14px 0 rgba(15,19,25,0.04)"
      }}
    >
      <div
        style={{
          color: "var(--primary)",
          fontWeight: 800,
          fontSize: "1.38rem",
          letterSpacing: "0.03em",
          marginLeft: 34,
          marginBottom: 34
        }}
      >
        <span style={{ color: "var(--accent)" }}>SLT</span> Dashboard
      </div>
      <nav
        aria-label="Sidebar navigation"
        style={{
          flex: "1",
        }}
      >
        <ul style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: 3
        }}>
          {menus.map(menu => (
            <li key={menu.key}>
              <button
                className={
                  selected === menu.key
                    ? "sidebar-menuitem sidebar-menuitem-selected"
                    : "sidebar-menuitem"
                }
                aria-current={selected === menu.key ? "page" : undefined}
                aria-label={menu.name}
                onClick={() => onMenuSelect(menu.key)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "11px 34px 11px 28px",
                  fontWeight: 600,
                  fontSize: "1.06rem",
                  letterSpacing: ".01em",
                  background: selected === menu.key
                    ? "var(--background-secondary)"
                    : "transparent",
                  color: selected === menu.key
                    ? "var(--accent)"
                    : "var(--text-secondary)",
                  border: "none",
                  outline: "none",
                  borderRight: selected === menu.key
                    ? "4px solid var(--accent)"
                    : "4px solid transparent",
                  borderRadius: selected === menu.key ? "0 8px 8px 0" : "0",
                  cursor: "pointer",
                  boxShadow: selected === menu.key
                    ? "0 2px 10px -5px var(--accent)14"
                    : "none",
                  transition:
                    "background 0.19s, color 0.19s, border 0.19s"
                }}
              >
                {menu.icon && (
                  <span style={{ marginRight: 11, fontSize: 17, display: "inline-block", verticalAlign: "middle" }}>{menu.icon}</span>
                )}
                {menu.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div style={{ marginTop: "auto", marginBottom: 24, marginLeft: 28, fontSize: 13, color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: 7 }}>
        {isAuthenticated && isAuthenticated() ? (
          <>
            <div>
              <span role="img" aria-label="profile">👤</span>{" "}
              <Link to="/profile" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>{user?.username || user?.sub || "Profile"}</Link>
            </div>
            <div>
              <button
                className="btn"
                style={{ fontSize: 13, padding: "4px 16px", background: "#eee", color: "#222" }}
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
              >
                Log Out
              </button>
            </div>
            <div>
              <Link to="/account" style={{ color: "#888", fontSize: 12 }}>Account Settings</Link>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>Sign In</Link>
          </>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
