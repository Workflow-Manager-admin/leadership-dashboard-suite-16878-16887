import React from "react";
import "./Sidebar.css";

// PUBLIC_INTERFACE
function Sidebar({ active, setActive }) {
  const NAVS = [
    { key: "dashboard", label: "Dashboard" },
    { key: "folders", label: "Folders" },
    { key: "tagging", label: "Tagging" },
    { key: "kpis", label: "KPIs" },
    { key: "templates", label: "Templates" },
    { key: "export", label: "Export" },
    { key: "scheduling", label: "Scheduling" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="logo">SLT</span>
      </div>
      <nav>
        {NAVS.map(nav => (
          <button
            key={nav.key}
            className={nav.key === active ? "active" : ""}
            onClick={() => setActive(nav.key)}
            aria-label={nav.label}
          >
            {nav.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
