import React, { useState, useEffect } from "react";
import TopBar from "./components/TopBar";
import "./App.css";

/**
 * Page content for each menu
 */
function DashboardSection() {
  return (
    <div>
      <h1 className="section-title">Dashboard</h1>
      <div className="section-description">Interactive KPIs, metrics, and executive summary dashboards.</div>
      <div className="data-section-card">[Dashboard analytics and charts]</div>
    </div>
  );
}
function DataConfigSection() {
  return (
    <div>
      <h1 className="section-title">Data Configuration</h1>
      <div className="section-description">Configure source folders, manage ingestion, and data mappings.</div>
      <div className="data-section-card">[Configurable folder or mapping/data UI here]</div>
    </div>
  );
}
function TemplatesSection() {
  return (
    <div>
      <h1 className="section-title">Templates</h1>
      <div className="section-description">Dashboard template library and creation tools.</div>
      <div className="data-section-card">[Templates list and management]</div>
    </div>
  );
}
function SettingsSection() {
  return (
    <div>
      <h1 className="section-title">Settings</h1>
      <div className="section-description">System, user preferences, and application settings.</div>
      <div className="data-section-card">[Settings/configure area]</div>
    </div>
  );
}

// Menu structure for nav
const menuList = [
  { name: "Dashboard", key: "dashboard" },
  { name: "Data Configuration", key: "data" },
  { name: "Templates", key: "templates" },
  { name: "Settings", key: "settings" }
];

/**
 * PUBLIC_INTERFACE
 * Main App — top bar navigation, dark theme, switches between section content.
 */
function App() {
  // Theme state: dark by default
  const [theme, setTheme] = useState("dark");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const [menu, setMenu] = useState("dashboard");

  function renderSection() {
    switch (menu) {
      case "dashboard":
        return <DashboardSection />;
      case "data":
        return <DataConfigSection />;
      case "templates":
        return <TemplatesSection />;
      case "settings":
        return <SettingsSection />;
      default:
        return <DashboardSection />;
    }
  }

  return (
    <div className="App">
      <TopBar
        menus={menuList}
        selected={menu}
        onMenuSelect={setMenu}
      >
        <button
          className="btn"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          style={{ fontSize: 16 }}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
        </button>
      </TopBar>
      <main className="main-panel">
        {renderSection()}
      </main>
    </div>
  );
}

export default App;
