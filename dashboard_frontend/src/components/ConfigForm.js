import React from "react";

/**
 * PUBLIC_INTERFACE
 * ConfigForm — generic config/settings form component (stub; extend for actual forms).
 * Props:
 *   - fields: Array<{ label: string, name: string, type?: string, value?: any }>
 *   - onChange: function (name, value)
 *   - onSubmit: function (event)
 *   - submitLabel: string
 *   - disabled: boolean
 */
function ConfigForm({ fields = [], onChange, onSubmit, submitLabel = "Save", disabled }) {
  return (
    <form onSubmit={onSubmit} style={{
      display: "flex",
      flexDirection: "column",
      gap: 18,
      padding: "14px 0"
    }}>
      {fields.map(f =>
        <label key={f.name} style={{ color: "var(--text-primary)", fontWeight: 600 }}>
          {f.label}
          <input
            style={{
              marginLeft: 13,
              background: "var(--background-secondary)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-color)",
              borderRadius: 5,
              padding: "8px 12px"
            }}
            type={f.type || "text"}
            value={f.value || ""}
            disabled={disabled}
            onChange={e => onChange(f.name, e.target.value)}
            name={f.name}
          />
        </label>
      )}
      <button className="btn" disabled={disabled} type="submit">
        {submitLabel}
      </button>
    </form>
  );
}

export default ConfigForm;
