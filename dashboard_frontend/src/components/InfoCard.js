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
      border: "1.5px solid var(--border-color)",
      borderRadius: 12,
      padding: "18px 18px 14px 18px",
      margin: "14px 0",
      color: "var(--text-primary)",
      boxShadow: "0 2px 10px 0 #00000013"
    }}>
      {title && <div style={{ fontWeight: 600, fontSize: 17, marginBottom: 3, color: "var(--accent)" }}>{title}</div>}
      {description && <div style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 8 }}>{description}</div>}
      <div>{children}</div>
    </div>
  );
}

export default InfoCard;
