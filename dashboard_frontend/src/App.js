import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import "./App.css";
import DashboardPage from "./pages/DashboardPage";
import IngestionPage from "./pages/IngestionPage";
import TemplatesPage from "./pages/TemplatesPage";
import SettingsPage from "./pages/SettingsPage";
import SchedulePage from "./pages/SchedulePage";
import ManualTaggingPage from "./pages/ManualTaggingPage";
import RuleManagementPage from "./pages/RuleManagementPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ProfilePage from "./pages/auth/ProfilePage";
import AccountSettingsPage from "./pages/auth/AccountSettingsPage";
import { AuthProvider, useAuth } from "./auth/AuthProvider";
import ProtectedRoute from "./auth/ProtectedRoute";

// All menu items/sections for sidebar navigation
const menuList = [
  { name: "Real-time Dashboard", key: "dashboard", icon: "📊" },
  { name: "Folder Mapping", key: "mapping", icon: "🗂️" },
  { name: "Manual Tagging", key: "tagging", icon: "🔖" },
  { name: "Rule Definition", key: "rules", icon: "⚙️" },
  { name: "Custom KPI & Charts", key: "kpi", icon: "📈" },
  { name: "Filters", key: "filters", icon: "🔍" },
  { name: "Template Management", key: "templates", icon: "📚" },
  { name: "Export", key: "export", icon: "⤓" },
  { name: "Insights", key: "insights", icon: "💡" },
  { name: "Scheduling", key: "scheduling", icon: "⏰" },
  { name: "Settings", key: "settings", icon: "⚙️"},
];

/**
 * PUBLIC_INTERFACE
 * Main App — handles router, theme, sidebar/menu selection, and top-level auth context.
 */
function AppShell() {
  const [theme, setTheme] = useState(() =>
    window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"
  );
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  const [menu, setMenu] = useState("dashboard");
  const navigate = useNavigate();

  // Changes sidebar menu, also navigates to correct route
  function handleMenuSelect(key) {
    setMenu(key);
    // Map menu keys to paths
    switch (key) {
      case "dashboard": return navigate("/");
      case "mapping": return navigate("/mapping");
      case "tagging": return navigate("/tagging");
      case "rules": return navigate("/rules");
      case "templates": return navigate("/templates");
      case "scheduling": return navigate("/scheduling");
      case "settings": return navigate("/settings");
      default: return navigate("/");
    }
  }

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <div className="App" style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar menus={menuList} selected={menu} onMenuSelect={handleMenuSelect} />
      <div
        style={{
          flex: 1,
          marginLeft: 224,
          minHeight: "100vh",
          background: "var(--background)",
          transition: "margin 0.2s"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", height: 60, borderBottom: "1px solid var(--border-color)", background: "var(--background-secondary)", paddingRight: 38, position: "sticky", top: 0, zIndex: 20 }}>
          <button
            className="btn"
            type="button"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            onClick={toggleTheme}
            style={{
              fontSize: 16,
              display: "flex",
              gap: 7,
              alignItems: "center",
              padding: "8px 16px",
              fontWeight: 600,
              background: "transparent",
              border: "1.2px solid var(--border-color)",
              color: "var(--text-primary)",
              borderRadius: 20,
              boxShadow: "none",
              margin: "0 0 0 0",
              cursor: "pointer",
              transition: "background .17s, color .17s, border .12s"
            }}
          >
            {theme === "dark" ? (
              <>
                <span style={{ fontSize: 22 }}>☀️</span>
                Light
              </>
            ) : (
              <>
                <span style={{ fontSize: 20 }}>🌙</span>
                Dark
              </>
            )}
          </button>
        </div>
        <main className="main-panel" style={{ minHeight: "calc(100vh - 60px)" }}>
          <Routes>
            {/* Auth pages (no sidebar/protected routes) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected routes */}
            <Route
              path="/"
              element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
            />
            <Route
              path="/mapping"
              element={<ProtectedRoute><IngestionPage /></ProtectedRoute>}
            />
            <Route
              path="/tagging"
              element={<ProtectedRoute><ManualTaggingPage /></ProtectedRoute>}
            />
            <Route
              path="/rules"
              element={<ProtectedRoute><RuleManagementPage /></ProtectedRoute>}
            />
            <Route
              path="/templates"
              element={<ProtectedRoute><TemplatesPage /></ProtectedRoute>}
            />
            <Route
              path="/scheduling"
              element={<ProtectedRoute><SchedulePage /></ProtectedRoute>}
            />
            <Route
              path="/settings"
              element={<ProtectedRoute><SettingsPage /></ProtectedRoute>}
            />
            <Route
              path="/profile"
              element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}
            />
            <Route
              path="/account"
              element={<ProtectedRoute><AccountSettingsPage /></ProtectedRoute>}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

// App root, wraps with AuthProvider and Router
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppShell />
      </Router>
    </AuthProvider>
  );
}

export default App;
