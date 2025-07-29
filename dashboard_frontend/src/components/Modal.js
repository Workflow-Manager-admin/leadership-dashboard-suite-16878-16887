import React from "react";

/**
 * PUBLIC_INTERFACE
 * Modal UI component. Can be used for dialogs, popups, confirmations etc.
 * Props:
 *   - isOpen (boolean): Show modal dialog when true
 *   - onClose (function): Callback for closing modal
 *   - children: Modal content
 */
function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="modal-backdrop" style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.25)",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div className="modal" style={{
        background: "var(--background-tertiary)",
        color: "var(--text-primary)",
        borderRadius: 14,
        minWidth: 340,
        minHeight: 120,
        maxWidth: "95vw",
        maxHeight: "88vh",
        boxShadow: "var(--shadow)",
        padding: 28,
        textAlign: "left",
        position: "relative",
        border: "1.6px solid var(--border-color)"
      }}>
        {title && <h2 style={{margin:"0 0 16px 0"}}>{title}</h2>}
        <button
          onClick={onClose}
          aria-label="Close Modal"
          style={{
            position: "absolute",
            top: 11,
            right: 12,
            fontSize: 18,
            background: "none",
            border: "none",
            color: "inherit",
            cursor: "pointer",
          }}
        >
          &#10005;
        </button>
        <div>{children || <div>[Stub Modal Content]</div>}</div>
      </div>
    </div>
  );
}

export default Modal;
