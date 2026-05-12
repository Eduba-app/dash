// lib/api/axios.ts
import axios from "axios";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

function clearAllAuthCookies() {
  if (typeof document === "undefined") return;
  
  const cookies = ["access_token_readable", "user_info"];
  cookies.forEach(name => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type":  "application/json",
    "x-device-uuid": "admin-panel",
  },
});

// Attach token from cookie on every request
api.interceptors.request.use((config) => {
  const token = getCookie("access_token_readable");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Track if we're already redirecting to prevent loops
let isRedirecting = false;

// Handle 401 - Clear cookies and redirect ONCE
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      // Prevent multiple simultaneous redirects
      if (isRedirecting) {
        return Promise.reject(error);
      }

      isRedirecting = true;

      // Clear all auth-related cookies
      clearAllAuthCookies();

      const currentPath = window.location.pathname;
      
      // Only redirect if not already on login page
      if (currentPath !== "/login") {
        window.location.href = `/login?expired=true`;
      }

      // Reset flag after redirect starts
      setTimeout(() => {
        isRedirecting = false;
      }, 1000);
    }
    return Promise.reject(error);
  }
);

export default api;