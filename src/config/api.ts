/**
 * API Configuration
 *
 * This module provides the base URL for API requests.
 * It automatically uses the correct URL based on the environment:
 *
 * - Development: /api/glbajaj (proxied by Vite to https://glbg.servergi.com:8072/ISIMGLB)
 * - Production: https://gportal.yashmalik.tech/api/glbajaj
 */

const DEFAULT_API_BASE = import.meta.env.DEV
  ? "/api/glbajaj"
  : "https://gportal.yashmalik.tech/api/glbajaj";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE;

/**
 * Helper function to build API URLs
 * @param endpoint - The API endpoint (e.g., '/Login', '/StudentAttendance')
 * @returns Full API URL
 *
 * @example
 * const loginUrl = getApiUrl('/Login');
 * // Development: /api/glbajaj/Login
 * // Production: https://gportal-proxy-server.my-malikyash.workers.dev/api/glbajaj/Login
 */
export function getApiUrl(endpoint: string): string {
  // Remove leading slash from endpoint if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;

  // Ensure base URL doesn't end with a slash
  const baseUrl = API_BASE_URL.endsWith("/") ? API_BASE_URL.slice(0, -1) : API_BASE_URL;

  return `${baseUrl}/${cleanEndpoint}`;
}
