import React, { useState, useEffect } from "react";
import { apiGet, apiPost } from "../api";

// PUBLIC_INTERFACE
function Templates() {
  const [templates, setTemplates] = useState([]);
  const [form, setForm] = useState({ name: "", config: {} });

  useEffect(() => { apiGet("/dashboard/template").then(setTemplates); }, []);

  function addTemplate(e) {
    e.preventDefault();
    apiPost("/dashboard/template", form).then(() => {
      setForm({ name:"", config:{} });
      apiGet("/dashboard/template").then(setTemplates);
    });
  }

  return (
    <section>
      <h2>Dashboard Templates</h2>
      <ul>
        {templates.map(tmp=> <li key={tmp.template_id}>{tmp.name} <small>{JSON.stringify(tmp.config)}</small></li>)}
      </ul>
      <form className="template-form" onSubmit={addTemplate}>
        <input required placeholder="Template name" value={form.name} onChange={e=>setForm(f=>({...f, name:e.target.value}))}/>
        <input placeholder="Config (JSON)" value={JSON.stringify(form.config)} onChange={e=>{
          try { setForm(f=>({...f,config:JSON.parse(e.target.value)})) }
          catch {}
        }} />
        <button>Add Template</button>
      </form>
    </section>
  );
}
export default Templates;
