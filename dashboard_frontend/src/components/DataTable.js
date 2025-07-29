import React from "react";

/**
 * PUBLIC_INTERFACE
 * DataTable — reusable table component for displaying tabular data in data/config/templates/settings sections.
 * Props:
 *   - columns: array of { title: string, key: string }
 *   - data: array of objects (each representing a row)
 */
function DataTable({ columns, data }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        margin: "10px 0 28px 0",
        background: "var(--background-tertiary)",
        borderRadius: 9,
        border: "1px solid var(--border-color)"
      }}>
        <thead>
          <tr>
            {columns.map(col =>
              <th key={col.key}
                style={{
                  textAlign: "left",
                  color: "var(--accent, #fee715)",
                  padding: "10px 14px 6px 14px",
                  background: "var(--background-secondary)",
                  fontWeight: 700,
                  fontSize: "1rem"
                }}>{col.title}</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? data.map((row, i) => (
            <tr key={i} style={{ borderBottom: "1px solid var(--border-color)" }}>
              {columns.map(col => (
                <td key={col.key}
                  style={{
                    padding: "9px 14px",
                    color: "var(--text-secondary,#e0e0e0)",
                    fontSize: "0.99rem"
                  }}>
                  {row[col.key] !== undefined ? row[col.key] : <span style={{ color: "#777"}}>[?]</span>}
                </td>
              ))}
            </tr>
          )) : (
            <tr>
              <td colSpan={columns.length} style={{ padding: "13px", color: "#888" }}>
                 (No data)
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
