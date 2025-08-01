//
// PUBLIC_INTERFACE
// Utilities for calling the dashboard_backend API

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3001";

export async function apiGet(path, params = {}) {
    let q = Object.entries(params)
        .filter(([_k,v]) => v!==undefined && v!==null && v!=='')
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join('&');
    let url = API_BASE + path + (q ? (`?${q}`) : "");
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Failed to fetch ${url}, status=${resp.status}`);
    return resp.json();
}

// PUBLIC_INTERFACE
export async function apiPost(path, body = {}, contentType = "application/json") {
    let url = API_BASE + path;
    let init = {
        method: "POST",
        headers: { "Content-Type": contentType },
        body: contentType === "application/json" ? JSON.stringify(body) : body
    };
    const resp = await fetch(url, init);
    if (!resp.ok) throw new Error(`Failed to POST ${url}, status=${resp.status}`);
    return resp.json();
}

// PUBLIC_INTERFACE
export async function apiDelete(path) {
    let url = API_BASE + path;
    let resp = await fetch(url, {method: "DELETE"});
    if (!resp.ok) throw new Error(`Failed to DELETE ${url}, status=${resp.status}`);
    return resp.json();
}

export async function apiFileUpload(path, file) {
    let url = API_BASE + path;
    const data = new FormData();
    data.append("file", file);
    const resp = await fetch(url, {
        method: "POST",
        body: data,
    });
    if (!resp.ok) throw new Error(`Failed to upload file, status=${resp.status}`);
    return resp.json();
}
