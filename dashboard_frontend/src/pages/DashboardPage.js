import React, { useEffect, useState } from "react";
import { listDashboardConfigs } from "../api";
import DashboardWidget from "../components/DashboardWidget";
import ChartWidget from "../components/ChartWidget";
import DataTable from "../components/DataTable";
import InfoCard from "../components/InfoCard";

/**
 * PUBLIC_INTERFACE
 * DashboardPage shows the main leadership dashboard, KPIs and key metrics.
 * Fetches dashboard config summaries from backend.
 */
function DashboardPage() {
  const [dashboards, setDashboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simulate/top section: summary KPIs, below: charts & config list.
  useEffect(() => {
    setLoading(true);
    setError(null);
    listDashboardConfigs()
      .then(setDashboards)
      .catch((e) => setError(e?.message || "Error loading dashboards"))
      .finally(() => setLoading(false));
  }, []);

  // Dashboard summary KPIs stub (replace with live KPIs)
  const kpiStub = [
    { label: "Total Reports", value: dashboards?.length ?? "-" },
    { label: "Top Perf. Score", value: 95 },
    { label: "Updated", value: "Today" }
  ];

  return (
    <div className="page-content">
      <h1 className="section-title">Dashboard</h1>
      <div className="section-description">
        View leadership KPIs, metrics, analytics & executive insight summaries.
      </div>
      <div style={{ display: "flex", gap: 36, flexWrap: "wrap", margin: "0 0 26px 0" }}>
        {kpiStub.map(kpi =>
          <DashboardWidget key={kpi.label} title={kpi.label}>
            <span style={{ fontSize: 32, fontWeight: 700, color: "var(--accent, #fee715)" }}>{kpi.value}</span>
          </DashboardWidget>
        )}
      </div>
      <ChartWidget title="KPI Trends">
        <div style={{
          width: "100%",
          height: 120,
          background: "linear-gradient(90deg,#292,#393 45%,#226)",
          borderRadius: 8,
          opacity: 0.3,
          margin: "8px 0"
        }}>[Chart visualization stub]</div>
      </ChartWidget>
      <InfoCard title="Available Dashboards" description="Shows list of configured dashboards for SLT.">
        <p>
          {loading && <span>Loading dashboards...</span>}
          {error && <span style={{ color: "red" }}>Error: {error}</span>}
        </p>
        {!loading && !error && (
          dashboards.length > 0 ? (
            <DataTable
              columns={[
                { title: "Title", key: "title" },
                { title: "Dashboard ID", key: "dashboard_id" }
              ]}
              data={dashboards}
            />
          ) : (
            <div style={{ color: "#777" }}>(No dashboards found)</div>
          )
        )}
      </InfoCard>
    </div>
  );
}

export default DashboardPage;
