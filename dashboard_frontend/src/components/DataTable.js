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
        margin: "11px 0 28px 0",
        background: "var(--background-tertiary)",
        borderRadius: 10,
        border: "1.2px solid var(--border-color)",
        fontFamily: "var(--font-main)",
        fontSize: "1rem",
        overflow: "hidden"
      }}>
        <thead>
          <tr>
            {columns.map(col =>
              <th key={col.key}
                style={{
                  textAlign: "left",
                  color: "var(--accent)",
                  padding: "12px 18px 7px 18px",
                  background: "var(--background-secondary)",
                  fontWeight: 700,
                  fontSize: "1.03rem"
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
                    padding: "10px 16px",
                    color: "var(--text-secondary)",
                    fontSize: "1rem"
                  }}>
                  {row[col.key] !== undefined ? row[col.key] : <span style={{ color: "#888"}}>[?]</span>}
                </td>
              ))}
            </tr>
          )) : (
            <tr>
              <td colSpan={columns.length} style={{ padding: "16px", color: "#888", textAlign: "center" }}>
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
