import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./auth";
import "./App.css";

// Load pages
import DashboardPage from "./pages/DashboardPage";
import IngestionPage from "./pages/IngestionPage";
import TemplatesPage from "./pages/TemplatesPage";
import SchedulePage from "./pages/SchedulePage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

/**
 * PUBLIC_INTERFACE
 * Main App shell — flex layout with sidebar, top bar, theme toggle,
 * client-side routing to main dashboard sections, and authentication context.
 */
function App() {
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <AuthProvider>
      <Router>
        <div className="app-shell">
          <Sidebar />
          <div className="main-panel">
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? "🌙 Dark" : "☀️ Light"}
            </button>
            <TopBar />
            <main className="page-main">
              <Routes>
                {/* Auth routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Private routes require authentication */}
                <Route element={<PrivateRoute />}>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/ingestion" element={<IngestionPage />} />
                  <Route path="/templates" element={<TemplatesPage />} />
                  <Route path="/scheduling" element={<SchedulePage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Route>
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
