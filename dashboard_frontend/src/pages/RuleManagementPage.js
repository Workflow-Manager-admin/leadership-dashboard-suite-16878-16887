import React from "react";
import InfoCard from "../components/InfoCard";
import RuleManagement from "../components/RuleManagement";

/**
 * PUBLIC_INTERFACE
 * RuleManagementPage — main UI for creating, updating, and deleting auto-tagging/classification rules.
 */
function RuleManagementPage() {
  return (
    <div className="page-content">
      <h1 className="section-title">Rule Definition & Management</h1>
      <div className="section-description">
        Define and manage rules for automatic classification and tagging of data/files. Each rule consists of a name, a pattern (text or regex), associated tags, and activation state.
      </div>
      <InfoCard
        title="Manage Auto-tagging Rules"
        description="View, add, edit, or delete rules. Activate rules to enable auto-tagging on future ingested files."
      >
        <RuleManagement />
      </InfoCard>
      <p style={{ color: "#888", marginTop: 10, marginLeft: 6 }}>
        Patterns can use plain text or regular expressions. Multiple tags can be comma-separated.
      </p>
    </div>
  );
}

export default RuleManagementPage;
