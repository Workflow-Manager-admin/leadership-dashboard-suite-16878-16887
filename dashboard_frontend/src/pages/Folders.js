import React, { useState, useEffect } from "react";
import { apiGet, apiPost, apiDelete, apiFileUpload } from "../api";

// PUBLIC_INTERFACE
function Folders() {
  const [folders, setFolders] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ folder_path: "", mapping_type: "local", meta: {} });
  // State for file upload
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(""); // "", "uploading", "done", "error"
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    apiGet("/folders/").then(setFolders);
  }, [refresh]);

  function handleCreate(e) {
    e.preventDefault();
    // Formulate payload strictly per FolderMapping API
    let { folder_path, mapping_type, meta, ...maybeExtras } = form;
    // Remove folder_id if present, only send required keys (do not send undefined/empty meta)
    let payload = { folder_path, mapping_type };
    if (meta && Object.keys(meta).length > 0) payload.meta = meta;
    apiPost("/folders/", payload)
      .then(() => {
        setForm({ folder_path: "", mapping_type: "local", meta: {} });
        setCreating(false);
        setRefresh(v => v+1);
      })
      .catch(error => {
        // Friendly error display
        alert("Failed to create folder mapping: " + error.message);
      });
  }

  function handleDelete(fid) {
    apiDelete(`/folders/${fid}`).then(() => setRefresh(v=>v+1));
  }

  // File upload handlers
  function handleFileChange(e) {
    setUploadFile(e.target.files[0] || null);
    setUploadStatus("");
    setUploadError("");
  }

  async function handleFileUpload(e) {
    e.preventDefault();
    setUploadStatus("");
    setUploadError("");
    if (!uploadFile) {
      setUploadError("Please select a file.");
      return;
    }
    setUploadStatus("uploading");
    try {
      const result = await apiFileUpload("/files/upload", uploadFile);
      setUploadStatus("done");
      setUploadError("");
      // Optionally, show status returned from backend (success, detected_type, etc.)
      setUploadStatus(`Upload successful! (${result.file_name}, type: ${result.detected_type}, status: ${result.status})`);
      setUploadFile(null);
      // Optionally: refresh file list, etc
    } catch (err) {
      setUploadError("Upload failed: " + (err.message || "Unknown error"));
      setUploadStatus("error");
    }
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

      {/* File Upload Section */}
      <div style={{
        margin: "32px 0", padding: "18px 16px", background: "var(--bg-secondary, #f8f9fa)",
        borderRadius: 8, border: "1px solid var(--border-color, #e9ecef)", maxWidth: 420
      }}>
        <h3>Upload File for Ingestion</h3>
        <form onSubmit={handleFileUpload} style={{display: "flex", flexDirection: "column", gap: 10}}>
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.docx,.xlsx,.pptx" // Accept all supported types
            disabled={uploadStatus === "uploading"}
            style={{marginBottom: 6}}
          />
          <button type="submit" disabled={!uploadFile || uploadStatus === "uploading"}>
            {uploadStatus === "uploading" ? "Uploading..." : "Upload"}
          </button>
        </form>
        {/* Status or error display */}
        <div style={{marginTop: 8}}>
          {uploadStatus && uploadStatus !== "error" && <span style={{color: "#1A7A41"}}>{uploadStatus}</span>}
          {uploadError && <span style={{color: "#C13232"}}>{uploadError}</span>}
        </div>
      </div>

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
