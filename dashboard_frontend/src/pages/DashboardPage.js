import React, { useEffect, useState } from "react";
import { listDashboardConfigs } from "../api";

/**
 * PUBLIC_INTERFACE
 * DashboardPage shows the main leadership dashboard, KPIs and key metrics.
 * Fetches dashboard config summaries from backend.
 */
function DashboardPage() {
  const [dashboards, setDashboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    listDashboardConfigs()
      .then(setDashboards)
      .catch((e) => setError(e?.message || "Error loading dashboards"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-content">
      <h1>Dashboard</h1>
      <p>
        {loading && <span>Loading dashboards...</span>}
        {error && <span style={{ color: "red" }}>Error: {error}</span>}
      </p>
      {!loading && !error && (
        dashboards.length > 0 ? (
          <ul>
            {dashboards.map((db) => (
              <li key={db.dashboard_id}>
                <strong>{db.title || db.dashboard_id}</strong>
                <span style={{ marginLeft: 13, color: "#666", fontSize: 13 }}>
                  (ID: {db.dashboard_id})
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div style={{ color: "#777" }}>(No dashboards found)</div>
        )
      )}
    </div>
  );
}

export default DashboardPage;
