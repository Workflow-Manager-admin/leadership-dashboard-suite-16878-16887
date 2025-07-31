import React from "react";

/**
 * PUBLIC_INTERFACE
 * ChartWidget — dashboard chart/kpi analytics visualization container.
 * Props:
 *   - title: string
 *   - children: chart JSX or placeholder
 *   - options?: object (for chart config, passed to chart lib/etc)
 */
function ChartWidget({ title, children, options }) {
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
      {children ? (
        <div>{children}</div>
      ) : (
        <div style={{ color: "#666", fontStyle: "italic" }}>
          [Chart/analytics placeholder]
        </div>
      )}
      {/* Optionally render chart configuration info for debug:
          {options && <pre style={{ fontSize: 11, color: "#555", marginTop: 8, opacity: 0.5 }}>{JSON.stringify(options,null,2)}</pre>}
      */}
    </div>
  );
}

export default ChartWidget;
