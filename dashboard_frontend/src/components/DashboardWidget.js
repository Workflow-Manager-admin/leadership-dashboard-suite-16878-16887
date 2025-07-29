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
        border: "1.7px solid var(--border-color)",
        borderRadius: 13,
        padding: "18px 24px",
        margin: "14px 0",
        background: "var(--background-tertiary)",
        minWidth: 220,
        maxWidth: 440,
        boxShadow: "var(--shadow)",
        fontFamily: "var(--font-main)",
      }}>
      <div style={{ fontWeight: 700, fontSize: "1.16rem", marginBottom: 10, color: "var(--accent)" }}>
        {title || "[Widget Title]"}
      </div>
      <div>
        {children || <div>[Stub Widget Content]</div>}
      </div>
    </section>
  );
}

export default DashboardWidget;
