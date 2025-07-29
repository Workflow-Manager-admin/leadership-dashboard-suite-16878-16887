import React, { useState } from "react";
import { useAuth } from "../auth";
import { Link, Navigate } from "react-router-dom";

/**
 * PUBLIC_INTERFACE
 * RegisterPage for user registration.
 */
function RegisterPage() {
  const { token, register, loading, error, setError, login } = useAuth();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (token) {
    return <Navigate to="/" replace />;
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true); setError(null);
    try {
      await register({ email, full_name: fullName, password });
      setSubmitted(true);
      // Optionally auto-log-in on successful registration
      await login({ email, password, remember: true });
    } catch {}
    setSubmitting(false);
  };

  if (submitted && token) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="page-content" style={{
      maxWidth: 400, margin: "80px auto", background: "var(--bg-secondary,#fafbfe)", borderRadius: 12,
      boxShadow: "0 2px 22px rgba(20,42,93,0.06)", padding: "32px 22px"
    }}>
      <h2 style={{textAlign:"center",marginBottom:8,color:"var(--primary)"}}>Register for SLT Dashboard</h2>
      <form onSubmit={handleSubmit} autoComplete="on">
        <label htmlFor="email" style={{fontWeight:600}}>Email</label>
        <input
          id="email"
          type="email"
          value={email}
          autoComplete="email"
          onChange={e => setEmail(e.target.value)}
          required
          style={{
            width: "100%", marginBottom: 12, borderRadius: 5, padding: "8px 10px", fontSize: 15,
            border: "1px solid var(--border-color,#ccd)", background: "var(--bg-primary,#fff)"
          }}
        />
        <label htmlFor="fullname" style={{fontWeight:600}}>Full Name</label>
        <input
          id="fullname"
          type="text"
          value={fullName}
          autoComplete="name"
          onChange={e => setFullName(e.target.value)}
          required
          style={{
            width: "100%", marginBottom: 12, borderRadius: 5, padding: "8px 10px", fontSize: 15,
            border: "1px solid var(--border-color,#ccd)", background: "var(--bg-primary,#fff)"
          }}
        />
        <label htmlFor="password" style={{fontWeight:600}}>Password</label>
        <input
          id="password"
          type="password"
          value={password}
          autoComplete="new-password"
          onChange={e => setPassword(e.target.value)}
          minLength={6}
          required
          style={{
            width: "100%", marginBottom: 13, borderRadius: 5, padding: "8px 10px", fontSize: 15,
            border: "1px solid var(--border-color,#ccd)", background: "var(--bg-primary,#fff)"
          }}
        />
        <button type="submit" className="btn" style={{
          width: "100%", padding: "10px 0", fontWeight: 700, background: "var(--primary)", color: "white", border: "none", borderRadius: 6,
        }} disabled={submitting || loading}>
          {submitting || loading ? "Registering..." : "Register"}
        </button>
        {error && (<div style={{color:"red",marginTop:8}}>{error}</div>)}
        <div style={{fontSize:14,marginTop:15,textAlign:"center"}}>
          Already registered? <Link to="/login">Login here</Link>
        </div>
      </form>
    </div>
  );
}

export default RegisterPage;
