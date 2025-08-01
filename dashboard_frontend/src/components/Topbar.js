import React from "react";
import "./Topbar.css";

// PUBLIC_INTERFACE
function Topbar({ theme, onToggleTheme, filters, onChangeFilter, onExport }) {
  return (
    <header className="topbar">
      <div className="filters">
        <input
          type="date"
          value={filters.date_from || ""}
          onChange={e => onChangeFilter("date_from", e.target.value)}
          aria-label="Date from"
        />
        <input
          type="date"
          value={filters.date_to || ""}
          onChange={e => onChangeFilter("date_to", e.target.value)}
          aria-label="Date to"
        />
        <input
          type="text"
          placeholder="Project…"
          value={filters.project || ""}
          onChange={e => onChangeFilter("project", e.target.value)}
        />
        <input
          type="text"
          placeholder="Team…"
          value={filters.team || ""}
          onChange={e => onChangeFilter("team", e.target.value)}
        />
      </div>
      <div className="topbar-actions">
        <button onClick={() => onExport("pdf")}>Export PDF</button>
        <button onClick={() => onExport("ppt")}>Export PPT</button>
        <button onClick={() => onExport("html")}>Export HTML</button>
        <button
          className="theme-toggle-btn"
          onClick={onToggleTheme}
          aria-label="Toggle theme"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>
    </header>
  );
}

export default Topbar;
