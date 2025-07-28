import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

/**
 * PUBLIC_INTERFACE
 * Sidebar component for main navigation.
 * Provides navigation links to major dashboard sections.
 */
function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="logo-circle">SLT</span>
        <span className="sidebar-title">Leadership Dashboard</span>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/" end className="sidebar-link">
          <span role="img" aria-label="Dashboard">📊</span> Dashboard
        </NavLink>
        <NavLink to="/ingestion" className="sidebar-link">
          <span role="img" aria-label="Ingestion">📁</span> Ingestion
        </NavLink>
        <NavLink to="/templates" className="sidebar-link">
          <span role="img" aria-label="Templates">📑</span> Templates
        </NavLink>
        <NavLink to="/scheduling" className="sidebar-link">
          <span role="img" aria-label="Scheduling">⏰</span> Scheduling
        </NavLink>
        <NavLink to="/settings" className="sidebar-link">
          <span role="img" aria-label="Settings">⚙️</span> Settings
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
