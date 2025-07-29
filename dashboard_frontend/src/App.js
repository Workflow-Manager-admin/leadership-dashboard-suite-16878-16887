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
  // Theme state: dark by default (persist with localStorage if desired)
  const [theme, setTheme] = useState(() =>
    window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"
  );

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

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <div className="App">
      <TopBar
        menus={menuList}
        selected={menu}
        onMenuSelect={setMenu}
      >
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
            padding: "9px 14px",
            fontWeight: 600,
            background: "transparent",
            border: "1.2px solid var(--border-color)",
            color: "var(--text-primary)",
            borderRadius: 22,
            boxShadow: "none",
            margin: "0 0 0 10px",
            cursor: "pointer",
            transition: "background .17s, color .17s, border .12s"
          }}
        >
          {theme === "dark" ? (
            <>
              <span style={{fontSize:22}}>☀️</span>
              Light
            </>
          ) : (
            <>
              <span style={{fontSize:20}}>🌙</span>
              Dark
            </>
          )}
        </button>
      </TopBar>
      <main className="main-panel">
        {renderSection()}
      </main>
    </div>
  );
}

export default App;
