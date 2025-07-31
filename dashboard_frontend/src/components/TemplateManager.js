import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import DataTable from "./DataTable";
import ConfigForm from "./ConfigForm";
import {
  listTemplates,
  createTemplate,
  // Placeholder for future: updateTemplate, deleteTemplate
} from "../api";

/**
 * PUBLIC_INTERFACE
 * TemplateManager - UI for listing, creating, editing, and reusing dashboard templates in a modal.
 * Props:
 *   - isOpen: boolean - modal visibility
 *   - onClose: function - close modal callback
 *   - onSelect: function(template) - callback when a template is "applied"
 */
function TemplateManager({ isOpen, onClose, onSelect }) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null); // template object or null for new
  const [editFields, setEditFields] = useState({
    template_id: "",
    name: "",
    config: ""
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [editModal, setEditModal] = useState(false);

  function fetchTemplates() {
    setLoading(true);
    setError(null);
    listTemplates()
      .then((data) => setTemplates(data))
      .catch((e) => setError(e && e.message ? e.message : "Error loading templates"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (isOpen) fetchTemplates();
    // eslint-disable-next-line
  }, [isOpen]);

  function openEditModal(template) {
    setEditing(template);
    setEditModal(true);
    setMsg(null);
    if (template) {
      setEditFields({
        template_id: template.template_id,
        name: template.name,
        config: template.config ? JSON.stringify(template.config, null, 2) : ""
      });
    } else {
      setEditFields({
        template_id: "",
        name: "",
        config: ""
      });
    }
  }

  function closeEditModal() {
    setEditModal(false);
    setEditing(null);
    setMsg(null);
    setEditFields({
      template_id: "",
      name: "",
      config: ""
    });
  }

  function handleFieldChange(name, value) {
    setEditFields((f) => ({ ...f, [name]: value }));
  }

  async function handleSaveTemplate(e) {
    e.preventDefault();
    setMsg(null);
    if (!editFields.name || !editFields.template_id) {
      setMsg({ type: "error", msg: "Template Name and ID are required" });
      return;
    }
    let parsedConfig = {};
    if (editFields.config && editFields.config.trim()) {
      try {
        parsedConfig = JSON.parse(editFields.config);
      } catch {
        setMsg({ type: "error", msg: "Config must be valid JSON" });
        return;
      }
    }
    setSubmitLoading(true);
    try {
      // If editing, would normally call update API
      await createTemplate({
        template_id: editFields.template_id,
        name: editFields.name,
        config: parsedConfig
      });
      setMsg({ type: "success", msg: "Template saved!" });
      closeEditModal();
      fetchTemplates();
    } catch (e) {
      setMsg({ type: "error", msg: e && e.message ? e.message : "Failed to save" });
    } finally {
      setSubmitLoading(false);
    }
  }

  const columns = [
    { title: "Name", key: "name" },
    { title: "Template ID", key: "template_id" },
    { title: "Actions", key: "actions" }
  ];

  const tableData = templates.map((tpl) => ({
    ...tpl,
    actions: (
      <div style={{ display: "flex", gap: 7 }}>
        <button
          className="btn"
          style={{ fontSize: 13, padding: "3px 9px" }}
          onClick={() => {
            if (onSelect) onSelect(tpl);
          }}
        >
          Apply
        </button>
        <button
          className="btn"
          style={{
            fontSize: 13,
            padding: "3px 9px",
            background: "#ccc",
            color: "#222"
          }}
          onClick={() => openEditModal(tpl)}
        >
          Edit
        </button>
        {/* Future: add delete support */}
      </div>
    )
  }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Template Management">
      <div>
        <div style={{ marginBottom: 10 }}>
          <button
            className="btn"
            style={{ fontSize: 15, marginBottom: 6 }}
            onClick={() => openEditModal(null)}
          >
            + New Template
          </button>
        </div>
        {loading && <div>Loading templates...</div>}
        {error && (
          <div style={{ color: "red", marginBottom: 7 }}>Error: {error}</div>
        )}
        {!loading && !error && (
          <DataTable columns={columns} data={tableData} />
        )}
        {msg && (
          <div
            style={{
              color: msg.type === "error" ? "red" : "#113f11",
              margin: "7px 0",
              fontWeight: 500
            }}
          >
            {msg.msg}
          </div>
        )}
      </div>
      <Modal
        isOpen={editModal}
        onClose={closeEditModal}
        title={editing ? "Edit Template" : "Create Template"}
      >
        <form onSubmit={handleSaveTemplate} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <label>
            Name
            <input
              type="text"
              value={editFields.name}
              disabled={submitLoading}
              name="name"
              onChange={(e) => handleFieldChange("name", e.target.value)}
              style={{ marginLeft: 11 }}
              autoComplete="off"
            />
          </label>
          <label>
            Template ID
            <input
              type="text"
              value={editFields.template_id}
              disabled={!!editing || submitLoading}
              name="template_id"
              onChange={(e) => handleFieldChange("template_id", e.target.value)}
              style={{ marginLeft: 11 }}
              autoComplete="off"
            />
          </label>
          <label>
            Config (JSON)
            <textarea
              value={editFields.config}
              name="config"
              onChange={(e) => handleFieldChange("config", e.target.value)}
              placeholder='{ "kpis": [ ... ] }'
              rows={6}
              disabled={submitLoading}
              style={{
                fontFamily: "monospace",
                fontSize: 13,
                background: "var(--background-secondary)",
                marginLeft: 0,
                width: "97%"
              }}
            />
          </label>
          <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
            <button className="btn" disabled={submitLoading} type="submit">
              {editing ? "Save Changes" : "Create Template"}
            </button>
            <button
              className="btn"
              type="button"
              onClick={closeEditModal}
              style={{ background: "#ccc", color: "#222" }}
              disabled={submitLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </Modal>
  );
}

export default TemplateManager;
