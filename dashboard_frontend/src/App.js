import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import "./App.css";
import DashboardPage from "./pages/DashboardPage";
import IngestionPage from "./pages/IngestionPage";
import TemplatesPage from "./pages/TemplatesPage";
import SettingsPage from "./pages/SettingsPage";
import SchedulePage from "./pages/SchedulePage";
import ManualTaggingPage from "./pages/ManualTaggingPage";
import RuleManagementPage from "./pages/RuleManagementPage";

// All menu items/sections for sidebar navigation
// Keys: dashboard, mapping, tagging, rules, kpi, filters, templates, export, insights, scheduling, settings
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
  { name: "Settings", key: "settings", icon: "⚙️"}
];

/**
 * PUBLIC_INTERFACE
 * Main App — root: sidebar (left), main content (right), dark/light mode, section switching.
 * Connects each navigation menu to its page/component.
 */
function App() {
  // Theme state: dark by default (persist with localStorage if desired)
  const [theme, setTheme] = useState(() =>
    window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const [menu, setMenu] = useState("dashboard");

  // Map section keys to UI pages/components (stubbed for not-yet-implemented ones)
  function renderSection() {
    switch (menu) {
      case "dashboard":
        return <DashboardPage />;
      case "mapping":
        // Folder Mapping falls under Ingestion/Data Config
        return <IngestionPage />;
      case "tagging":
        return <ManualTaggingPage />;
      case "rules":
        return <RuleManagementPage />;
      case "kpi":
        return <div className="page-content"><h1 className="section-title">Custom KPI & Charts</h1><p>[Stub: custom KPI, chart, analytics management UI]</p></div>;
      case "filters":
        return <div className="page-content"><h1 className="section-title">Filters</h1><p>[Stub: configure dashboard filters — date, team, project]</p></div>;
      case "templates":
        return <TemplatesPage />;
      case "export":
        return <div className="page-content"><h1 className="section-title">Export</h1><p>[Stub: export dashboard as PDF, PPT, or HTML]</p></div>;
      case "insights":
        return <div className="page-content"><h1 className="section-title">Insights</h1><p>[Stub: summary insights, highlights, explanations]</p></div>;
      case "scheduling":
        return <SchedulePage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  }

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  // Responsive: sidebar + main
  return (
    <div className="App" style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar
        menus={menuList}
        selected={menu}
        onMenuSelect={setMenu}
      />
      <div
        style={{
          flex: 1,
          marginLeft: 224,
          minHeight: "100vh",
          background: "var(--background)",
          transition: "margin 0.2s"
        }}
      >
        {/* TopBar removed; theme switch goes here */}
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
          {renderSection()}
        </main>
      </div>
    </div>
  );
}

export default App;
