import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle token expiration (401) or unauthorized access (403)
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      const errorMessage = error?.response?.data?.message || "";
      
      // Check if it's a token expiration or invalid token error
      const isTokenError = 
        error?.response?.status === 401 ||
        errorMessage.toLowerCase().includes("token expired") ||
        errorMessage.toLowerCase().includes("invalid token") ||
        errorMessage.toLowerCase().includes("unauthorized") ||
        errorMessage.toLowerCase().includes("token");
      
      if (isTokenError) {
        // Clear admin token and any other admin-related data
        localStorage.removeItem("adminToken");
        
        // Clear any other admin-related storage if needed
        // localStorage.removeItem("adminUser");
        
        // Prevent redirect loop - only redirect if not already on login page
        const currentPath = window.location.pathname;
        if (currentPath !== "/login" && !currentPath.includes("/login")) {
          // Use window.location to ensure a full page reload and clear any state
          // This ensures all React state is cleared on logout
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

