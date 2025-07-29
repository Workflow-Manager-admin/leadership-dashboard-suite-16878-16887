import React from "react";

/**
 * PUBLIC_INTERFACE
 * InfoCard — simple visual card to summarize content/settings/config.
 * Props:
 *   - title: Card title
 *   - description: Card description or blurb
 *   - children: Card content
 */
function InfoCard({ title, description, children }) {
  return (
    <div style={{
      background: "var(--background-tertiary)",
      border: "1.7px solid var(--border-color)",
      borderRadius: 13,
      padding: "21px 24px 16px 24px",
      margin: "18px 0",
      color: "var(--text-primary)",
      boxShadow: "var(--shadow)"
    }}>
      {title && <div style={{ fontWeight: 700, fontSize: "1.09rem", marginBottom: 5, color: "var(--accent)" }}>{title}</div>}
      {description && <div style={{ color: "var(--text-secondary)", fontSize: 15, marginBottom: 10 }}>{description}</div>}
      <div>{children}</div>
    </div>
  );
}

export default InfoCard;
