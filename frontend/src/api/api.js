import axios from "axios";

export const AUTH_TOKEN_KEY = "trainerToken";

// Get base URL from environment (accepts either VITE_API_BASE_URL or VITE_BACKEND_URL)
let rawBaseURL = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  ""
).trim();

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 405) {
      error.message = "VITE_API_BASE_URL is missing or pointing to Vercel instead of your Render backend. Please set VITE_API_BASE_URL in Vercel and redeploy.";
    }
    return Promise.reject(error);
  }
);

export default api;
