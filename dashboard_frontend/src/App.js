import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import "./App.css";

/**
 * Stub page components for each route.
 */
function DashboardPage() {
  return (
    <div className="page-content">
      <h2>Dashboard</h2>
      <p>Interactive dashboards, KPIs, and summary insights go here.</p>
    </div>
  );
}
function IngestionPage() {
  return (
    <div className="page-content">
      <h2>Ingestion</h2>
      <p>Folder mapping and file ingestion management.</p>
    </div>
  );
}
function TemplatesPage() {
  return (
    <div className="page-content">
      <h2>Templates</h2>
      <p>Dashboard template creation and management.</p>
    </div>
  );
}
function SchedulingPage() {
  return (
    <div className="page-content">
      <h2>Scheduling</h2>
      <p>Reporting schedule and email delivery.</p>
    </div>
  );
}
function SettingsPage() {
  return (
    <div className="page-content">
      <h2>Settings</h2>
      <p>Configuration and preferences.</p>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Main App shell — flex layout with sidebar, top bar, theme toggle,
 * and client-side routing to main dashboard sections.
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
              <Route path="/" element={<DashboardPage />} />
              <Route path="/ingestion" element={<IngestionPage />} />
              <Route path="/templates" element={<TemplatesPage />} />
              <Route path="/scheduling" element={<SchedulingPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
