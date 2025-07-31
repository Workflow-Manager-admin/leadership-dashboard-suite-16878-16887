import React from "react";
import InfoCard from "../components/InfoCard";
import ManualTagging from "../components/ManualTagging";

/**
 * PUBLIC_INTERFACE
 * ManualTaggingPage — main UI for manual tagging/classification of files/data.
 */
function ManualTaggingPage() {
  return (
    <div className="page-content">
      <h1 className="section-title">Manual Tagging & Classification</h1>
      <div className="section-description">
        Review ingested/unclassified files. Assign or update tags/classification labels as needed.
      </div>
      <InfoCard
        title="Manual Tagging"
        description="Select a file below and assign tags/classifications. These can be used for analytics, reporting, or triggering auto-tagging rules."
      >
        <ManualTagging />
      </InfoCard>
    </div>
  );
}

export default ManualTaggingPage;
