import React, { useState, useEffect } from "react";
import { apiGet, apiPost } from "../api";

// PUBLIC_INTERFACE
function KPIs() {
  const [kpis, setKpis] = useState([]);
  const [form, setForm] = useState({ name: "", config: {} });

  useEffect(() => { apiGet("/kpi/").then(setKpis); }, []);
  function addKPI(e) {
    e.preventDefault();
    apiPost("/kpi/", form).then(() => {
      setForm({ name:"", config:{} });
      apiGet("/kpi/").then(setKpis);
    });
  }

  return (
    <section>
      <h2>KPI Configuration</h2>
      <ul>
        {kpis.map(k => <li key={k.kpi_id}>{k.name} <small>{JSON.stringify(k.config)}</small></li>)}
      </ul>
      <form className="kpi-form" onSubmit={addKPI}>
        <input required placeholder="KPI name" value={form.name} onChange={e=>setForm(f=>({...f, name:e.target.value}))}/>
        <input placeholder="Config (JSON)" value={JSON.stringify(form.config)} onChange={e=>{
          try { setForm(f=>({...f,config:JSON.parse(e.target.value)})) }
          catch {}
        }} />
        <button>Add KPI</button>
      </form>
    </section>
  );
}
export default KPIs;
