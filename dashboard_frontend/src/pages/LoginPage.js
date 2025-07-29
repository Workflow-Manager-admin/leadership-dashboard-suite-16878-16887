import React, { useState } from "react";
import { Navigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth";

/**
 * PUBLIC_INTERFACE
 * LoginPage for SLT dashboard: accepts email & password, authenticates via backend.
 */
function LoginPage() {
  const { token, login, loading, error, setError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const location = useLocation();

  if (token) {
    // Redirect to where the user came from, or dashboard
    const from = (location.state && location.state.from) || "/";
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login({ email, password, remember });
    } catch {
      // handled in hook
    }
    setSubmitting(false);
  };

  return (
    <div className="page-content" style={{
      maxWidth: 400, margin: "80px auto", background: "var(--bg-secondary,#fafbfe)", borderRadius: 12,
      boxShadow: "0 2px 22px rgba(20,42,93,0.06)", padding: "32px 22px"
    }}>
      <h2 style={{textAlign:"center",marginBottom:8,color:"var(--primary)"}}>SLT Dashboard Login</h2>
      <form onSubmit={handleSubmit} autoComplete="on">
        <label htmlFor="email" style={{fontWeight:600}}>Email</label>
        <input
          id="email"
          type="email"
          autoFocus
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoComplete="email"
          required
          style={{
            width: "100%", marginBottom: 12, borderRadius: 5, padding: "8px 10px", fontSize: 15,
            border: "1px solid var(--border-color,#ccd)", background: "var(--bg-primary,#fff)"
          }}
        />
        <label htmlFor="password" style={{
          fontWeight: 600,
          color: "rgb(0, 0, 0)",
          fontFamily: "Verdana, sans-serif",
          fontSize: "16px",
          fontStyle: "normal",
          textDecoration: "none",
          textAlign: "left"
        }}>Password</label>
        <input
          id="password"
          type="password"
          value={password}
          autoComplete="current-password"
          onChange={e => setPassword(e.target.value)}
          required
          style={{
            width: "100%", marginBottom: 13, borderRadius: 5, padding: "8px 10px", fontSize: 15,
            border: "1px solid var(--border-color,#ccd)", background: "var(--bg-primary,#fff)"
          }}
        />
        <div style={{marginBottom:8}}>
          <input type="checkbox" id="remember" checked={remember} onChange={e=>setRemember(e.target.checked)}/> 
          <label htmlFor="remember" style={{marginLeft:8}}>Remember me</label>
        </div>
        <button type="submit" className="btn" style={{
          width: "100%", padding: "10px 0", fontWeight: 700, background: "var(--primary)", color: "white", border: "none", borderRadius: 6,
        }} disabled={submitting || loading}>
          {submitting || loading ? "Logging in..." : "Login"}
        </button>
        {error && (<div style={{color:"red",marginTop:8}}>{error}</div>)}
        <div style={{fontSize:14,marginTop:15,textAlign:"center"}}>
          New to SLT dashboard?{" "}
          <Link to="/register">Register</Link>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
