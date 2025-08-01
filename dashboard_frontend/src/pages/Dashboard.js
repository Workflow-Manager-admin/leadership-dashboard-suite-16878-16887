import React, { useState, useEffect } from "react";
import { apiGet } from "../api";

// PUBLIC_INTERFACE
function Dashboard({ filters }) {
  const [dashboards, setDashboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setLoading(true);
    apiGet("/dashboard/", filters)
      .then((d) => {
        setDashboards(d);
        setSelected(d.length ? d[0].dashboard_id : null);
      })
      .finally(() => setLoading(false));
  }, [filters]);

  let dash = dashboards.find(x => x.dashboard_id === selected);

  return (
    <section className="dashboard-main">
      <h2>Dashboards</h2>
      <div className="dashboard-list">
        {dashboards.map(db =>
          <button
            key={db.dashboard_id}
            className={selected === db.dashboard_id ? "active" : ""}
            onClick={() => setSelected(db.dashboard_id)}
            aria-label={db.dashboard_id}
          >
            {db.dashboard_id}
          </button>
        )}
      </div>
      {loading ?
        <div className="loading">Loading…</div>
      : dash ? (
        <div className="dashboard-content">
          <div className="kpis">
            {dash.kpis.map(k => (
              <div key={k.kpi_id} className="kpi-card">
                <div className="kpi-name">{k.name}</div>
                <div className="kpi-desc">{k.description}</div>
              </div>
            ))}
          </div>
          <div className="charts">
            {dash.charts.map(chart =>
              <div key={chart.chart_id} className="chart-card">
                <h4>{chart.title}</h4>
                <span className="chart-type">{chart.type}</span>
                <pre>{JSON.stringify(chart.config, null, 2)}</pre>
              </div>
            )}
          </div>
          <div className="dashboard-summary">
            <h4>Summary / Highlights</h4>
            <div>{dash.summary}</div>
          </div>
        </div>
      ) : <div>No dashboard selected.</div>}
    </section>
  );
}

export default Dashboard;
