import React, { useEffect, useState } from "react";
import { apiGet, apiPost } from "../api";

// PUBLIC_INTERFACE
function Scheduling() {
  const [schedules, setSchedules] = useState([]);
  const [form, setForm] = useState({ dashboard_id: "", recipients: "", cron: "", format: "pdf" });
  const [scheduleResult, setScheduleResult] = useState("");
  useEffect(() => { apiGet("/schedule/").then(setSchedules); }, []);
  function addSchedule(e) {
    e.preventDefault();
    apiPost("/schedule/", {...form, recipients: form.recipients.split(",").map(s=>s.trim()) })
      .then(() => apiGet("/schedule/").then(setSchedules));
  }

  function runNow(sid) {
    apiPost("/schedule/run?schedule_id="+encodeURIComponent(sid), {}).then(() =>
      setScheduleResult(`Schedule ${sid} dispatched.`)
    );
  }

  return (
    <section>
      <h2>Scheduling & Reporting</h2>
      <ul>
        {schedules.map(sch =>
          <li key={sch.schedule_id}>
            {sch.dashboard_id} — <code>{sch.cron}</code> — {sch.format} — <small>{sch.recipients.join(", ")}</small>
            <button onClick={()=>runNow(sch.schedule_id)}>Run Now</button>
          </li>
        )}
      </ul>
      <form className="schedule-form" onSubmit={addSchedule}>
        <input required placeholder="Dashboard ID" value={form.dashboard_id} onChange={e=>setForm(f=>({...f,dashboard_id:e.target.value}))}/>
        <input required placeholder="Recipients (comma-separated emails)" value={form.recipients} onChange={e=>setForm(f=>({...f,recipients:e.target.value}))}/>
        <input required placeholder="Cron schedule" value={form.cron} onChange={e=>setForm(f=>({...f,cron:e.target.value}))}/>
        <select value={form.format} onChange={e=>setForm(f=>({...f,format:e.target.value}))}>
          <option value="pdf">PDF</option>
          <option value="ppt">PPT</option>
          <option value="html">HTML</option>
        </select>
        <button>Schedule Report</button>
      </form>
      <div>{scheduleResult}</div>
    </section>
  );
}
export default Scheduling;
