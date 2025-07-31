import React, { useEffect, useState, useCallback } from "react";
import { listDashboardConfigs, saveDashboardConfig } from "../api";
import DashboardWidget from "../components/DashboardWidget";
import ChartWidget from "../components/ChartWidget";
import DataTable from "../components/DataTable";
import InfoCard from "../components/InfoCard";
import ConfigForm from "../components/ConfigForm";
import useWebSocket from "../api/useWebSocket";

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

  // Live KPI/metrics state (auto-updated from stream)
  const [liveKPIs, setLiveKPIs] = useState({
    totalReports: "-",
    topPerfScore: "-",
    updated: "-",
    raw: null,
  });
  // Live trend data (for chart area)
  const [trendData, setTrendData] = useState([]);

  // Dashboard creation state
  const [formFields, setFormFields] = useState({
    dashboard_id: "",
    title: "",
    // config: {}
  });
  const [creating, setCreating] = useState(false);
  const [createMsg, setCreateMsg] = useState(null);

  // Backend WebSocket URL (enable env override for local/dev/prod)
  // Try to match the backend port; default to ws://localhost:3001/ws/stream (customize as needed)
  const WS_URL = process.env.REACT_APP_WS_URL || "ws://localhost:3001/ws/stream";

  // WebSocket: handle incoming stream messages and update dashboard metrics/reactive state.
  const handleMessage = useCallback((msg) => {
    // msg can be { kpis: {...}, trends: [...], dashboards: [...] }
    // Defensive: support both backend format and stub
    if (msg && typeof msg === "object") {
      if (msg.kpis) {
        setLiveKPIs(kpis => ({
          ...kpis,
          ...msg.kpis,
          raw: { ...msg.kpis },
        }));
      }
      if (msg.trends) {
        setTrendData(msg.trends);
      }
      if (msg.dashboards) {
        setDashboards(msg.dashboards);
      }
    }
  }, []);

  const { connected: wsConnected, error: wsError } = useWebSocket(WS_URL, handleMessage, { retryIntervalMs: 4500 });

  // Fallback/initial fetch (REST)
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

  // KPIs with live override if present
  const kpisToDisplay = [
    { label: "Total Reports", value: liveKPIs?.totalReports ?? dashboards?.length ?? "-" },
    { label: "Top Perf. Score", value: liveKPIs?.topPerfScore ?? (dashboards && dashboards.length > 0 ? "95" : "-") },
    { label: "Updated", value: liveKPIs?.updated ?? "Today" }
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

  // Dummy chart if no trend data available yet
  function renderTrendChart() {
    if (trendData && trendData.length > 0) {
      // Render a basic visual trend line (as SVG or fallback). For now, simple text.
      return (
        <div style={{
          padding: 6,
          color: "var(--primary-accent)",
          fontWeight: 600,
          minHeight: 70,
        }}>
          [Trends: {trendData.map((v, i) => (
            <span key={i} style={{ margin: "0 6px", display: "inline-block", fontSize: 16 }}>{v}</span>
          ))}]
        </div>
      );
    }
    // fallback stub
    return (
      <div style={{
        width: "100%",
        height: 120,
        background: "linear-gradient(90deg,#292,#393 45%,#226)",
        borderRadius: 8,
        opacity: 0.3,
        margin: "8px 0"
      }}>[Chart visualization stub]</div>
    );
  }

  return (
    <div className="page-content">
      <h1 className="section-title" style={{ display: "flex", alignItems: "center", gap: 18 }}>
        Dashboard
        <span style={{
          fontSize: 13,
          fontWeight: 600,
          color: wsConnected ? "#09b347" : "#bbb",
          marginLeft: 10,
          display: "inline-flex", alignItems: "center"
        }}>
          <span
            style={{
              display: "inline-block",
              width: 10, height: 10,
              borderRadius: "50%",
              background: wsConnected ? "#09b347" : "#ccc",
              marginRight: 6,
              border: wsConnected ? "1.6px solid #09931f" : "1.6px solid #ccc"
            }}
            title={wsConnected ? "Live" : "No stream"}
            aria-label={wsConnected ? "Live" : "Offline"}
          />{wsConnected ? "LIVE" : "OFFLINE"}
        </span>
      </h1>
      <div className="section-description">
        View leadership KPIs, metrics, analytics & executive insight summaries.<br />
        <em style={{ color: "#666", fontSize: 13 }}>
          Realtime updates {wsConnected ? "(auto-refresh ON)" : "(auto-refresh UNAVAILABLE)"}
        </em>
      </div>
      {wsError && (
        <div style={{ color: "red", marginBottom: 8 }}>WebSocket error: {wsError}</div>
      )}
      <div style={{ display: "flex", gap: 36, flexWrap: "wrap", margin: "0 0 26px 0" }}>
        {kpisToDisplay.map(kpi =>
          <DashboardWidget key={kpi.label} title={kpi.label}>
            <span style={{ fontSize: 32, fontWeight: 700, color: "var(--accent, #fee715)" }}>{kpi.value}</span>
          </DashboardWidget>
        )}
      </div>
      <ChartWidget title="KPI Trends">
        {renderTrendChart()}
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
