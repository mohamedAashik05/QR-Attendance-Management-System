import axios from "axios";

export const AUTH_TOKEN_KEY = "trainerToken";

// Get base URL from environment or default to /api for local dev proxy
let rawBaseURL = (import.meta.env.VITE_API_BASE_URL || "").trim();

// Strip any trailing slashes
rawBaseURL = rawBaseURL.replace(/\/+$/, "");

// Ensure baseURL includes /api
let baseURL = "/api";
if (rawBaseURL) {
  baseURL = rawBaseURL.endsWith("/api") ? rawBaseURL : `${rawBaseURL}/api`;
}

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  // 60-second timeout to handle Render free-tier cold starts
  timeout: 60000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
