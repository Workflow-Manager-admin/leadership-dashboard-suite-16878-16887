import React from "react";

/**
 * PUBLIC_INTERFACE
 * ChartWidget — generic dashboard chart widget (placeholder/stub)
 * Props:
 *   - title: string
 *   - children: chart or placeholder
 */
function ChartWidget({ title, children }) {
  return (
    <div style={{
      background: "var(--background-tertiary)",
      border: "1.5px solid var(--border-color)",
      borderRadius: 12,
      padding: 18,
      margin: "10px 0 20px 0",
      width: "100%",
      maxWidth: 620,
      minHeight: 180,
      boxShadow: "0 1.5px 7px 0 #0000000a"
    }}>
      <div style={{ fontWeight: 600, fontSize: 17, marginBottom: 8, color: "var(--accent, #fee715)" }}>{title}</div>
      <div>
        {children || <div style={{ color: "#666", fontStyle: "italic" }}>[Chart/analytics placeholder]</div>}
      </div>
    </div>
  );
}

export default ChartWidget;
