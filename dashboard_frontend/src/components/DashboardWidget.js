import React from "react";

/**
 * PUBLIC_INTERFACE
 * DashboardWidget for summary stats, KPI, or visual module inside dashboard.
 * Props:
 *   - title: Widget title
 *   - children: Widget content
 */
function DashboardWidget({ title, children }) {
  return (
    <section className="dashboard-widget"
      style={{
        border: "1px solid var(--border-color, #e9ecef)",
        borderRadius: 8,
        padding: 20,
        margin: "14px 0",
        background: "var(--bg-secondary, #f8f9fa)",
        minWidth: 220,
        maxWidth: 440,
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}>
      <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>
        {title || "[Widget Title]"}
      </div>
      <div>
        {children || <div>[Stub Widget Content]</div>}
      </div>
    </section>
  );
}

export default DashboardWidget;
