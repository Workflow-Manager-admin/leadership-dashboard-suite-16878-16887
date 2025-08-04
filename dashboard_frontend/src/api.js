//
// PUBLIC_INTERFACE
// Utilities for calling the dashboard_backend API

/**
 * API_BASE: Reads the backend URL from environment variable,
 * or defaults to "http://localhost:3001"
 *
 * To configure: set REACT_APP_API_URL in a .env file in the frontend root,
 * or use a proxy in package.json:
 *   "proxy": "http://localhost:3001"
 *
 * For most setups, prefer:
 *   - .env: REACT_APP_API_URL=http://localhost:3001
 *   - Or in package.json: "proxy": "http://localhost:3001"
 */
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3001";

// PUBLIC_INTERFACE
/**
 * GET request utility.
 * Gracefully handles CORS/network/backend errors with clear messages.
 * Throws user-friendly Error for common API/network issues.
 */
export async function apiGet(path, params = {}) {
    let q = Object.entries(params)
        .filter(([_k, v]) => v !== undefined && v !== null && v !== '')
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join('&');
    let url = API_BASE + path + (q ? (`?${q}`) : "");
    try {
        const resp = await fetch(url);
        if (!resp.ok) {
            // Try to parse error returned by API
            let msg = `Request failed: ${url} [${resp.status}]`;
            try {
                const data = await resp.json();
                if (data && data.detail)
                    msg += `: ${typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail)}`;
            } catch {}
            throw new Error(msg);
        }
        return await resp.json();
    } catch (err) {
        if (err instanceof TypeError && err.message && err.message.match(/Failed to fetch/i)) {
            // User-facing CORS/connection error message
            throw new Error("Could not connect to backend server. This is likely a network, CORS, or API URL/proxy misconfiguration error. (" + (err && err.message) + ")");
        } else if (err instanceof Error) {
            throw err;
        } else {
            throw new Error("Unknown error occurred during API call.");
        }
    }
}

/**
 * PUBLIC_INTERFACE
 * Make POST request to backend API.
 * Now returns error JSON (if any) on failure for better error handling.
 */
export async function apiPost(path, body = {}, contentType = "application/json") {
    let url = API_BASE + path;
    let init = {
        method: "POST",
        headers: { "Content-Type": contentType },
        body: contentType === "application/json" ? JSON.stringify(body) : body
    };
    try {
        const resp = await fetch(url, init);
        let responseText = await resp.text();
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            data = responseText;
        }
        if (!resp.ok) {
            // Error details may be available in the response body
            let errorMsg = `Failed to POST ${url}, status=${resp.status}`;
            if (data && typeof data === 'object' && data.detail) {
                errorMsg += ": " + JSON.stringify(data.detail);
            } else if (typeof data === 'string' && data.length < 1000) {
                errorMsg += ": " + data;
            }
            throw new Error(errorMsg);
        }
        return data;
    } catch (err) {
        if (err instanceof TypeError && err.message && err.message.match(/Failed to fetch/i)) {
            throw new Error("Could not connect to backend server (POST). This may be a network, CORS, or API URL/proxy issue. (" + (err && err.message) + ")");
        } else if (err instanceof Error) {
            throw err;
        } else {
            throw new Error("Unknown error occurred during API POST.");
        }
    }
}

// PUBLIC_INTERFACE
export async function apiDelete(path) {
    let url = API_BASE + path;
    try {
        let resp = await fetch(url, { method: "DELETE" });
        if (!resp.ok) throw new Error(`Failed to DELETE ${url}, status=${resp.status}`);
        return resp.json();
    } catch (err) {
        if (err instanceof TypeError && err.message && err.message.match(/Failed to fetch/i)) {
            throw new Error("Could not connect to backend server (DELETE). Likely a network/CORS/API config issue.");
        } else if (err instanceof Error) {
            throw err;
        } else {
            throw new Error("Unknown error during DELETE API call.");
        }
    }
}

/**
 * PUBLIC_INTERFACE
 * Upload a file with user-friendly network/CORS error detection.
 */
export async function apiFileUpload(path, file) {
    let url = API_BASE + path;
    const data = new FormData();
    data.append("file", file);
    try {
        const resp = await fetch(url, {
            method: "POST",
            body: data,
        });
        if (!resp.ok) {
            let msg = `Failed to upload file: ${url} [${resp.status}]`;
            try {
                const data = await resp.json();
                if (data && data.detail)
                    msg += ": " + (typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail));
            } catch {}
            throw new Error(msg);
        }
        return await resp.json();
    } catch (err) {
        if (err instanceof TypeError && err.message && err.message.match(/Failed to fetch/i)) {
            throw new Error("Could not connect to backend server during file upload. Likely network, CORS, or API/proxy config error.");
        } else if (err instanceof Error) {
            throw err;
        } else {
            throw new Error("Unknown error occurred during file upload.");
        }
    }
}
