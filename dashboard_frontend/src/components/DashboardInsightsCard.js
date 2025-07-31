import React from "react";

/**
 * PUBLIC_INTERFACE
 * DashboardInsightsCard — Visual summary card for displaying API-provided highlights/banners/insights.
 * Props:
 *   - highlights: Array of strings (insight/highlight lines)
 *   - summaryStats: Object with stat name and value
 *   - banners: Array of { title, message, level }
 */
function DashboardInsightsCard({ highlights = [], summaryStats = {}, banners = [] }) {
  return (
    <section
      style={{
        background: "var(--background-tertiary)",
        border: "2px solid var(--accent, #fee715)",
        borderRadius: 16,
        boxShadow: "0 2px 14px 0 #fee71522",
        padding: "22px 32px 18px 32px",
        marginBottom: "32px",
        color: "var(--text-primary)",
        maxWidth: 860,
        marginLeft: "auto",
        marginRight: "auto"
      }}
      aria-label="Dashboard insights and highlights"
    >
      {/* Banners: Walk-the-line notice or highlight */}
      {Array.isArray(banners) && banners.length > 0 &&
        <div style={{ marginBottom: 16, display: "flex", flexDirection: "column", gap: 3 }}>
          {banners.map((b, i) =>
            <div
              key={i}
              style={{
                background: b.level === "warning"
                  ? "linear-gradient(90deg, #feecb7 60%, #ffe0a0 100%)"
                  : b.level === "success"
                    ? "linear-gradient(90deg, #caf4d5 70%, #e9ffe6 100%)"
                    : "linear-gradient(90deg, #def 70%, #f2faff 100%)",
                padding: "9px 16px",
                borderRadius: 8,
                color: "#272700",
                fontWeight: 600,
                border: b.level === "warning"
                  ? "1.3px solid #fee715"
                  : b.level === "success"
                    ? "1.1px solid #27ae60"
                    : "1.1px solid #1989c8",
                fontSize: 15,
                marginBottom: 2
              }}
            >
              <span style={{ marginRight: 8 }}>
                {b.level === "warning" && "⚠️"}
                {b.level === "success" && "✅"}
                {b.level !== "warning" && b.level !== "success" && "💡"}
              </span>
              <span>
                <b>{b.title || "Notice"}:</b> {b.message}
              </span>
            </div>
          )}
        </div>
      }

      {/* Highlights (key findings, insights) */}
      <div>
        <div style={{
          fontWeight: 700,
          fontSize: "1.23rem",
          color: "var(--accent, #fee715)",
          marginBottom: 7
        }}>
          Executive Highlights & Insights
        </div>
        {Array.isArray(highlights) && highlights.length > 0 ? (
          <ul style={{ margin: "6px 0 0 0", padding: "0 0 0 15px", color: "var(--text-primary)" }}>
            {highlights.map((h, i) =>
              <li key={i} style={{ marginBottom: 5, fontSize: 15, fontWeight: 500 }}>{h}</li>
            )}
          </ul>
        ) : (
          <div style={{ color: "#888", fontStyle: "italic" }}>No new insights.</div>
        )}
      </div>
      <div style={{ marginTop: 20 }}>
        {summaryStats && typeof summaryStats === "object" && Object.keys(summaryStats).length > 0 && (
          <div style={{
            display: "flex",
            gap: 28,
            flexWrap: "wrap",
            justifyContent: "flex-start",
            alignItems: "center"
          }}>
            {Object.entries(summaryStats).map(([key, value], i) => (
              <div
                key={key}
                style={{
                  minWidth: 90,
                  background: "#fbfaef",
                  color: "#153070",
                  border: "1px solid #fee780bb",
                  borderRadius: 9,
                  padding: "12px 19px",
                  fontWeight: 700,
                  fontSize: 22,
                }}
              >
                <div style={{ fontWeight: 400, fontSize: 13, color: "#31372c", marginBottom: 2 }}>{key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</div>
                {value}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default DashboardInsightsCard;

