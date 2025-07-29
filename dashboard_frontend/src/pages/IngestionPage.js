import React, { useEffect, useState, useRef } from "react";
import { ingestFile, getMappedFolders, mapIngestionFolder } from "../api";
import DataTable from "../components/DataTable";
import ConfigForm from "../components/ConfigForm";
import InfoCard from "../components/InfoCard";

/**
 * PUBLIC_INTERFACE
 * IngestionPage is now Data Configuration: folder mapping management plus file ingestion.
 * Shows mapped folders, add-mapping form, and file upload with feedback.
 */
function IngestionPage() {
  // File upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInput = useRef();

  // Folder mappings state
  const [folders, setFolders] = useState([]);
  const [folderLoading, setFolderLoading] = useState(false);
  const [folderError, setFolderError] = useState(null);

  // Add folder form
  const [newFolder, setNewFolder] = useState({ path: "", alias: "" });
  const [adding, setAdding] = useState(false);

  // On mount: fetch folder mappings
  useEffect(() => {
    setFolderLoading(true);
    setFolderError(null);
    getMappedFolders()
      .then((f) => setFolders(f))
      .catch(e => setFolderError(e?.message || "Unable to load folders"))
      .finally(() => setFolderLoading(false));
  }, []);

  // Folder mapping form logic
  function handleFolderChange(name, value) {
    setNewFolder(f => ({ ...f, [name]: value }));
  }
  function handleFolderSubmit(ev) {
    ev.preventDefault();
    setAdding(true);
    setFolderError(null);
    mapIngestionFolder(newFolder)
      .then(folder => setFolders(old => [...old, folder]))
      .catch(e => setFolderError(e?.message || "Could not add folder"))
      .finally(() => setAdding(false));
  }

  // File ingestion
  const handleFileChange = (e) => {
    setError(null);
    setResult(null);
    setSelectedFile(e.target.files[0]);
  };
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select a file.");
      return;
    }
    setUploading(true);
    setError(null);
    setResult(null);
    try {
      const res = await ingestFile(selectedFile);
      setResult(res);
    } catch (e) {
      setError(e?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="page-content">
      <h1 className="section-title">Data Configuration</h1>
      <div className="section-description">
        Configure monitored folders, map sources, and manage ingestion.
      </div>
      <InfoCard
        title="Mapped Source Folders"
        description="Folders automatically monitored for new files to ingest."
      >
        {folderLoading && <div>Loading mapped folders...</div>}
        {folderError && <div style={{ color: "red" }}>Error: {folderError}</div>}
        {!folderLoading && !folderError && (
          <DataTable
            columns={[
              { title: "Path", key: "path" },
              { title: "Alias", key: "alias" }
            ]}
            data={folders}
          />
        )}
      </InfoCard>
      <InfoCard
        title="Add Folder"
        description="Add a new folder to be monitored for ingestion"
      >
        <ConfigForm
          fields={[
            { label: "Folder Path", name: "path", value: newFolder.path, type: "text" },
            { label: "Alias", name: "alias", value: newFolder.alias, type: "text" }
          ]}
          onChange={handleFolderChange}
          onSubmit={handleFolderSubmit}
          submitLabel="Add Folder"
          disabled={adding}
        />
      </InfoCard>
      <InfoCard
        title="Manual File Ingestion"
        description="Ingest (upload) an Excel, PPT, PDF, or Word file"
      >
        <form onSubmit={handleUpload} style={{ margin: "10px 0" }}>
          <input
            type="file"
            ref={fileInput}
            accept=".xlsx,.xls,.ppt,.pptx,.pdf,.doc,.docx"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <button
            className="btn"
            style={{ marginLeft: 12 }}
            type="submit"
            disabled={uploading || !selectedFile}
          >
            {uploading ? "Uploading..." : "Upload File"}
          </button>
        </form>
        {error && (
          <div style={{ color: "red", marginBottom: 6 }}>Error: {error}</div>
        )}
        {result && (
          <div style={{ color: "#0a0", marginBottom: 6 }}>
            Success! Uploaded: <strong>{result.filename}</strong>
            <span style={{ marginLeft: 12 }}>Status: {result.status}</span>
          </div>
        )}
      </InfoCard>
    </div>
  );
}

export default IngestionPage;
