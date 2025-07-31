import React, { useEffect, useState } from "react";
import DataTable from "./DataTable";
import Modal from "./Modal";
import RuleForm from "./RuleForm";
import {
  listRules,
  createRule,
  updateRule,
  deleteRule,
} from "../api";

/**
 * PUBLIC_INTERFACE
 * RuleManagement — UI for listing, creating, editing, and deleting tagging/classification rules.
 * Props:
 *   - none (self-manages state and API calls)
 */
function RuleManagement() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // rule or null for new
  const [submitLoading, setSubmitLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);

  function fetchRules() {
    setLoading(true);
    setError(null);
    listRules()
      .then(setRules)
      .catch((e) => setError(e?.message || "Unable to load rules"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchRules();
  }, []);

  function handleCreate() {
    setEditing(null);
    setModalOpen(true);
    setMsg(null);
  }

  function handleEdit(rule) {
    setEditing(rule);
    setModalOpen(true);
    setMsg(null);
  }

  async function handleDelete(rule) {
    if (!window.confirm(`Delete rule "${rule.name}"?`)) return;
    setSubmitLoading(true);
    try {
      await deleteRule(rule.rule_id || rule.id);
      setMsg({ type: "success", msg: "Rule deleted." });
      fetchRules();
    } catch (e) {
      setMsg({ type: "error", msg: e?.message || "Failed to delete" });
    } finally {
      setSubmitLoading(false);
    }
  }

  async function handleSave(submittedRule) {
    setSubmitLoading(true);
    setMsg(null);
    try {
      if (editing) {
        await updateRule(editing.rule_id || editing.id, submittedRule);
        setMsg({ type: "success", msg: "Rule updated." });
      } else {
        await createRule(submittedRule);
        setMsg({ type: "success", msg: "Rule created." });
      }
      setModalOpen(false);
      fetchRules();
    } catch (e) {
      setMsg({ type: "error", msg: e?.message || "Failed to save rule" });
    } finally {
      setSubmitLoading(false);
    }
  }

  const columns = [
    { title: "Name", key: "name" },
    { title: "Pattern", key: "pattern" },
    { title: "Tags", key: "tags" },
    { title: "Active", key: "active" },
    { title: "Action", key: "action" },
  ];

  const tableData = (rules || []).map((rule) => ({
    ...rule,
    tags: Array.isArray(rule.tags) ? rule.tags.join(", ") : rule.tags,
    active: rule.active ? "✅" : "❌",
    action: (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="btn" style={{ fontSize: 13, padding: "4px 10px" }} onClick={() => handleEdit(rule)}>
          Edit
        </button>
        <button className="btn" style={{ fontSize: 13, padding: "4px 10px", background: "#b42b2f" }} onClick={() => handleDelete(rule)} disabled={submitLoading}>
          Delete
        </button>
      </div>
    ),
  }));

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <h2 style={{ margin: 0, fontWeight: 700 }}>Auto-tagging Rules</h2>
        <button className="btn" onClick={handleCreate} style={{ fontSize: 15 }}>
          + New Rule
        </button>
      </div>
      {loading && <div>Loading rules...</div>}
      {msg && (
        <div
          style={{
            color: msg.type === "error" ? "red" : "#1a6a1a",
            fontWeight: 600,
            margin: "7px 0"
          }}
        >
          {msg.msg}
        </div>
      )}
      {error && <div style={{ color: "red" }}>Error: {error}</div>}
      {!loading && !error && (
        <DataTable columns={columns} data={tableData} />
      )}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Rule" : "Create Rule"}>
        <RuleForm
          initial={editing}
          onSubmit={handleSave}
          onCancel={() => setModalOpen(false)}
          loading={submitLoading}
        />
      </Modal>
    </div>
  );
}

export default RuleManagement;
