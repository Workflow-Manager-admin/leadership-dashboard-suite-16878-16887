import React, { useEffect, useState } from "react";
import { listTemplates } from "../api";
import DataTable from "../components/DataTable";
import InfoCard from "../components/InfoCard";
import ConfigForm from "../components/ConfigForm";

/**
 * PUBLIC_INTERFACE
 * TemplatesPage handles dashboard template creation and management.
 * Fetches list of templates from backend and displays them.
 */
function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // For creation form stub, not fully implemented
  const [tplFields, setTplFields] = useState({
    name: "",
    template_id: ""
    // config can be extended
  });

  useEffect(() => {
    setLoading(true);
    setError(null);
    listTemplates()
      .then((data) => setTemplates(data))
      .catch((e) => setError(e?.message || "Error loading templates"))
      .finally(() => setLoading(false));
  }, []);

  function handleTplChange(name, value) {
    setTplFields(f => ({ ...f, [name]: value }));
  }
  function handleTplCreate(e) {
    e.preventDefault();
    alert("[Stub: Implement createTemplate()]");
  }

  return (
    <div className="page-content">
      <h1 className="section-title">Templates</h1>
      <div className="section-description">
        Dashboards can be saved, managed, or reused as templates.
      </div>
      <InfoCard
        title="Template Library"
        description="Shows all dashboard templates (saved, reusable configs)."
      >
        {loading && <div>Loading templates...</div>}
        {error && <div style={{ color: "red" }}>Error: {error}</div>}
        {!loading && !error && (
          <DataTable
            columns={[
              { title: "Name", key: "name" },
              { title: "Template ID", key: "template_id" }
            ]}
            data={templates}
          />
        )}
      </InfoCard>
      <InfoCard
        title="Create Template"
        description="Create a new dashboard template for reuse."
      >
        <ConfigForm
          fields={[
            { label: "Name", name: "name", value: tplFields.name, type: "text" },
            { label: "Template ID", name: "template_id", value: tplFields.template_id, type: "text" }
          ]}
          onChange={handleTplChange}
          onSubmit={handleTplCreate}
          submitLabel="Create Template"
          disabled={false}
        />
        <div style={{ color: "#888", fontSize: 13 }}>[Stub: To be implemented]</div>
      </InfoCard>
      <p style={{ color: "#777" }}>
        Download, manage, and reuse dashboard templates.
      </p>
    </div>
  );
}

export default TemplatesPage;
