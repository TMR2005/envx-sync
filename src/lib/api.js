import fetch from "node-fetch";
import { getToken } from "./auth.js";

const API_BASE = "https://envx-backend-j8nj.onrender.com";

export async function api(path, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    console.error("API ERROR:", data);
    throw new Error(data.message || `HTTP ${res.status}`);
  }

  return data;
}