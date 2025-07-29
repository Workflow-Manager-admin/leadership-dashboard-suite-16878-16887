/**
 * SLT Dashboard Frontend — Centralized Backend API Layer
 * 
 * This module provides a typed, documented integration layer for all REST endpoints
 * exposed by the SLT FastAPI backend: ingestion, folder, parsing, KPI, dashboard/config,
 * export, templates, scheduling, and manual tagging/classification.
 * 
 * Uses fetch and FormData for all interface methods. Update BASE_URL as needed.
 */

// Change BASE_URL if deployed elsewhere:
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

function buildUrl(path) {
  if (path.startsWith("/")) return `${BASE_URL}${path}`;
  return `${BASE_URL}/${path}`;
}

// Helper to inject JWT for certain APIs
function authHeaders() {
  let t = "";
  try {
    t = localStorage.getItem("slt_jwt_token") || sessionStorage.getItem("slt_jwt_token") || "";
  } catch {}
  return t ? { Authorization: `Bearer ${t}` } : {};
}

// Helper for GET requests
async function get(url, opts = {}) {
  // Automatic Bearer injection for '/api/user/*', could be improved for all private endpoints
  let headers = { ...(opts.headers || {}) };
  if (url.startsWith("/api/user/")) {
    headers = { ...headers, ...authHeaders() };
  }
  const resp = await fetch(buildUrl(url), {
    method: "GET",
    credentials: "same-origin",
    headers,
    ...opts,
  });
  if (!resp.ok) throw new Error("GET " + url + " failed: " + resp.status);
  return resp.json();
}

// Helper for POST/PUT requests
async function post(url, data, opts = {}) {
  let headers = opts.headers || {};
  let body;
  if (data instanceof FormData) {
    body = data; // Do not set Content-Type for FormData
  } else {
    headers = { 'Content-Type': 'application/json', ...headers };
    body = JSON.stringify(data);
  }
  // Auth injection for project/team create can be added here as needed
  const resp = await fetch(buildUrl(url), {
    method: "POST",
    body,
    credentials: "same-origin",
    headers,
    ...opts,
  });
  if (!resp.ok) throw new Error("POST " + url + " failed: " + resp.status);
  return resp.json();
}

// ----------- Ingestion Endpoints -----------

/**
 * PUBLIC_INTERFACE
 * Upload (ingest) an Excel, PPT, PDF, or Word file.
 * @param {File} file - Actual File (from <input type="file" />)
 * @returns {Promise<Object>} - { filename, status }
 */
export async function ingestFile(file) {
  const form = new FormData();
  form.append("file", file);
  return post("/api/ingestion/upload", form);
}

/**
 * PUBLIC_INTERFACE
 * List all currently mapped ingestion folders.
 * @returns {Promise<Array>} - Array of { path, alias }
 */
export async function getMappedFolders() {
  return get("/api/ingestion/folders");
}

/**
 * PUBLIC_INTERFACE
 * Map/add a folder for ingestion monitoring.
 * @param {{ path: string, alias: string }} folder
 * @returns {Promise<Object>} - The new mapping ({ path, alias })
 */
export async function mapIngestionFolder(folder) {
  return post("/api/ingestion/folders", folder);
}

// ----------- Parsing & Classification -----------

/**
 * PUBLIC_INTERFACE
 * Trigger parsing for a previously uploaded file.
 * @param {string} filename - Name of file to parse
 * @returns {Promise<Object>} - ParsedResult { filename, parsed_content }
 */
export async function parseFile(filename) {
  // filename as query string
  return post(`/api/parsing/parse?filename=${encodeURIComponent(filename)}`);
}

/**
 * PUBLIC_INTERFACE
 * Manually tag or classify parsed data file.
 * @param {{ filename: string, tags: string[] }} data
 * @returns {Promise<Object>} - ClassificationResult
 */
export async function classifyFile(data) {
  // { filename, tags }
  return post("/api/classification/tag", data);
}

// ----------- KPI Endpoints -----------

/**
 * PUBLIC_INTERFACE
 * Compute KPIs for a given parsed file.
 * @param {{ filename: string }} request
 * @returns {Promise<Object>} - KPIResult { kpis: {...} }
 */
export async function computeKPIs(request) {
  return post("/api/kpi/compute", request);
}

// ----------- Dashboard Config Endpoints -----------

/**
 * PUBLIC_INTERFACE
 * Save/update a dashboard configuration.
 * @param {{ dashboard_id: string, config: object }} config
 * @returns {Promise<Object>} - DashboardConfig
 */
export async function saveDashboardConfig(config) {
  return post("/api/dashboard/config", config);
}

/**
 * PUBLIC_INTERFACE
 * List dashboard configs (summaries).
 * @returns {Promise<Array>} - Array of DashboardSummary
 */
export async function listDashboardConfigs() {
  return get("/api/dashboard/configs");
}

/**
 * PUBLIC_INTERFACE
 * Load a dashboard config by ID.
 * @param {string} dashboard_id
 * @returns {Promise<Object>} - DashboardConfig
 */
export async function getDashboardConfig(dashboard_id) {
  return get(`/api/dashboard/config/${encodeURIComponent(dashboard_id)}`);
}

// ----------- Export Endpoints -----------

/**
 * PUBLIC_INTERFACE
 * Export current dashboard to PDF/PPT/HTML.
 * @param {{ dashboard_id: string, format: string }} data
 * @returns {Promise<Object>} - ExportResult { url }
 */
export async function exportDashboard(data) {
  return post("/api/export/dashboard", data);
}

// ----------- Template Endpoints -----------

/**
 * PUBLIC_INTERFACE
 * List all templates.
 * @returns {Promise<Array>} - Array of TemplateSummary
 */
export async function listTemplates() {
  return get("/api/templates/");
}

/**
 * PUBLIC_INTERFACE
 * Create a dashboard template.
 * @param {{ template_id: string, name: string, config: object }} template
 * @returns {Promise<Object>} - TemplateModel
 */
export async function createTemplate(template) {
  return post("/api/templates/", template);
}

// ----------- Scheduling Endpoints -----------

/**
 * PUBLIC_INTERFACE
 * List all scheduled reports.
 * @returns {Promise<Array>} - Array of ScheduleRequest
 */
export async function listSchedules() {
  return get("/api/scheduling/");
}

/**
 * PUBLIC_INTERFACE
 * Schedule a dashboard report for delivery.
 * @param {{ dashboard_id: string, cron: string, email: string }} schedule
 * @returns {Promise<Object>} - Confirmation object (stub)
 */
export async function scheduleReport(schedule) {
  return post("/api/scheduling/", schedule);
}

// Additional helpers or health check as needed
/**
 * PUBLIC_INTERFACE
 * Backend health check endpoint.
 * @returns {Promise<Object>}
 */
export async function apiHealthCheck() {
  return get("/");
}
