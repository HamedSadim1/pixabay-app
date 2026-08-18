import { getRequiredEnvVar } from "../utils/env";

export const API_CONFIG = {
  PIXABAY: {
    BASE_URL: getRequiredEnvVar("VITE_PIXABAY_BASE_URL"),
    API_KEY: getRequiredEnvVar("VITE_PIXABAY_API_KEY"),
  },
  NOMINATIM: {
    BASE_URL: "https://nominatim.openstreetmap.org/reverse",
  },
} as const;

export const API_ENDPOINTS = {
  PIXABAY_SEARCH: `${API_CONFIG.PIXABAY.BASE_URL}?key=${API_CONFIG.PIXABAY.API_KEY}`,
} as const;

// Shared timeout (ms) for outbound API requests.
export const REQUEST_TIMEOUT_MS = 10_000;
