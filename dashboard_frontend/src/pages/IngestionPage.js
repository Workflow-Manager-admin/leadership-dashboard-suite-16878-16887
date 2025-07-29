import React, { useRef, useState } from "react";
import { ingestFile } from "../api";
import FolderMapper from "../components/FolderMapper";

/**
 * PUBLIC_INTERFACE
 * IngestionPage provides the end-to-end ingestion workflow:
 * - Folder mapping/management (FolderMapper)
 * - Single file upload for supported formats
 * - Progress/status/error for both with backend integration
 */
function IngestionPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const fileInput = useRef();

  const handleFileChange = (e) => {
    setUploadError(null);
    setUploadResult(null);
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadError("Please select a file.");
      return;
    }
    setUploading(true);
    setUploadError(null);
    setUploadResult(null);
    try {
      const res = await ingestFile(selectedFile);
      setUploadResult(res);
      setSelectedFile(null);
      if (fileInput && fileInput.current) fileInput.current.value = "";
    } catch (e) {
      setUploadError(e?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="page-content">
      <h1>Ingestion</h1>
      {/* SECTION: FOLDER MAPPING */}
      <FolderMapper />

      {/* SECTION: FILE UPLOAD */}
      <section
        style={{
          border: "1px solid var(--border-color, #e2e3ef)",
          borderRadius: 10,
          padding: "18px 22px",
          background: "var(--bg-secondary, #f6f8fa)",
          margin: "1.5rem 0 1.2rem 0",
          maxWidth: 500,
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        <h2 style={{ marginTop: 0, fontSize: 19 }}>Direct File Upload</h2>
        <form onSubmit={handleUpload} style={{ margin: "12px 0 14px 0" }}>
          <input
            type="file"
            ref={fileInput}
            accept=".xlsx,.xls,.ppt,.pptx,.pdf,.doc,.docx"
            onChange={handleFileChange}
            disabled={uploading}
            style={{
              padding: "5px 0",
              fontSize: "15px"
            }}
          />
          <button
            className="btn"
            style={{
              marginLeft: 14,
              padding: "7px 18px",
              fontWeight: 600,
              borderRadius: 6,
              background: "var(--button-bg,#0057B8)",
              color: "var(--button-text,white)",
              border: "none",
            }}
            type="submit"
            disabled={uploading || !selectedFile}
          >
            {uploading ? "Uploading..." : "Upload File"}
          </button>
        </form>

        {uploadError && (
          <div style={{ color: "red", marginBottom: 6 }}>Error: {uploadError}</div>
        )}
        {uploadResult && (
          <div style={{ color: "#099b37", marginBottom: 6 }}>
            Success! Uploaded: <strong>{uploadResult.filename}</strong>
            <span style={{ marginLeft: 12 }}>Status: {uploadResult.status}</span>
          </div>
        )}
        <div style={{ color: "#727272", fontSize: "14px" }}>
          Upload Excel, PowerPoint, PDF, or Word files directly for ingestion.<br />
          To automate, map folders above and drop files there.
        </div>
      </section>
    </div>
  );
}

export default IngestionPage;
