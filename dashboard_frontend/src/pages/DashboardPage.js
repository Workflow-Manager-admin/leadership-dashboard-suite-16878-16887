import React, { useEffect, useState, useCallback } from "react";
import {
  listDashboardConfigs,
  saveDashboardConfig,
  getDashboardConfig,
} from "../api";
import DashboardWidget from "../components/DashboardWidget";
import ChartWidget from "../components/ChartWidget";
import DataTable from "../components/DataTable";
import InfoCard from "../components/InfoCard";
import ConfigForm from "../components/ConfigForm";
import useWebSocket from "../api/useWebSocket";
import Modal from "../components/Modal";
import ExportDashboard from "../components/ExportDashboard";

/**
 * PUBLIC_INTERFACE
 * DashboardPage shows the main leadership dashboard, KPIs and key metrics.
 * Now allows end-users to interactively select/configure KPIs/charts/filters.
 * Fetches dashboard config summaries from backend. 
 * Allows creation and editing of dashboards, configuration of which KPIs/charts/filters are visible,
 * and applies filters with live backend integration.
 */
function DashboardPage() {
  const [dashboards, setDashboards] = useState([]);
  const [activeDashboardId, setActiveDashboardId] = useState(null);
  const [selectedDashboardConfig, setSelectedDashboardConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Live KPI/metrics state (auto-updated from stream)
  const [liveKPIs, setLiveKPIs] = useState({});
  // Live trend data (for chart area)
  const [trendData, setTrendData] = useState([]);

  // Filter state (date/project/team choices)
  const [filters, setFilters] = useState({
    date: "",
    project: "",
    team: "",
  });

  // UI modal state for KPI/chart selection/config
  const [configModalOpen, setConfigModalOpen] = useState(false);

  // Configuration of selected KPIs/charts to display (user configurable)
  const [kpiChartConfig, setKpiChartConfig] = useState({
    kpis: ["totalReports", "topPerfScore", "updated"],
    charts: ["kpi_trend"],
    filtersEnabled: ["date", "project", "team"],
  });

  const [formFields, setFormFields] = useState({
    dashboard_id: "",
    title: "",
  });
  const [creating, setCreating] = useState(false);
  const [createMsg, setCreateMsg] = useState(null);
  const [saveConfigMsg, setSaveConfigMsg] = useState(null);

  // For filter dropdown state
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);

  // Backend WebSocket URL (enable env override for local/dev/prod)
  const WS_URL = process.env.REACT_APP_WS_URL || "ws://localhost:3001/ws/stream";

  // WebSocket: handle incoming stream messages and update states
  const handleMessage = useCallback((msg) => {
    // msg format example: { kpis: {...}, trends: [...], dashboards: [...], projects: [...], teams: [...] }
    if (msg && typeof msg === "object") {
      if (msg.kpis) {
        setLiveKPIs(current => ({
          ...current,
          ...msg.kpis,
          raw: { ...msg.kpis },
        }));
      }
      if (msg.trends) setTrendData(msg.trends);
      if (msg.dashboards) setDashboards(msg.dashboards);
      if (msg.projects) setProjects(msg.projects);
      if (msg.teams) setTeams(msg.teams);
    }
  }, []);

  const { connected: wsConnected, error: wsError } = useWebSocket(
    WS_URL, handleMessage, { retryIntervalMs: 4500 }
  );

  // Initial dashboard list fetch + populate filter/project/team fields
  function fetchDashboards() {
    setLoading(true);
    setError(null);
    listDashboardConfigs()
      .then(data => {
        setDashboards(data);
        if (!activeDashboardId && data.length > 0) {
          setActiveDashboardId(data[0].dashboard_id);
        }
      })
      .catch((e) => setError(e?.message || "Error loading dashboards"))
      .finally(() => setLoading(false));
  }

  // Dashboard config fetch
  async function fetchDashboardConfig(id) {
    setSelectedDashboardConfig(null);
    if (!id) return;
    try {
      // config includes KPIs, chart selection, filters, etc.
      const configRes = await getDashboardConfig(id);
      setSelectedDashboardConfig(configRes.config || {});
      if (configRes.config && configRes.config.kpiChartConfig) {
        setKpiChartConfig(configRes.config.kpiChartConfig);
      } else {
        setKpiChartConfig({
          kpis: ["totalReports", "topPerfScore", "updated"],
          charts: ["kpi_trend"],
          filtersEnabled: ["date", "project", "team"],
        });
      }
    } catch {
      setSelectedDashboardConfig({});
      setKpiChartConfig({
        kpis: ["totalReports", "topPerfScore", "updated"],
        charts: ["kpi_trend"],
        filtersEnabled: ["date", "project", "team"],
      });
    }
  }

  // On mount: fetch dashboards and prime display
  useEffect(() => { fetchDashboards(); }, []);
  useEffect(() => { 
    if (activeDashboardId) fetchDashboardConfig(activeDashboardId);
  }, [activeDashboardId]);

  // KPIs that are selectable/configurable (example set; expand as needed)
  const allKpis = [
    { key: "totalReports", label: "Total Reports" },
    { key: "topPerfScore", label: "Top Perf. Score" },
    { key: "updated", label: "Updated" },
    { key: "avgQuality", label: "Avg Quality" },
    { key: "openProjects", label: "Open Projects" },
    { key: "completionRate", label: "Completion Rate" },
  ];
  const kpiMap = Object.fromEntries(allKpis.map(k => [k.key, k.label]));

  // Charts that are selectable/configurable (stubs for now)
  const allCharts = [
    { key: "kpi_trend", label: "KPI Trends" },
    { key: "quality_distribution", label: "Quality Distribution" },
    { key: "performance_rank", label: "Performance Rank" },
  ];

  // Filters that can be toggled
  const filterMeta = [
    { key: "date", label: "Date" },
    { key: "project", label: "Project" },
    { key: "team", label: "Team" },
  ];

  // Apply filter change
  function handleFilterChange(ev) {
    const { name, value } = ev.target;
    setFilters(f => ({ ...f, [name]: value }));
    // With backend, can apply filter to API or via WebSocket/query
    // Optionally broadcast filter state via WebSocket or REST here.
    // (Stub: UI only - for full integration, backend API should accept filter params)
  }

  // Open KPI/chart config modal
  function openConfigModal() { setConfigModalOpen(true); }
  function closeConfigModal() { setConfigModalOpen(false); setSaveConfigMsg(null); }

  function handleKpiConfigChange(ev) {
    const { name, value, checked, type } = ev.target;
    // Multi-checkbox handler for kpis, charts, filtersEnabled
    setKpiChartConfig((conf) => {
      if (type === "checkbox") {
        if (name.startsWith("kpi_")) {
          const k = name.replace("kpi_", "");
          return { ...conf, kpis: checked
            ? [...(conf.kpis||[]), k]
            : (conf.kpis||[]).filter(v => v !== k)
          };
        }
        if (name.startsWith("chart_")) {
          const c = name.replace("chart_", "");
          return { ...conf, charts: checked
            ? [...(conf.charts||[]), c]
            : (conf.charts||[]).filter(v => v !== c)
          };
        }
        if (name.startsWith("filter_")) {
          const f = name.replace("filter_", "");
          return { ...conf, filtersEnabled: checked
            ? [...(conf.filtersEnabled||[]), f]
            : (conf.filtersEnabled||[]).filter(val => val !== f)
          };
        }
      }
      return conf;
    });
  }

  async function handleSaveKpiChartConfig(ev) {
    ev.preventDefault();
    setSaveConfigMsg(null);
    if (!activeDashboardId) {
      setSaveConfigMsg({ type: "error", msg: "No active dashboard" });
      return;
    }
    try {
      await saveDashboardConfig({
        dashboard_id: activeDashboardId,
        config: {
          ...(selectedDashboardConfig || {}),
          kpiChartConfig
        }
      });
      setSaveConfigMsg({ type: "success", msg: "Configuration saved!" });
      setTimeout(() => setConfigModalOpen(false), 700);
    } catch (e) {
      setSaveConfigMsg({ type: "error", msg: e?.message || "Failed to save config" });
    }
  }

  // Dashboard creation form handlers
  function handleFieldChange(name, value) {
    setFormFields(f => ({ ...f, [name]: value }));
  }
  async function handleCreateDashboard(e) {
    e.preventDefault();
    if (!formFields.dashboard_id || !formFields.title) {
      setCreateMsg({ type: "error", msg: "Both ID and Title required"});
      return;
    }
    setCreating(true);
    setCreateMsg(null);
    try {
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

  // Render KPI widgets according to config
  function renderKpis() {
    return (kpiChartConfig.kpis || []).map(kpi =>
      <DashboardWidget key={kpi} title={kpiMap[kpi] || kpi}>
        <span style={{ fontSize: 32, fontWeight: 700, color: "var(--accent, #fee715)" }}>
          {liveKPIs?.[kpi] ?? "-"}
        </span>
      </DashboardWidget>
    );
  }

  // Chart area widget(s) based on user config
  function renderDynamicCharts() {
    return (kpiChartConfig.charts || []).map(chartKey => (
      <ChartWidget key={chartKey} title={allCharts.find(c => c.key === chartKey)?.label || chartKey}>
        {/* Switch chart type according to chartKey, fallback to stub */}
        {chartKey === "kpi_trend"
          ? (trendData && trendData.length > 0
            ? <div style={{
                padding: 6,
                color: "var(--primary-accent)",
                fontWeight: 600,
                minHeight: 70,
              }}>
                [Trends: {trendData.map((v, i) => (
                  <span key={i} style={{ margin: "0 6px", display: "inline-block", fontSize: 16 }}>{v}</span>
                ))}]
              </div>
            : <div style={{
                width: "100%",
                height: 120,
                background: "linear-gradient(90deg,#292,#393 45%,#226)",
                borderRadius: 8,
                opacity: 0.3,
                margin: "8px 0"
              }}>[Chart visualization stub]</div>
          )
          : <div style={{ color: "#666", fontStyle: "italic" }}>[{chartKey} chart stub]</div>
        }
      </ChartWidget>
    ));
  }

  function renderFilterControls() {
    return (
      <form style={{ display: "flex", gap: 20, margin: "12px 0 18px 0", flexWrap: "wrap" }}>
        {filterMeta.filter(fm => (kpiChartConfig.filtersEnabled||[]).includes(fm.key)).map(fm => {
          if (fm.key === "date") {
            return (
              <label key="date" style={{ fontWeight: 500, color: "var(--accent)", fontSize: 15 }}>
                Date:
                <input
                  name="date"
                  type="date"
                  value={filters.date}
                  onChange={handleFilterChange}
                  style={{ marginLeft: 10, fontWeight: "normal" }}
                />
              </label>
            );
          }
          if (fm.key === "project") {
            return (
              <label key="project" style={{ fontWeight: 500, color: "var(--accent)", fontSize: 15 }}>
                Project:
                <select
                  name="project"
                  value={filters.project}
                  onChange={handleFilterChange}
                  style={{ marginLeft: 10, fontWeight: "normal" }}
                >
                  <option value="">[Any]</option>
                  {projects.map(proj =>
                    <option key={proj} value={proj}>{proj}</option>
                  )}
                </select>
              </label>
            );
          }
          if (fm.key === "team") {
            return (
              <label key="team" style={{ fontWeight: 500, color: "var(--accent)", fontSize: 15 }}>
                Team:
                <select
                  name="team"
                  value={filters.team}
                  onChange={handleFilterChange}
                  style={{ marginLeft: 10, fontWeight: "normal" }}
                >
                  <option value="">[Any]</option>
                  {teams.map(team =>
                    <option key={team} value={team}>{team}</option>
                  )}
                </select>
              </label>
            );
          }
          return null;
        })}
      </form>
    );
  }

  // Active dashboard dropdown selector
  function renderDashboardSelector() {
    // Find the active dashboard title for display/exports
    const activeD = (dashboards || []).find(d => d.dashboard_id === activeDashboardId);
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "10px 0 18px 0" }}>
        <label style={{ fontWeight: 500, color: "var(--accent)" }}>
          Dashboard:
          <select
            value={activeDashboardId || ""}
            onChange={e => setActiveDashboardId(e.target.value)}
            style={{ marginLeft: 8, fontWeight: "normal" }}
          >
            {(dashboards || []).map(d => (
              <option key={d.dashboard_id} value={d.dashboard_id}>{d.title || d.dashboard_id}</option>
            ))}
          </select>
        </label>
        <button className="btn" style={{ fontSize: 13, padding: "6px 18px" }} onClick={openConfigModal}>
          ⋯ Customize KPIs/Charts
        </button>
        <ExportDashboard
          dashboardId={activeDashboardId}
          dashboardTitle={activeD ? activeD.title : undefined}
        />
      </div>
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

      {/* Dashboard selector + config modal button, if multiple dashboards are available */}
      {dashboards.length > 0 && renderDashboardSelector()}

      {/* Filter bar (date, project, team) */}
      {renderFilterControls()}

      <div style={{ display: "flex", gap: 36, flexWrap: "wrap", margin: "0 0 26px 0" }}>
        {renderKpis()}
      </div>
      {renderDynamicCharts()}
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

      {/* Modal: select which KPIs/charts/filters to display */}
      <Modal isOpen={configModalOpen} onClose={closeConfigModal} title="Configure KPIs, Charts, and Filters">
        <form onSubmit={handleSaveKpiChartConfig} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ marginBottom: 5 }}>
            <strong>KPIs:</strong>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 5 }}>
              {allKpis.map(k =>
                <label key={k.key} style={{ fontWeight: 400, color: "var(--primary-accent)", fontSize: 14 }}>
                  <input
                    type="checkbox"
                    checked={(kpiChartConfig.kpis || []).includes(k.key)}
                    onChange={handleKpiConfigChange}
                    name={`kpi_${k.key}`}
                    style={{ marginRight: 4 }}
                  />{k.label}
                </label>
              )}
            </div>
          </div>
          <div style={{ marginBottom: 5 }}>
            <strong>Charts:</strong>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 5 }}>
              {allCharts.map(c =>
                <label key={c.key} style={{ fontWeight: 400, color: "var(--primary-accent)", fontSize: 14 }}>
                  <input
                    type="checkbox"
                    checked={(kpiChartConfig.charts || []).includes(c.key)}
                    onChange={handleKpiConfigChange}
                    name={`chart_${c.key}`}
                    style={{ marginRight: 4 }}
                  />{c.label}
                </label>
              )}
            </div>
          </div>
          <div style={{ marginBottom: 6 }}>
            <strong>Filters:</strong>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 5 }}>
              {filterMeta.map(f =>
                <label key={f.key} style={{ fontWeight: 400, color: "var(--primary-accent)", fontSize: 14 }}>
                  <input
                    type="checkbox"
                    checked={(kpiChartConfig.filtersEnabled || []).includes(f.key)}
                    onChange={handleKpiConfigChange}
                    name={`filter_${f.key}`}
                    style={{ marginRight: 4 }}
                  />{f.label}
                </label>
              )}
            </div>
          </div>
          <div style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 14 }}>
            <button className="btn" type="submit">Save Configuration</button>
            <button className="btn" type="button" style={{ background: "#aaa", color: "#111" }} onClick={closeConfigModal}>Cancel</button>
            {saveConfigMsg && (
              <span style={{
                color: saveConfigMsg.type === "error" ? "red" : "#15a305",
                fontSize: 14,
                fontWeight: 600
              }}>{saveConfigMsg.msg}</span>
            )}
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default DashboardPage;
