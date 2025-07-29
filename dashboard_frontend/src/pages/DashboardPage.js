import React, { useEffect, useState } from "react";
import { listDashboardConfigs, saveDashboardConfig } from "../api";
import DashboardWidget from "../components/DashboardWidget";
import ChartWidget from "../components/ChartWidget";
import DataTable from "../components/DataTable";
import InfoCard from "../components/InfoCard";
import ConfigForm from "../components/ConfigForm";

/**
 * PUBLIC_INTERFACE
 * DashboardPage shows the main leadership dashboard, KPIs and key metrics.
 * Fetches dashboard config summaries from backend.
 * Allows creation of new dashboards.
 */
function DashboardPage() {
  const [dashboards, setDashboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dashboard creation state
  const [formFields, setFormFields] = useState({
    dashboard_id: "",
    title: "",
    // config: {}
  });
  const [creating, setCreating] = useState(false);
  const [createMsg, setCreateMsg] = useState(null);

  // Refresh dashboards
  function fetchDashboards() {
    setLoading(true);
    setError(null);
    listDashboardConfigs()
      .then(setDashboards)
      .catch((e) => setError(e?.message || "Error loading dashboards"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchDashboards();
  }, []);

  // Dashboard summary KPIs stub (replace with live KPIs if available)
  const kpiStub = [
    { label: "Total Reports", value: dashboards?.length ?? "-" },
    { label: "Top Perf. Score", value: dashboards && dashboards.length > 0 ? "95" : "-" },
    { label: "Updated", value: "Today" }
  ];

  // Handle form field changes for dashboard creation
  function handleFieldChange(name, value) {
    setFormFields(f => ({ ...f, [name]: value }));
  }

  // Create a new dashboard config (minimal stub config)
  async function handleCreateDashboard(e) {
    e.preventDefault();
    if (!formFields.dashboard_id || !formFields.title) {
      setCreateMsg({ type: "error", msg: "Both ID and Title required"});
      return;
    }
    setCreating(true);
    setCreateMsg(null);
    try {
      // config can be expanded; currently save minimal
      await saveDashboardConfig({
        dashboard_id: formFields.dashboard_id,
        config: { title: formFields.title }
      });
      setCreateMsg({ type: "success", msg: "Dashboard created!" });
      setFormFields({ dashboard_id: "", title: "" });
      fetchDashboards();
    } catch (e) {
      setCreateMsg({ type: "error", msg: e?.message || "Failed to create" });
    } finally {
      setCreating(false);
    }
  }

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
      <InfoCard
        title="Available Dashboards"
        description="Shows list of configured dashboards for SLT."
      >
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
      <InfoCard
        title="Create Dashboard"
        description="Quickly add a new dashboard configuration"
      >
        <ConfigForm
          fields={[
            { label: "Dashboard ID", name: "dashboard_id", value: formFields.dashboard_id, type: "text" },
            { label: "Title", name: "title", value: formFields.title, type: "text" }
          ]}
          onChange={handleFieldChange}
          onSubmit={handleCreateDashboard}
          submitLabel={creating ? "Creating..." : "Create Dashboard"}
          disabled={creating}
        />
        {createMsg && (
          <div style={{
            color: createMsg.type === "error" ? "red" : "#08a408",
            fontSize: 15, margin: "7px 0 0 2px"
          }}>
            {createMsg.msg}
          </div>
        )}
      </InfoCard>
    </div>
  );
}

export default DashboardPage;
