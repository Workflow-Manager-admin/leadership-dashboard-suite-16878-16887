import React from "react";
import InfoCard from "../components/InfoCard";
import ScheduleManagement from "../components/ScheduleManagement";

/**
 * PUBLIC_INTERFACE
 * SchedulePage handles reporting schedule and email delivery.
 */
function SchedulePage() {
  return (
    <div className="page-content">
      <h1 className="section-title">Report Scheduling</h1>
      <div className="section-description">
        Manage scheduled delivery of dashboard reports via email. View, create, edit, or delete report schedules.
      </div>
      <InfoCard
        title="Schedule Management"
        description="Configure scheduled dashboard report deliveries. Uses CRON format for flexible scheduling."
      >
        <ScheduleManagement />
      </InfoCard>
      <p style={{ color: "#888", fontSize: 13, marginTop: 15 }}>
        Reports will be delivered to the specified email address at the scheduled times. Use standard CRON to define timing.
      </p>
    </div>
  );
}

export default SchedulePage;
