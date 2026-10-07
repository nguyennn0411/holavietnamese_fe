const configured = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/+$/, "");
export const API_BASE_URL = configured.endsWith("/api") ? configured : configured + "/api";
