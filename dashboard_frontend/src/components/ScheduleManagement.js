import React, { useEffect, useState } from "react";
import {
  listSchedules,
  scheduleReport,
} from "../api";
import Modal from "./Modal";
import DataTable from "./DataTable";

/**
 * PUBLIC_INTERFACE
 * ScheduleManagement — UI for viewing, creating, editing, and deleting scheduled reports.
 * Integrates with SLT backend APIs for schedule CRUD.
 */
function ScheduleManagement() {
  // All scheduled reports
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  // Modal/Editing state
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // schedule object or null if create
  const [fields, setFields] = useState({
    dashboard_id: "",
    cron: "",
    email: "",
  });
  const [saving, setSaving] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState({});
  const [notice, setNotice] = useState(null);

  // Fetch schedules on mount
  const fetchSchedules = () => {
    setLoading(true);
    setApiError(null);
    listSchedules()
      .then((data) => {
        setSchedules(data || []);
      })
      .catch((e) => setApiError(e?.message || "Failed to load schedules"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchSchedules(); }, []);

  // Open modal for create/edit
  function openModal(schedule) {
    setNotice(null);
    setEditing(schedule || null);
    setFields(schedule
      ? {
        dashboard_id: schedule.dashboard_id,
        cron: schedule.cron,
        email: schedule.email,
        id: schedule.id
      }
      : { dashboard_id: "", cron: "", email: "" }
    );
    setModalOpen(true);
  }

  function handleFieldChange(e) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  }

  // Create or edit schedule (uses scheduleReport API for both)
  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setNotice(null);

    if (!fields.dashboard_id || !fields.cron || !fields.email) {
      setNotice({ type: "error", msg: "All fields are required." });
      setSaving(false);
      return;
    }

    try {
      // The API is documented for create, not update; for update, treat as upsert (same endpoint)
      await scheduleReport(fields);
      setNotice({ type: "success", msg: "Schedule saved!" });
      setModalOpen(false);
      fetchSchedules();
    } catch (err) {
      setNotice({ type: "error", msg: err?.message || "Failed to save schedule" });
    } finally {
      setSaving(false);
    }
  }

  // Delete (API is not exported, would need a deleteSchedule function — we'll send POST to /api/scheduling/{schedule_id}/delete)
  async function handleDelete(schedule) {
    if (!window.confirm("Delete this scheduled report?")) return;
    setDeleteLoading((cur) => ({ ...cur, [schedule.id]: true }));
    setNotice(null);
    try {
      const resp = await fetch(
        process.env.REACT_APP_API_URL
          ? `${process.env.REACT_APP_API_URL}/api/scheduling/${encodeURIComponent(schedule.id)}/delete`
          : `http://localhost:3001/api/scheduling/${encodeURIComponent(schedule.id)}/delete`,
        {
          method: "POST",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!resp.ok) throw new Error("Delete failed: " + resp.status);
      setNotice({ type: "success", msg: "Schedule deleted." });
      fetchSchedules();
    } catch (e) {
      setNotice({ type: "error", msg: e?.message || "Could not delete" });
    } finally {
      setDeleteLoading((cur) => ({ ...cur, [schedule.id]: false }));
    }
  }

  // Columns for the schedule table
  const columns = [
    { title: "Dashboard ID", key: "dashboard_id" },
    { title: "Schedule (CRON)", key: "cron" },
    { title: "Destination Email", key: "email" },
    { title: "Status", key: "status" },
    { title: "Actions", key: "actions" },
  ];

  // Format table rows
  const data = (schedules || []).map((s) => ({
    ...s,
    status: (
      <span style={{
        color: s.active === false ? "#b02b1b" : "#093",
        fontWeight: 700,
      }}>
        {s.active === false ? "Inactive" : "Active"}
      </span>
    ),
    actions: (
      <div style={{ display: "flex", gap: "7px" }}>
        <button
          className="btn"
          style={{ fontSize: 13, padding: "3px 8px" }}
          onClick={() => openModal(s)}
        >
          Edit
        </button>
        <button
          className="btn"
          style={{
            fontSize: 13,
            padding: "3px 8px",
            background: "#b42b2f",
            color: "#fff",
            opacity: deleteLoading[s.id] ? 0.5 : 1,
          }}
          onClick={() => handleDelete(s)}
          disabled={!!deleteLoading[s.id]}
        >
          Delete
        </button>
      </div>
    ),
  }));

  // Form UI for add/edit
  function renderModal() {
    return (
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Scheduled Report" : "Schedule New Report"}
      >
        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 350 }}>
          <label>
            Dashboard ID
            <input
              name="dashboard_id"
              type="text"
              value={fields.dashboard_id || ""}
              onChange={handleFieldChange}
              disabled={saving || !!editing}
              style={{ marginLeft: 13 }}
              required
            />
          </label>
          <label>
            CRON Expression
            <input
              name="cron"
              type="text"
              value={fields.cron || ""}
              onChange={handleFieldChange}
              disabled={saving}
              style={{ marginLeft: 13 }}
              placeholder="e.g. 0 8 * * MON for every Monday 8am"
              required
            />
          </label>
          <label>
            Delivery Email
            <input
              name="email"
              type="email"
              value={fields.email || ""}
              onChange={handleFieldChange}
              disabled={saving}
              style={{ marginLeft: 13 }}
              placeholder="user@example.com"
              required
            />
          </label>
          <div style={{ display: "flex", gap: 17, marginTop: 10 }}>
            <button className="btn" type="submit" disabled={saving}>
              {saving ? "Saving..." : (editing ? "Save Changes" : "Create Schedule")}
            </button>
            <button className="btn" type="button" onClick={() => setModalOpen(false)}
              style={{ background: "#ccc", color: "#222" }} disabled={saving}>
              Cancel
            </button>
          </div>
          {notice && (
            <div style={{
              color: notice.type === "error" ? "red" : "#107810",
              marginTop: 8, fontWeight: 500
            }}>
              {notice.msg}
            </div>
          )}
        </form>
      </Modal>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontWeight: 700 }}>Report Schedule Management</h2>
        <button className="btn" style={{ fontSize: 15 }} onClick={() => openModal(null)}>
          + New Schedule
        </button>
      </div>
      {notice && (
        <div style={{
          color: notice.type === "error" ? "red" : "#107810",
          margin: "6px 0", fontWeight: 500
        }}>
          {notice.msg}
        </div>
      )}
      {loading
        ? <div>Loading scheduled reports...</div>
        : apiError
          ? <div style={{ color: "red" }}>Error: {apiError}</div>
          : (
            <DataTable columns={columns} data={data} />
          )
      }
      {renderModal()}
      <div style={{ color: "#888", fontSize: 13, marginTop: 8 }}>
        CRON uses standard syntax. Example: <code>0 8 * * MON</code> means every Monday at 8am.
      </div>
    </div>
  );
}

export default ScheduleManagement;
