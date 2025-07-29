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
        <label
          key={f.name}
          style={{
            color: "var(--text-primary)",
            fontWeight: 600,
            marginBottom: 2,
            fontSize: "1rem"
          }}
        >
          {f.label}
          <input
            style={{
              marginLeft: 13,
              background: "var(--input-bg)",
              color: "var(--text-primary)",
              border: "1.4px solid var(--input-border)",
              borderRadius: 5,
              padding: "8px 13px",
              marginTop: 2,
              marginBottom: 4,
              transition: "var(--transition)",
              fontSize: "1rem",
              boxShadow: "none"
            }}
            type={f.type || "text"}
            value={f.value || ""}
            disabled={disabled}
            onChange={e => onChange(f.name, e.target.value)}
            name={f.name}
            autoComplete="off"
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
