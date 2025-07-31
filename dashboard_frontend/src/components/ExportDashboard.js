import React, { useState } from "react";
import Modal from "./Modal";
import { exportDashboard } from "../api";

/**
 * PUBLIC_INTERFACE
 * ExportDashboard — UI to export the current dashboard in multiple formats (PDF, PPT, HTML).
 * Handles export selection, triggers backend export, downloads file, and shows user notifications.
 * 
 * Props:
 *   - dashboardId: string (required) dashboard id to export
 *   - dashboardTitle: string (optional) for labeling
 */
function ExportDashboard({ dashboardId, dashboardTitle }) {
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState("pdf"); // "pdf"|"ppt"|"html"
  const [exporting, setExporting] = useState(false);
  const [notice, setNotice] = useState(null);

  // Called when user clicks export
  const handleExport = async (e) => {
    e && e.preventDefault && e.preventDefault();
    setNotice(null);

    if (!dashboardId) {
      setNotice({ type: "error", msg: "No dashboard selected for export." });
      return;
    }

    setExporting(true);
    try {
      // Call backend API for export
      const res = await exportDashboard({
        dashboard_id: dashboardId,
        format: exportFormat,
      });
      if (!res || !res.url) throw new Error("Export failed: No download URL");
      // Download the file
      await downloadFileFromUrl(res.url, `${dashboardTitle || dashboardId || "dashboard"}.${exportFormat}`);
      setExportModalOpen(false);
      setNotice({ type: "success", msg: `Exported successfully as ${exportFormat.toUpperCase()}.` });
    } catch (e) {
      setNotice({ type: "error", msg: e && e.message ? e.message : "Export failed" });
    } finally {
      setExporting(false);
    }
  };

  // Helper to trigger browser download for backend-provided file URL
  async function downloadFileFromUrl(url, filename) {
    // Download as BLOB to support non-CORS and trigger download dialog
    const resp = await fetch(url, { credentials: "include" });
    if (!resp.ok) throw new Error("Failed to download exported file");
    const blob = await resp.blob();
    // For modern browsers
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      window.URL.revokeObjectURL(link.href);
      document.body.removeChild(link);
    }, 2000);
  }

  const formatOptions = [
    { key: "pdf", label: "PDF" },
    { key: "ppt", label: "PowerPoint (PPTX)" },
    { key: "html", label: "HTML" },
  ];

  return (
    <div>
      <button
        className="btn"
        onClick={() => setExportModalOpen(true)}
        style={{ marginRight: 14, padding: "8px 18px", fontSize: 16 }}>
        ⤓ Export Dashboard
      </button>
      {/* Export dialog/modal */}
      <Modal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        title="Export Dashboard"
      >
        <form onSubmit={handleExport} style={{ display: "flex", flexDirection: "column", gap: 15, minWidth: 320 }}>
          <div>
            <strong>Choose export format:</strong>
            <div style={{ display: "flex", gap: 18, marginTop: 9 }}>
              {formatOptions.map(f =>
                <label key={f.key} style={{
                  fontWeight: 500, color: f.key === exportFormat ? "var(--accent)" : "var(--text-primary)", fontSize: 15, cursor: "pointer",
                }}>
                  <input
                    type="radio"
                    name="exportFormat"
                    value={f.key}
                    checked={exportFormat === f.key}
                    onChange={() => setExportFormat(f.key)}
                    style={{ marginRight: 5 }}
                    disabled={exporting}
                  />
                  {f.label}
                </label>
              )}
            </div>
          </div>
          <div style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 10 }}>
            <button className="btn" type="submit" disabled={exporting}>
              {exporting ? "Exporting..." : `Export as ${formatOptions.find(f => f.key === exportFormat)?.label}`}
            </button>
            <button
              className="btn"
              type="button"
              style={{ background: "#ccc", color: "#111" }}
              onClick={() => setExportModalOpen(false)}
              disabled={exporting}
            >
              Cancel
            </button>
          </div>
          {notice && (
            <div style={{
              color: notice.type === "error" ? "red" : "#08a408",
              fontWeight: 600, marginTop: 11
            }}>
              {notice.msg}
            </div>
          )}
        </form>
      </Modal>
      {/* Top-level notification, visible outside modal */}
      {notice && !exportModalOpen && (
        <div style={{
          color: notice.type === "error" ? "red" : "#08a408",
          fontWeight: 600,
          margin: "8px 0",
          fontSize: 15,
        }}>
          {notice.msg}
        </div>
      )}
    </div>
  );
}

export default ExportDashboard;
