import React, { useEffect, useState } from "react";
import { listFilesForTagging, getFileTags, setFileTags } from "../api";
import Modal from "./Modal";

/**
 * PUBLIC_INTERFACE
 * ManualTagging — UI for listing ingested files and classifying/tagging them manually.
 * Props:
 *   - none (self-manages state and API calls)
 */
function ManualTagging() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null); // filename
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);

  function fetchFiles() {
    setLoading(true);
    setError(null);
    listFilesForTagging()
      .then((f) => setFiles(f))
      .catch((e) => setError(e?.message || "Error loading files"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchFiles();
  }, []);

  async function openTagModal(filename) {
    setSaveLoading(true);
    setSelected(filename);
    setMsg(null);
    setTags([]);
    setTagInput("");
    setModalOpen(true);
    try {
      const res = await getFileTags(filename);
      setTags(Array.isArray(res.tags) ? res.tags : []);
      setTagInput(Array.isArray(res.tags) ? res.tags.join(", ") : "");
    } catch (e) {
      setMsg({ type: "error", msg: e?.message || "Could not fetch tags" });
    } finally {
      setSaveLoading(false);
    }
  }

  async function saveTags() {
    setSaveLoading(true);
    let arr = tagInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    try {
      await setFileTags({ filename: selected, tags: arr });
      setMsg({ type: "success", msg: "Tags updated!" });
      fetchFiles();
      setModalOpen(false);
    } catch (e) {
      setMsg({ type: "error", msg: e?.message || "Failed to save tags" });
    } finally {
      setSaveLoading(false);
    }
  }

  return (
    <div>
      <h2 style={{ margin: "7px 0 12px 0", fontWeight: 700 }}>Ingested Files for Tagging</h2>
      {loading && <div>Loading files...</div>}
      {error && <div style={{ color: "red" }}>Error: {error}</div>}
      {!loading && !error && (
        <table style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "var(--background-tertiary)",
          borderRadius: 9,
          border: "1.2px solid var(--border-color)",
          fontFamily: "var(--font-main)",
          fontSize: "1rem",
          marginBottom: "22px"
        }}>
          <thead>
            <tr>
              <th style={{ padding: "11px 16px", color: "var(--accent)" }}>Filename</th>
              <th style={{ padding: "11px 16px", color: "var(--accent)" }}>Tags</th>
              <th style={{ padding: "11px 16px", color: "var(--accent)" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {files.length > 0 ? (
              files.map((file, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "9px 13px" }}>{file.filename}</td>
                  <td style={{ padding: "9px 13px" }}>{Array.isArray(file.tags) ? file.tags.join(", ") : ""}</td>
                  <td style={{ padding: "9px 13px" }}>
                    <button
                      className="btn"
                      style={{ fontSize: 13, padding: "4px 11px" }}
                      onClick={() => openTagModal(file.filename)}
                    >
                      Tag/Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} style={{ color: "#888", padding: 18, textAlign: "center" }}>
                  No ingested files found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={`Tag file: ${selected}`}>
        <div>
          <label>
            Tags (comma-separated):<br />
            <input
              type="text"
              style={{ width: 320, marginTop: 7 }}
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              disabled={saveLoading}
            />
          </label>
          <div style={{ marginTop: 14, display: "flex", gap: 16 }}>
            <button className="btn" onClick={saveTags} disabled={saveLoading}>
              Save Tags
            </button>
            <button className="btn" onClick={() => setModalOpen(false)} style={{ background: "#ccc", color: "#111" }}>
              Cancel
            </button>
          </div>
          {msg && (
            <div style={{ color: msg.type === "error" ? "red" : "#107810", marginTop: 8, fontWeight: 500 }}>
              {msg.msg}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default ManualTagging;
