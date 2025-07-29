import React, { useState } from "react";
import InfoCard from "../components/InfoCard";
import ConfigForm from "../components/ConfigForm";

/**
 * PUBLIC_INTERFACE
 * SettingsPage for preferences and configuration settings.
 */
function SettingsPage() {
  // Example config fields (stub)
  const [fields, setFields] = useState([
    { label: "Theme", name: "theme", value: "Dark", type: "text" },
    { label: "Show Tips", name: "tips", value: "Yes", type: "text" },
    { label: "Notification Email", name: "email", value: "", type: "email" }
  ]);
  const [saving, setSaving] = useState(false);

  function handleFieldChange(name, value) {
    setFields(fs => fs.map(f => f.name === name ? { ...f, value } : f));
  }
  function handleConfigSave(e) {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => setSaving(false), 800); // Stub
    alert("[Stub] Settings saved!");
  }

  return (
    <div className="page-content">
      <h1 className="section-title">Settings</h1>
      <div className="section-description">
        System/application preferences. Edit your user and dashboard-wide settings.
      </div>
      <InfoCard
        title="Configuration"
        description="Change your preferences or dashboard settings"
      >
        <ConfigForm
          fields={fields}
          onChange={handleFieldChange}
          onSubmit={handleConfigSave}
          submitLabel="Save Settings"
          disabled={saving}
        />
        <div style={{ color: "#888", fontSize: 13 }}>[Stub: add more settings/options]</div>
      </InfoCard>
    </div>
  );
}

export default SettingsPage;
