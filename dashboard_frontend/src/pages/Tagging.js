import React, { useState, useEffect } from "react";
import { apiGet, apiPost } from "../api";

// PUBLIC_INTERFACE
function Tagging() {
  const [tags, setTags] = useState([]);
  const [rules, setRules] = useState([]);
  const [createTag, setCreateTag] = useState({ name: "", color: "#FEE715", description: "" });
  const [createRule, setCreateRule] = useState({ rule_type: "default", definition: {} });

  useEffect(() => { apiGet("/tagging/tags").then(setTags); }, []);
  useEffect(() => { apiGet("/tagging/rules").then(setRules); }, []);

  function addTag(e) {
    e.preventDefault();
    apiPost("/tagging/tags", createTag).then(() => {
      setCreateTag({ name: "", color: "#FEE715", description: "" });
      apiGet("/tagging/tags").then(setTags);
    });
  }

  function addRule(e) {
    e.preventDefault();
    apiPost("/tagging/rules", createRule).then(() => {
      setCreateRule({ rule_type: "default", definition: {} });
      apiGet("/tagging/rules").then(setRules);
    });
  }

  return (
    <section>
      <h2>Manual Tagging & Rules</h2>
      <div className="tags-list">
        <h4>Tags</h4>
        {tags.map(tag => <span key={tag.tag_id} style={{background:tag.color, borderRadius: "4px", padding: "2px 10px", margin:"3px"}}>{tag.name}</span>)}
      </div>
      <form className="tag-form" onSubmit={addTag}>
        <input required placeholder="New tag" value={createTag.name} onChange={e=>setCreateTag(t=>({...t,name:e.target.value}))} />
        <input type="color" value={createTag.color} onChange={e=>setCreateTag(t=>({...t, color: e.target.value}))} />
        <input placeholder="Description" value={createTag.description} onChange={e=>setCreateTag(t=>({...t, description:e.target.value}))} />
        <button>Add Tag</button>
      </form>
      <h4>Tag Rules</h4>
      <div style={{marginBottom: 8}}>
        {rules.map(rule => (
          <div key={rule.rule_id} style={{margin:"5px 0",border:"1px solid #eee",padding:4}}>
            <strong>{rule.rule_type}</strong> — <code>{JSON.stringify(rule.definition)}</code>
          </div>
        ))}
      </div>
      <form className="tag-rule-form" onSubmit={addRule}>
        <input placeholder="Type" value={createRule.rule_type} onChange={e=>setCreateRule(r=>({...r,rule_type:e.target.value}))} />
        <input placeholder="Definition (JSON)" value={JSON.stringify(createRule.definition)} onChange={e=>{
          try { setCreateRule(r=>({...r,definition: JSON.parse(e.target.value)})); }
          catch {}
        }}/>
        <button>Add Rule</button>
      </form>
    </section>
  );
}
export default Tagging;
