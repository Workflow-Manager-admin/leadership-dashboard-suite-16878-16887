import React, { createContext, useContext, useState, useEffect } from "react";

// ----------------------------------------------------------------------------
// PUBLIC_INTERFACE
// AuthProvider - authentication and user session context, managing JWT/session state.
// Wraps the app, makes user, login, logout, register etc. available via context.
// ----------------------------------------------------------------------------

// Auth context
const AuthContext = createContext();

// Helper: load/save access token in localStorage
const TOKEN_KEY = "slt_dashboard_token";

// Backend API endpoints
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

// Util: extract user info from JWT (basic, no validation)
function parseJwt(token) {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch {
    return null;
  }
}

// Auth API: login, logout, register, fetch/me
async function apiLogin(username, password) {
  // Expects: POST /api/auth/login { username, password }
  const resp = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    credentials: "include",
  });
  if (!resp.ok) throw new Error("Invalid credentials.");
  const data = await resp.json();
  if (!data.token) throw new Error("No token returned.");
  return data.token;
}

// Registration
async function apiRegister(username, password, email) {
  // Expects: POST /api/auth/register { username, password, email }
  const resp = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, email }),
    credentials: "include",
  });
  if (!resp.ok) {
    const detail = await resp.text();
    throw new Error(detail || "Registration failed.");
  }
  const data = await resp.json();
  if (!data.token) throw new Error("No token returned.");
  return data.token;
}

// Optional: Fetch current user profile from backend
async function apiProfile(token) {
  const resp = await fetch(`${API_URL}/api/auth/me`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    credentials: "include",
  });
  if (!resp.ok) throw new Error("Could not fetch user profile.");
  return await resp.json();
}

// Auth context provider
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => parseJwt(localStorage.getItem(TOKEN_KEY)));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // When token changes, update user and store in localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      setUser(parseJwt(token));
    } else {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    }
  }, [token]);

  // Optional: Sync to backend profile/me endpoint
  // Disabled for now, enable if guaranteed to be available in backend
  /*
  useEffect(() => {
    if (token) {
      apiProfile(token)
        .then(u => setUser(u))
        .catch(() => setUser(parseJwt(token)));
    }
  }, [token]);
  */

  // PUBLIC_INTERFACE
  async function login(username, password) {
    setLoading(true);
    setError(null);
    try {
      const tk = await apiLogin(username, password);
      setToken(tk);
      setError(null);
      return true;
    } catch (e) {
      setError(e.message || "Login failed.");
      throw e;
    } finally {
      setLoading(false);
    }
  }

  // PUBLIC_INTERFACE
  async function register(username, password, email) {
    setLoading(true);
    setError(null);
    try {
      const tk = await apiRegister(username, password, email);
      setToken(tk);
      return true;
    } catch (e) {
      setError(e.message || "Registration failed.");
      throw e;
    } finally {
      setLoading(false);
    }
  }

  // PUBLIC_INTERFACE
  function logout() {
    setToken(null);
    setUser(null);
    // Optionally, call backend logout endpoint if using session cookies
    // fetch(`${API_URL}/api/auth/logout`, { credentials: "include", method: "POST" }).catch(()=>{});
  }

  // PUBLIC_INTERFACE
  function isAuthenticated() {
    return !!token;
  }

  // PUBLIC_INTERFACE
  function getAuthHeader() {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated,
    getAuthHeader,
    loading,
    error,
    setError, // allow form to clear UI errors
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
