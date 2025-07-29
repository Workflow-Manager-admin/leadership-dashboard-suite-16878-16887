import React, { createContext, useState, useContext, useEffect, useCallback } from "react";

/**
 * PUBLIC_INTERFACE
 * AuthContext provides user authentication state, login/logout/register actions,
 * and user/team/project context for SLT dashboard app.
 */
const AuthContext = createContext();

const TOKEN_KEY = "slt_jwt_token";
const USER_KEY = "slt_user_data";

/**
 * Safely get token from localStorage/session
 */
function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || null;
  } catch {
    return null;
  }
}

/**
 * Save/remove token securely
 */
function setToken(token, remember) {
  if (remember) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    sessionStorage.setItem(TOKEN_KEY, token);
  }
}
function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
}

/**
 * AuthProvider for app
 */
export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(getToken());
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(!!getToken());
  const [error, setError] = useState(null);

  // Helper to attach JWT token to outgoing API requests
  const authFetch = useCallback(
    async (url, opts={}) => {
      const headers = opts.headers || {};
      const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
      return fetch(url, {
        ...opts,
        credentials: "same-origin",
        headers: { ...headers, ...authHeader },
      });
    },
    [token]
  );

  // Initial user/project/team fetch
  useEffect(() => {
    if (!token) {
      setUser(null);
      setProjects([]);
      setTeams([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    // Get current user
    authFetch(process.env.REACT_APP_API_URL + "/api/user/me")
      .then(async r => {
        if (!r.ok) throw new Error("Invalid token or user not found");
        return r.json();
      })
      .then(user => {
        setUser(user);
        // Parallel fetch teams/projects
        return Promise.all([
          authFetch(process.env.REACT_APP_API_URL + "/api/user/teams"),
          authFetch(process.env.REACT_APP_API_URL + "/api/user/projects"),
        ]);
      })
      .then(async ([teamsRes, projectsRes]) => {
        setTeams((await teamsRes.json()) || []);
        setProjects((await projectsRes.json()) || []);
      })
      .catch(e => {
        setError(e?.message || "Failed to load account data");
        setUser(null);
        setTeams([]);
        setProjects([]);
        clearToken();
        setTokenState(null);
      })
      .finally(() => setLoading(false));
  }, [token, authFetch]);

  // PUBLIC_INTERFACE
  /** Register flow */
  const register = async ({ email, full_name, password }) => {
    setLoading(true);
    setError(null);
    const resp = await fetch(
      (process.env.REACT_APP_API_URL + "/api/auth/register"),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, full_name, password }),
      }
    );
    if (!resp.ok) {
      setError("Registration failed: " + resp.status);
      setLoading(false);
      throw new Error("Registration error");
    }
    setLoading(false);
    return resp.json(); // User object
  };

  // PUBLIC_INTERFACE
  /** Login flow */
  const login = async ({ email, password, remember }) => {
    setLoading(true);
    setError(null);
    // FastAPI OAuth2 expects form-urlencoded, username field is email
    const form = new URLSearchParams();
    form.append("username", email);
    form.append("password", password);
    const resp = await fetch(process.env.REACT_APP_API_URL + "/api/auth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form,
    });
    if (!resp.ok) {
      setError("Login failed: Invalid credentials");
      setLoading(false);
      throw new Error("Login error");
    }
    const data = await resp.json();
    setToken(data.access_token, remember);
    setTokenState(data.access_token);
    setLoading(false);
    return data;
  };

  // PUBLIC_INTERFACE
  /** Logout */
  const logout = () => {
    clearToken();
    setTokenState(null);
    setUser(null);
    setProjects([]);
    setTeams([]);
  };

  const value = {
    user,
    projects,
    teams,
    token,
    loading,
    error,
    login,
    register,
    logout,
    setError,
    refreshAuth: () => setTokenState(getToken()),
    authFetch, // authenticated fetch for backend calls
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * PUBLIC_INTERFACE
 * useAuth hook for accessing auth context
 */
export function useAuth() {
  return useContext(AuthContext);
}
