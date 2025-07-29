import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  getDashboardConfig,
  saveDashboardConfig,
  listDashboardConfigs,
} from "../api";
import Modal from "../components/Modal";
import DashboardWidget from "../components/DashboardWidget";

// Widget types for selection; can be extended
const WIDGET_TYPES = [
  { type: "kpi", label: "KPI Summary" },
  { type: "chart", label: "Chart (Line/Bar)" },
  { type: "table", label: "Table" },
  { type: "badge", label: "Summary Badge" },
];

function randomId() {
  return "w_" + Math.random().toString(36).slice(2, 10);
}

const DEFAULT_LAYOUT = {
  widgets: [],
};

function emptyConfig() {
  return { ...DEFAULT_LAYOUT, widgets: [] };
}

/**
 * PUBLIC_INTERFACE
 * DashboardConfigPage
 * Allows user to add, configure, and position widgets, persist layout, and get live preview
 */
function DashboardConfigPage() {
  const [dashboardId, setDashboardId] = useState(""); // pick or create
  const [dashList, setDashList] = useState([]);
  const [config, setConfig] = useState(emptyConfig());
  const [selectedWidget, setSelectedWidget] = useState(null);
  const [showWidgetModal, setShowWidgetModal] = useState(false);
  const [liveData, setLiveData] = useState({});
  const wsRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);

  // Load dashboard list on mount
  useEffect(() => {
    listDashboardConfigs()
      .then((arr) => setDashList(arr || []))
      .catch(() => setDashList([]));
  }, []);

  // Fetch dashboard config when dashboardId changes
  useEffect(() => {
    if (!dashboardId) {
      setConfig(emptyConfig());
      return;
    }
    getDashboardConfig(dashboardId)
      .then((v) => setConfig(v && v.config ? v.config : emptyConfig()))
      .catch(() => setConfig(emptyConfig()));
  }, [dashboardId]);

  // WebSocket for real-time updates (subscribe per widget)
  useEffect(() => {
    if (!previewMode || !dashboardId || !config.widgets.length) return;
    // If ws already open, close before new connection
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    // Update this with your WS backend URL if different
    const API_WS_URL =
      (process.env.REACT_APP_WS_URL ||
        (window.location.protocol === "https:" ? "wss://" : "ws://") +
          window.location.hostname +
          ":3001/ws/dashboard/") +
      dashboardId;

    wsRef.current = new window.WebSocket(API_WS_URL);

    wsRef.current.onopen = () => {
      // Optional: announce widgets to backend for targeted streams
      wsRef.current.send(
        JSON.stringify({
          action: "subscribe",
          dashboard_id: dashboardId,
          widgets: config.widgets.map((w) => w.id),
        })
      );
    };
    wsRef.current.onmessage = (evt) => {
      try {
        const msg = JSON.parse(evt.data);
        // Expected: { widget_id: ..., data: ... }
        if (msg.widget_id) {
          setLiveData((prev) => ({ ...prev, [msg.widget_id]: msg.data }));
        }
      } catch {}
    };
    wsRef.current.onerror = (err) => {
      // Silent fail
    };
    wsRef.current.onclose = () => {};

    return () => {
      try {
        if (wsRef.current) wsRef.current.close();
      } catch {}
    };
    // eslint-disable-next-line
  }, [previewMode, dashboardId, config.widgets.length]);

  // Add new widget to config
  function handleAddWidget(type) {
    const w = {
      id: randomId(),
      type,
      config: {},
      x: 0,
      y: config.widgets.length * 130, // basic vertical stacking
    };
    setConfig((old) => ({
      ...old,
      widgets: [...old.widgets, w],
    }));
    setSelectedWidget(w);
    setShowWidgetModal(true);
  }

  // Remove widget
  function handleRemoveWidget(id) {
    setConfig((old) => ({
      ...old,
      widgets: old.widgets.filter((w) => w.id !== id),
    }));
    setShowWidgetModal(false);
    setSelectedWidget(null);
  }

  // Save/Update widget config
  function handleSaveWidget(newCfg) {
    setConfig((old) => ({
      ...old,
      widgets: old.widgets.map((w) =>
        w.id === newCfg.id ? { ...w, ...newCfg } : w
      ),
    }));
    setShowWidgetModal(false);
    setSelectedWidget(null);
  }

  // Drag and drop handlers for widget layout update
  const dragItem = useRef();
  function handleWidgetDragStart(e, id) {
    dragItem.current = id;
  }
  function handleWidgetDragOver(e) {
    e.preventDefault();
  }
  function handleWidgetDrop(e, idx) {
    e.preventDefault();
    const dragId = dragItem.current;
    if (!dragId) return;
    dragItem.current = null;
    let widgets = [...config.widgets];
    const dragIdx = widgets.findIndex((w) => w.id === dragId);
    if (dragIdx < 0 || dragIdx === idx) return;
    const [dragged] = widgets.splice(dragIdx, 1);
    widgets.splice(idx, 0, dragged);
    setConfig((old) => ({ ...old, widgets }));
  }

  // Persist entire dashboard config
  async function handleSaveDashboard() {
    setSaving(true);
    setError(null);
    try {
      await saveDashboardConfig({ dashboard_id: dashboardId, config });
    } catch (e) {
      setError("Error saving: " + (e.message || e));
    }
    setSaving(false);
  }

  // Entry UI: select or create dashboard
  if (!dashboardId) {
    return (
      <div className="page-content" style={{ maxWidth: 650 }}>
        <h1>Configure a Dashboard</h1>
        <label htmlFor="dashboard-select" style={{ fontWeight: 600 }}>
          Select Existing Dashboard
        </label>
        <select
          id="dashboard-select"
          style={{ width: 260, margin: "0 12px 22px 16px" }}
          value=""
          onChange={(e) => setDashboardId(e.target.value)}
        >
          <option value="">-- Choose a Dashboard --</option>
          {dashList.map((d) => (
            <option key={d.dashboard_id} value={d.dashboard_id}>
              {d.title || d.dashboard_id}
            </option>
          ))}
        </select>
        <div>
          <span style={{ fontWeight: 600 }}>Or create a new dashboard: </span>
          <input
            type="text"
            placeholder="Dashboard ID"
            style={{ margin: "0 8px" }}
            onBlur={(e) => {
              if (e.target.value) setDashboardId(e.target.value.trim());
            }}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                e.target.value &&
                e.target.value.trim() !== ""
              ) {
                setDashboardId(e.target.value.trim());
              }
            }}
          />
          <span style={{ fontSize: 14, color: "#555", marginLeft: 8 }}>
            (Pick a unique ID. Title can be changed later.)
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <h1>
        Configure Dashboard{" "}
        <span style={{ fontSize: 15, color: "#777" }}>({dashboardId})</span>
      </h1>
      <div style={{ marginBottom: 18 }}>
        <button
          className="btn"
          style={{ marginRight: 12 }}
          onClick={() => setPreviewMode((v) => !v)}
        >
          {previewMode ? "🔧 Exit Live Preview" : "👁️ Show Live Preview"}
        </button>
        <button
          className="btn"
          style={{ marginRight: 12 }}
          onClick={handleSaveDashboard}
          disabled={saving}
        >
          {saving ? "Saving..." : "💾 Save Dashboard"}
        </button>
        <a
          href="#"
          onClick={() => setDashboardId("")}
          style={{ marginLeft: 18, color: "#337" }}
        >
          Switch Dashboard
        </a>
        {error && <span style={{ color: "red", marginLeft: 9 }}>{error}</span>}
      </div>
      {!previewMode && (
        <section>
          <h3 style={{ marginBottom: 10 }}>Add Widget</h3>
          <div style={{ display: "flex", gap: 19, marginBottom: 20 }}>
            {WIDGET_TYPES.map((w) => (
              <button
                className="btn btn-secondary"
                key={w.type}
                onClick={() => handleAddWidget(w.type)}
                style={{
                  border: "1.2px solid #ddd",
                }}
              >
                + {w.label}
              </button>
            ))}
          </div>
          <h3 style={{ marginBottom: 11 }}>Widget Layout</h3>
          <div>
            {config.widgets.length === 0 ? (
              <div
                style={{
                  color: "#888",
                  fontSize: 17,
                  marginTop: 22,
                  marginLeft: 8,
                }}
              >
                (No widgets yet. Add your first widget above!)
              </div>
            ) : (
              <div>
                {config.widgets.map((w, idx) => (
                  <div
                    key={w.id}
                    draggable
                    onDragStart={(e) => handleWidgetDragStart(e, w.id)}
                    onDragOver={handleWidgetDragOver}
                    onDrop={(e) => handleWidgetDrop(e, idx)}
                    style={{
                      cursor: "move",
                      background: "#fafbfe",
                      border: "1.2px dashed #b5c9e2",
                      borderRadius: 10,
                      padding: 10,
                      marginBottom: 17,
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                    }}
                    onClick={() => {
                      setSelectedWidget(w);
                      setShowWidgetModal(true);
                    }}
                  >
                    <span style={{ fontWeight: 700 }}>{w.type}</span>
                    <span style={{ flex: "1" }}>
                      {w.config && w.config.title
                        ? w.config.title
                        : <span style={{ color: "#999" }}>[No title]</span>}
                    </span>
                    <button
                      type="button"
                      style={{
                        background: "#ffeeee",
                        color: "#913",
                        border: "1.1px solid #e2e2e2",
                        borderRadius: 7,
                        fontWeight: 600,
                        padding: "7px 13px",
                        fontSize: 13,
                      }}
                      onClick={(ev) => {
                        ev.stopPropagation();
                        handleRemoveWidget(w.id);
                      }}
                    >
                      🗑 Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {previewMode && (
        <DashboardLivePreview
          widgets={config.widgets}
          liveData={liveData}
        />
      )}

      <WidgetConfigModal
        isOpen={showWidgetModal}
        widget={selectedWidget}
        onSave={handleSaveWidget}
        onClose={() => {
          setShowWidgetModal(false);
          setSelectedWidget(null);
        }}
      />
    </div>
  );
}

// Widget configuration modal
function WidgetConfigModal({ isOpen, widget, onSave, onClose }) {
  const [form, setForm] = useState(() =>
    widget
      ? {
          ...widget,
          config: { ...widget.config },
        }
      : null
  );
  useEffect(() => {
    // Sync modal input with selected widget
    setForm(
      widget
        ? {
            ...widget,
            config: { ...widget.config },
          }
        : null
    );
  }, [widget]);

  if (!isOpen || !widget) return null;
  function handleField(name, val) {
    setForm((old) => ({
      ...old,
      config: { ...old.config, [name]: val },
    }));
  }
  function handleModalSave() {
    if (form) {
      onSave({ ...form });
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Config: ${widget.type}`}>
      <div style={{ minWidth: 250 }}>
        <div style={{ marginBottom: 10 }}>
          <label>
            <strong>Title:</strong>
            <input
              type="text"
              style={{ width: "94%", marginLeft: 4 }}
              value={form.config.title || ""}
              onChange={(e) => handleField("title", e.target.value)}
            />
          </label>
        </div>

        {widget.type === "kpi" && (
          <div>
            <label>
              KPI Key:
              <input
                type="text"
                style={{ marginLeft: 8 }}
                value={form.config.kpi_key || ""}
                onChange={(e) => handleField("kpi_key", e.target.value)}
                placeholder="E.g. revenue, profit_margin"
              />
            </label>
          </div>
        )}
        {widget.type === "chart" && (
          <div>
            <label>
              Chart Type:
              <select
                style={{ marginLeft: 7 }}
                value={form.config.chart_type || "line"}
                onChange={(e) => handleField("chart_type", e.target.value)}
              >
                <option value="line">Line</option>
                <option value="bar">Bar</option>
                <option value="pie">Pie</option>
              </select>
            </label>
            <label>
              Data Key:
              <input
                type="text"
                style={{ marginLeft: 8 }}
                value={form.config.data_key || ""}
                onChange={(e) => handleField("data_key", e.target.value)}
                placeholder="E.g. quarterly_results"
              />
            </label>
          </div>
        )}
        {widget.type === "table" && (
          <div>
            <label>
              Data Key:
              <input
                type="text"
                style={{ marginLeft: 8 }}
                value={form.config.data_key || ""}
                onChange={(e) => handleField("data_key", e.target.value)}
                placeholder="E.g. sales_table"
              />
            </label>
          </div>
        )}
        {widget.type === "badge" && (
          <div>
            <label>
              Badge Value Key:
              <input
                type="text"
                style={{ marginLeft: 8 }}
                value={form.config.badge_key || ""}
                onChange={(e) => handleField("badge_key", e.target.value)}
                placeholder="E.g. top_performer"
              />
            </label>
          </div>
        )}
        <div style={{ marginTop: 19 }}>
          <button
            className="btn"
            style={{ marginRight: 8 }}
            onClick={handleModalSave}
          >
            Save Widget
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}

// Live preview (subscribes to backend, receives liveData by prop)
function DashboardLivePreview({ widgets, liveData }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 19, marginTop: 38 }}>
      {widgets.map((w) => (
        <DashboardWidget key={w.id} title={w.config.title}>
          {w.type === "kpi" && (
            <div>
              <span style={{ fontSize: 32, fontWeight: 800 }}>
                {liveData[w.id]?.value !== undefined
                  ? liveData[w.id]?.value
                  : "[KPI]"}
              </span>
              <div style={{ fontSize: 15, color: "#555", marginTop: 7 }}>
                {w.config.kpi_key || "[KPI key]"}
              </div>
            </div>
          )}
          {w.type === "chart" && (
            <SimpleChartWidget
              chartType={w.config.chart_type || "line"}
              data={liveData[w.id]?.data || []}
              title={w.config.title}
            />
          )}
          {w.type === "table" && (
            <SimpleTableWidget
              data={liveData[w.id]?.data || []}
              columns={liveData[w.id]?.columns || []}
            />
          )}
          {w.type === "badge" && (
            <div
              style={{
                background: "#fee715",
                color: "#101820",
                fontWeight: 700,
                fontSize: 22,
                padding: "7px 22px",
                borderRadius: 10,
                display: "inline-block",
              }}
            >
              {liveData[w.id]?.value !== undefined
                ? liveData[w.id]?.value
                : "[Value]"}
            </div>
          )}
        </DashboardWidget>
      ))}
    </div>
  );
}

// Simple chart component (stub: only draws simple bar/line)
function SimpleChartWidget({ chartType, data, title }) {
  // data is expected to be array of {x, y} or similar
  // For production, replace with a chart library
  if (!Array.isArray(data) || data.length === 0)
    return <div>No chart data</div>;
  const maxY = Math.max(...data.map((d) => d.y || 0));
  const height = 90;
  const width = 210;
  return (
    <svg width={width} height={height} style={{ background: "#f2f4fa" }}>
      {chartType === "bar" &&
        data.map((d, i) => {
          const barHeight = ((d.y || 0) / (maxY || 1)) * (height - 24);
          return (
            <rect
              key={i}
              x={i * (width / data.length) + 11}
              y={height - barHeight - 8}
              width={width / data.length - 18}
              height={barHeight}
              fill="#0057b8"
            />
          );
        })}
      {chartType === "line" &&
        data.map((d, i) => {
          if (i === 0) return null;
          const x1 = ((i - 1) * width) / data.length + 11;
          const y1 =
            height -
            8 -
            ((data[i - 1].y || 0) / (maxY || 1)) * (height - 24);
          const x2 = (i * width) / data.length + 11;
          const y2 =
            height - 8 - ((d.y || 0) / (maxY || 1)) * (height - 24);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#0057b8"
              strokeWidth={3}
            />
          );
        })}
      {/* X/Y axis labels */}
      <text
        x={width / 2}
        y={height - 2}
        textAnchor="middle"
        style={{ fontSize: 14, fill: "#345" }}
      >
        {title}
      </text>
    </svg>
  );
}

function SimpleTableWidget({ data, columns }) {
  if (!Array.isArray(data) || data.length === 0)
    return <div>No table data</div>;
  return (
    <table style={{ width: "100%", fontSize: 15 }}>
      <thead>
        <tr>
          {columns.map((c, i) => (
            <th key={i} style={{ fontWeight: "600", borderBottom: "1px solid #bbb", background: "#f7f9fa" }}>
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, ri) => (
          <tr key={ri}>
            {columns.map((c, ci) => (
              <td key={ci} style={{ borderBottom: "1px solid #eee" }}>
                {row[c]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DashboardConfigPage;
