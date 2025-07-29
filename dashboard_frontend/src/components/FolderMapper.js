import React, { useEffect, useState } from "react";
import { getMappedFolders, mapIngestionFolder } from "../api";

/**
 * PUBLIC_INTERFACE
 * FolderMapper component for managing ingestion folder mappings.
 * Allows the user to view, add and label folders for backend ingestion monitoring.
 *
 * Props:
 *   - None (handles own state and uses API calls)
 */
function FolderMapper() {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addPath, setAddPath] = useState("");
  const [addAlias, setAddAlias] = useState("");
  const [mapping, setMapping] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getMappedFolders()
      .then((data) => setFolders(Array.isArray(data) ? data : []))
      .catch((e) => setError(e?.message || "Failed to fetch mapped folders"))
      .finally(() => setLoading(false));
  }, [mapping, successMsg]);

  // Handler for adding new folder mapping
  const handleAddMapping = async (e) => {
    e.preventDefault();
    if (!addPath.trim()) {
      setError("Folder path required.");
      return;
    }
    if (!addAlias.trim()) {
      setError("Folder alias required.");
      return;
    }
    setMapping(true);
    setError(null);
    setSuccessMsg(null);
    try {
      await mapIngestionFolder({ path: addPath, alias: addAlias });
      setSuccessMsg("Folder mapped successfully.");
      setAddPath("");
      setAddAlias("");
    } catch (e) {
      setError(e?.message || "Mapping failed");
    } finally {
      setMapping(false);
    }
  };

  return (
    <section
      style={{
        border: "1px solid var(--border-color, #e2e3ef)",
        borderRadius: 10,
        padding: "18px 22px 16px 22px",
        background: "var(--bg-secondary, #f6f8fa)",
        margin: "1.5rem 0",
        maxWidth: 500,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      <h2 style={{ marginTop: 0, fontSize: 19 }}>Ingestion Folder Mapping</h2>

      <form onSubmit={handleAddMapping} style={{ marginBottom: 12 }}>
        <input
          type="text"
          placeholder="Folder path (absolute or relative)"
          value={addPath}
          onChange={e => setAddPath(e.target.value)}
          style={{
            width: "48%",
            marginRight: 8,
            padding: "6px 8px",
            border: "1px solid var(--border-color,#ccc)",
            borderRadius: 5,
            fontSize: 15,
          }}
          disabled={mapping}
          required
        />
        <input
          type="text"
          placeholder="Folder label/alias"
          value={addAlias}
          onChange={e => setAddAlias(e.target.value)}
          style={{
            width: "34%",
            marginRight: 8,
            padding: "6px 8px",
            border: "1px solid var(--border-color,#ccc)",
            borderRadius: 5,
            fontSize: 15,
          }}
          disabled={mapping}
          required
        />
        <button
          type="submit"
          className="btn"
          style={{
            padding: "7px 15px",
            fontWeight: 600,
            borderRadius: 6,
            background: "var(--button-bg,#0057B8)",
            color: "var(--button-text,white)",
            border: "none",
          }}
          disabled={mapping}
        >
          {mapping ? "Mapping..." : "Add"}
        </button>
      </form>
      {error && (
        <div style={{ color: "red", marginBottom: 6, fontSize: 15 }}>
          Error: {error}
        </div>
      )}
      {successMsg && (
        <div style={{ color: "#099b37", marginBottom: 6, fontSize: 15 }}>
          {successMsg}
        </div>
      )}
      <div style={{marginTop:10}}>
        <div style={{fontWeight:500, marginBottom: 8, fontSize:16}}>Mapped Folders:</div>
        {loading ? (
          <div style={{ color: "#808" }}>Loading...</div>
        ) : folders.length === 0 ? (
          <div style={{ color: "#888" }}>(No folders mapped.)</div>
        ) : (
          <ul style={{paddingLeft:18, margin:"7px 0"}}>
            {folders.map((f, i) => (
              <li key={i} style={{marginBottom:3,fontSize:15}}>
                <span role="img" aria-label="folder" style={{marginRight:4}}>📁</span>
                <strong>{f.alias || "(no label)"}</strong>
                <span style={{marginLeft:7, color:"#666", fontSize:13}} title={f.path}>
                  {f.path}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div style={{color:"#708090", fontSize:13, marginTop:16}}>
        Add and label folders to be watched for file ingestion.
      </div>
    </section>
  );
}

export default FolderMapper;
