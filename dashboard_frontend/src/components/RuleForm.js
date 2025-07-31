import React, { useState } from "react";

/**
 * PUBLIC_INTERFACE
 * RuleForm — used for creating and editing rules for auto-tagging.
 * Props:
 *   - initial (object): initial state ({ name, pattern, tags, active, ... })
 *   - onSubmit (function): called with rule object on save
 *   - onCancel (function): optional cancel handler
 *   - loading (bool): disables submit
 */
function RuleForm({ initial, onSubmit, onCancel, loading }) {
  const [rule, setRule] = useState(
    initial || { name: "", pattern: "", tags: "", active: true }
  );
  const [err, setErr] = useState(null);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setRule((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSave(e) {
    e.preventDefault();
    if (!rule.name || !rule.pattern) {
      setErr("Name and pattern are required.");
      return;
    }
    setErr(null);
    let tagsArr =
      typeof rule.tags === "string"
        ? rule.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [];
    onSubmit({ ...rule, tags: tagsArr });
  }

  return (
    <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 17 }}>
      <label>
        Name
        <input
          name="name"
          type="text"
          value={rule.name}
          onChange={handleChange}
          disabled={loading}
          style={{ marginLeft: 14 }}
        />
      </label>
      <label>
        Pattern (text or regex)
        <input
          name="pattern"
          type="text"
          value={rule.pattern}
          onChange={handleChange}
          disabled={loading}
          style={{ marginLeft: 14 }}
          placeholder="e.g. ProjectX, /Quarter \\d+/i"
        />
      </label>
      <label>
        Tags (comma-separated)
        <input
          name="tags"
          type="text"
          value={rule.tags}
          onChange={handleChange}
          disabled={loading}
          style={{ marginLeft: 14 }}
          placeholder="e.g. Finance, Q1"
        />
      </label>
      <label>
        <input
          type="checkbox"
          name="active"
          checked={rule.active}
          onChange={handleChange}
          disabled={loading}
        />
        Active
      </label>
      <div style={{ marginTop: 7, display: "flex", gap: 17 }}>
        <button className="btn" disabled={loading} type="submit">
          {initial ? "Save Rule" : "Create Rule"}
        </button>
        {onCancel && (
          <button className="btn" type="button" onClick={onCancel} style={{ background: "#ccc", color: "#111" }}>
            Cancel
          </button>
        )}
      </div>
      {err && <div style={{ color: "red", fontSize: 14, marginTop: 3 }}>{err}</div>}
    </form>
  );
}

export default RuleForm;
