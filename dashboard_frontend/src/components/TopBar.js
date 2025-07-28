import React from "react";
import "./TopBar.css";

/**
 * PUBLIC_INTERFACE
 * TopBar component at the top of the main panel.
 * Used for global actions like filtering, exporting, etc.
 */
function TopBar({ title }) {
  return (
    <header className="topbar">
      <div className="topbar-title">{title || "Dashboard"}</div>
      <div className="topbar-actions">
        {/* Placeholder for filter/export/action buttons */}
      </div>
    </header>
  );
}

export default TopBar;
