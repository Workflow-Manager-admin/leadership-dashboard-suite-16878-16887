import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";

/**
 * PUBLIC_INTERFACE
 * LoginPage - user login screen.
 * Shows login form, handles login, error display.
 */
function LoginPage() {
  const { login, loading, error, setError } = useAuth();
  const [fields, setFields] = useState({ username: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/";

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(fields.username, fields.password);
      navigate(from, { replace: true });
    } catch {
      // Error handled by context
    } finally {
      setSubmitting(false);
    }
  }

  function handleFieldChange(e) {
    setFields(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  return (
    <div className="page-content" style={{ maxWidth: 420, margin: "56px auto", padding: "36px 34px", background: "var(--background-tertiary)", borderRadius: 12, border: "1.5px solid var(--border-color)", boxShadow: "0 2px 16px 0 #0a459c18" }}>
      <h1 className="section-title" style={{ marginBottom: 10 }}>Sign In</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <label>
          Username or Email
          <input
            style={{ width: "100%", marginTop: 7 }}
            name="username"
            type="text"
            value={fields.username}
            onChange={handleFieldChange}
            autoFocus
            required
            disabled={submitting || loading}
          />
        </label>
        <label>
          Password
          <input
            style={{ width: "100%", marginTop: 7 }}
            name="password"
            type="password"
            value={fields.password}
            onChange={handleFieldChange}
            required
            disabled={submitting || loading}
          />
        </label>
        <button className="btn" disabled={submitting || loading} type="submit">
          {submitting || loading ? "Signing in..." : "Sign In"}
        </button>
        {error && (
          <div style={{ color: "red", fontWeight: 600, marginTop: 8 }}>
            {error}
          </div>
        )}
        <div style={{ color: "#555", fontSize: 15, marginTop: 16 }}>
          Don't have an account? <Link to="/register">Register</Link>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
