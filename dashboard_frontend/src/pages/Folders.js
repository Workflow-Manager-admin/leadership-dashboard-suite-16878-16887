import React, { useState, useEffect } from "react";
import { apiGet, apiPost, apiDelete } from "../api";

// PUBLIC_INTERFACE
function Folders() {
  const [folders, setFolders] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ folder_path: "", mapping_type: "local", meta: {} });

  useEffect(() => {
    apiGet("/folders/").then(setFolders);
  }, [refresh]);

  function handleCreate(e) {
    e.preventDefault();
    apiPost("/folders/", form).then(() => {
      setForm({ folder_path: "", mapping_type: "local", meta: {} });
      setCreating(false);
      setRefresh(v => v+1);
    });
  }

  function handleDelete(fid) {
    apiDelete(`/folders/${fid}`).then(() => setRefresh(v=>v+1));
  }

  return (
    <section>
      <h2>Folder Mappings</h2>
      <button onClick={() => setCreating(x => !x)}>
        {creating ? "Cancel" : "Add Folder Mapping"}
      </button>
      {creating &&
        <form className="folder-form" onSubmit={handleCreate}>
          <input
            required
            placeholder="Folder path"
            value={form.folder_path}
            onChange={e=>setForm(f=>({...f, folder_path:e.target.value}))}
          />
          <select
            value={form.mapping_type}
            onChange={e=>setForm(f=>({...f, mapping_type:e.target.value}))}
          >
            <option value="local">Local</option>
            <option value="smb">SMB</option>
            <option value="onedrive">OneDrive</option>
            <option value="gdrive">Google Drive</option>
          </select>
          <button type="submit">Create</button>
        </form>
      }
      <div className="folder-list">
        {folders.map(folder => (
          <div key={folder.folder_id} className="folder-item">
            <span>{folder.folder_path}</span>
            <span>{folder.mapping_type}</span>
            <button onClick={()=>handleDelete(folder.folder_id)}>Delete</button>
          </div>
        ))}
      </div>
    </section>
  );
}
export default Folders;
