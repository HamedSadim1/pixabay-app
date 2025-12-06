import { getRequiredEnvVar } from "../utils/env";

export const API_CONFIG = {
  PIXABAY: {
    BASE_URL: getRequiredEnvVar("VITE_PIXABAY_BASE_URL"),
    API_KEY: getRequiredEnvVar("VITE_PIXABAY_API_KEY"),
  },
} as const;

export const API_ENDPOINTS = {
  PIXABAY_SEARCH: `${API_CONFIG.PIXABAY.BASE_URL}?key=${API_CONFIG.PIXABAY.API_KEY}`,
} as const;
