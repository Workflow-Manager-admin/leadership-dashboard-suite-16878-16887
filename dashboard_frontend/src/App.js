import React, { useState, useEffect } from "react";
import "./App.css";
import "./components/Sidebar.css";
import "./components/Topbar.css";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./pages/Dashboard";
import Folders from "./pages/Folders";
import Tagging from "./pages/Tagging";
import KPIs from "./pages/KPIs";
import Templates from "./pages/Templates";
import Export from "./pages/Export";
import Scheduling from "./pages/Scheduling";

/**
 * Main Leadership Dashboard Suite application layout.
 * - Sidebar for navigation.
 * - Topbar with filters, export, theme switch.
 * - Main area renders page based on sidebar selection.
 */
// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState("light");
  const [active, setActive] = useState("dashboard");
  const [filters, setFilters] = useState({
    date_from: "",
    date_to: "",
    project: "",
    team: ""
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  function handleFilterChange(key, value) {
    setFilters(f => ({
      ...f,
      [key]: value,
    }));
  }

  function handleExport(type) {
    // Open the Export panel for better UX, but for simplicity just render Export page
    setActive("export");
  }

  let Main = {
    dashboard: <Dashboard filters={filters} />,
    folders: <Folders />,
    tagging: <Tagging />,
    kpis: <KPIs />,
    templates: <Templates />,
    export: <Export />,
    scheduling: <Scheduling />,
  }[active];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Sidebar active={active} setActive={setActive} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Topbar
          theme={theme}
          onToggleTheme={() => setTheme(t => t === "light" ? "dark" : "light")}
          filters={filters}
          onChangeFilter={handleFilterChange}
          onExport={handleExport}
        />
        <main className="main-content" style={{ padding: "36px 32px" }}>
          {Main}
        </main>
      </div>
    </div>
  );
}

export default App;
