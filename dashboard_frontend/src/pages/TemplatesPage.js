import React, { useEffect, useState } from "react";
import { listTemplates, createTemplate } from "../api";
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
  const [tplFields, setTplFields] = useState({
    name: "",
    template_id: ""
  });
  const [creating, setCreating] = useState(false);
  const [createMsg, setCreateMsg] = useState(null);

  function fetchTemplates() {
    setLoading(true);
    setError(null);
    listTemplates()
      .then((data) => setTemplates(data))
      .catch((e) => setError(e?.message || "Error loading templates"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchTemplates();
  }, []);

  function handleTplChange(name, value) {
    setTplFields(f => ({ ...f, [name]: value }));
  }

  async function handleTplCreate(e) {
    e.preventDefault();
    if (!tplFields.name || !tplFields.template_id) {
      setCreateMsg({ type: "error", msg: "Both Name and Template ID required" });
      return;
    }
    setCreating(true);
    setCreateMsg(null);
    try {
      await createTemplate({
        name: tplFields.name,
        template_id: tplFields.template_id,
        config: {} // minimal, can extend with fields for richer templates
      });
      setCreateMsg({ type: "success", msg: "Template created!"});
      setTplFields({ name: "", template_id: "" });
      fetchTemplates();
    } catch (e) {
      setCreateMsg({ type: "error", msg: e?.message || "Failed to create" });
    } finally {
      setCreating(false);
    }
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
          submitLabel={creating ? "Creating..." : "Create Template"}
          disabled={creating}
        />
        {createMsg && (
          <div style={{
            color: createMsg.type === "error" ? "red" : "#08a408",
            fontSize: 15, margin: "7px 0 0 2px"
          }}>
            {createMsg.msg}
          </div>
        )}
      </InfoCard>
      <p style={{ color: "#777" }}>
        Download, manage, and reuse dashboard templates.
      </p>
    </div>
  );
}

export default TemplatesPage;
