import React, { useState } from "react";
import { apiGet } from "../api";

// PUBLIC_INTERFACE
function Export() {
  const [dashboardId, setDashboardId] = useState("");
  const [status, setStatus] = useState("");

  function doExport(type) {
    let route = {
      pdf: "/export/pdf",
      ppt: "/export/ppt",
      html: "/export/html",
    }[type];
    if (!dashboardId) return setStatus("No dashboard ID");
    apiGet(route, { dashboard_id: dashboardId })
      .then(() => setStatus(`${type.toUpperCase()} export started.`))
      .catch(e => setStatus("Export failed: "+e.message));
  }

  return (
    <section>
      <h2>Export Dashboard</h2>
      <input placeholder="Dashboard ID" value={dashboardId} onChange={e=>setDashboardId(e.target.value)} />
      <button onClick={()=>doExport("pdf")}>Export to PDF</button>
      <button onClick={()=>doExport("ppt")}>Export to PPT</button>
      <button onClick={()=>doExport("html")}>Export to HTML</button>
      <div>{status}</div>
    </section>
  );
}
export default Export;
