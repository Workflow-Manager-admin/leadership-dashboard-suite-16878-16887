import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";

/**
 * PUBLIC_INTERFACE
 * RegisterPage - user registration screen.
 * Allows new user to sign up.
 */
function RegisterPage() {
  const { register, loading, error, setError } = useAuth();
  const [fields, setFields] = useState({ username: "", password: "", email: "" });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await register(fields.username, fields.password, fields.email);
      navigate("/", { replace: true });
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
    <div className="page-content" style={{ maxWidth: 450, margin: "56px auto", padding: "36px 34px", background: "var(--background-tertiary)", borderRadius: 12, border: "1.5px solid var(--border-color)", boxShadow: "0 2px 16px 0 #0a459c18" }}>
      <h1 className="section-title" style={{ marginBottom: 10 }}>Register</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <label>
          Username
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
          Email
          <input
            style={{ width: "100%", marginTop: 7 }}
            name="email"
            type="email"
            value={fields.email}
            onChange={handleFieldChange}
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
          {submitting || loading ? "Submitting..." : "Register"}
        </button>
        {error && (
          <div style={{ color: "red", fontWeight: 600, marginTop: 8 }}>
            {error}
          </div>
        )}
        <div style={{ color: "#555", fontSize: 15, marginTop: 16 }}>
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </form>
    </div>
  );
}

export default RegisterPage;
