import React, { useState, useEffect } from "react";
import TopBar from "./components/TopBar";
import "./App.css";
import DashboardPage from "./pages/DashboardPage";
import IngestionPage from "./pages/IngestionPage";
import TemplatesPage from "./pages/TemplatesPage";
import SettingsPage from "./pages/SettingsPage";

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
 * Connects each menu section to its full-featured page/component.
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
        return <DashboardPage />;
      case "data":
        return <IngestionPage />;
      case "templates":
        return <TemplatesPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <DashboardPage />;
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
