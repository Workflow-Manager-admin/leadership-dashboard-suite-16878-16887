import React, { useEffect, useState } from "react";
import { listTemplates } from "../api";

/**
 * PUBLIC_INTERFACE
 * TemplatesPage handles dashboard template creation and management.
 * Fetches list of templates from backend and displays them.
 */
function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    listTemplates()
      .then((data) => setTemplates(data))
      .catch((e) => setError(e?.message || "Error loading templates"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-content">
      <h1>Templates</h1>
      {loading && <p>Loading templates...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {!loading && !error && (
        <div>
          {templates.length === 0 ? (
            <div style={{ color: "#777" }}>(No templates found)</div>
          ) : (
            <ul>
              {templates.map((tpl) => (
                <li key={tpl.template_id}>
                  <strong>{tpl.name || tpl.template_id}</strong>
                  <span style={{ marginLeft: 10, fontSize: 13, color: "#888" }}>
                    (ID: {tpl.template_id})
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <p style={{ color: "#777" }}>
        Download, manage, and reuse dashboard templates.
      </p>
    </div>
  );
}

export default TemplatesPage;
