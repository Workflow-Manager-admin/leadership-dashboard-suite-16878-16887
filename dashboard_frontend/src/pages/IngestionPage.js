import React, { useRef, useState } from "react";
import { ingestFile } from "../api";

/**
 * PUBLIC_INTERFACE
 * IngestionPage manages folder mapping and file ingestion.
 * Shows sample file upload with feedback.
 */
function IngestionPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInput = useRef();

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
      <h1>Ingestion</h1>
      <form onSubmit={handleUpload} style={{ margin: "18px 0" }}>
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
      <p style={{ color: "#777" }}>
        Upload Excel, PowerPoint, PDF, or Word files for ingestion.
      </p>
    </div>
  );
}

export default IngestionPage;
