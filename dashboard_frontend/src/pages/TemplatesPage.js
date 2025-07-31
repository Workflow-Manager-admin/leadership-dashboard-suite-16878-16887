import React, { useState } from "react";
import InfoCard from "../components/InfoCard";
import TemplateManager from "../components/TemplateManager";

/**
 * PUBLIC_INTERFACE
 * TemplatesPage handles dashboard template creation and management.
 * Integrates a modal for creation and edit, and supports applying templates.
 */
function TemplatesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [reuseMsg, setReuseMsg] = useState(null);

  // Called when "Apply" is clicked in TemplateManager component
  function handleApplyTemplate(template) {
    setReuseMsg({
      type: "success",
      msg: `Template "${template.name || template.template_id}" selected. [Integrate this logic with dashboard apply API.]`
    });
    setModalOpen(false);
    // Optionally: integrate actual dashboard update logic here or redirect user to dashboard config.
  }

  return (
    <div className="page-content">
      <h1 className="section-title">Templates</h1>
      <div className="section-description">
        Dashboards can be saved, managed, or reused as templates.
      </div>
      <InfoCard
        title="Template Management"
        description="Use templates to reuse dashboard layouts, KPIs, and chart configs. Edit and apply templates via the library below."
      >
        <button
          className="btn"
          style={{ fontSize: 15, marginBottom: 9 }}
          onClick={() => setModalOpen(true)}
        >
          Open Template Library
        </button>
        <span style={{ color: "#888", marginLeft: 10, fontSize: 13 }}>
          View, create, edit, and apply dashboard templates.
        </span>
        <TemplateManager
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSelect={handleApplyTemplate}
        />
        {reuseMsg && (
          <div style={{
            color: reuseMsg.type === "error" ? "red" : "#08a408",
            fontWeight: 600,
            marginTop: 15,
            fontSize: 15
          }}>
            {reuseMsg.msg}
          </div>
        )}
      </InfoCard>
      <p style={{ color: "#777" }}>
        Download, manage, and reuse dashboard templates for fast dashboard config.
      </p>
    </div>
  );
}

export default TemplatesPage;
