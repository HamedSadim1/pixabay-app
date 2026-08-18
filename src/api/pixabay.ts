import axios from "axios";
import { API_ENDPOINTS } from "../config/api";
import type { Images, Hit } from "../models/IPixabay";
import type { Color, ImageType, Orientation } from "../constants/types";

// Number of results fetched per page. Kept here (single source of truth) so the
// search UI and the pagination logic agree on the page size.
export const PER_PAGE = 20;

export interface SearchParams {
  q: string;
  type: ImageType;
  orientation: Orientation;
  color: Color;
  minWidth: string;
  minHeight: string;
  page: number;
}

interface ApiError {
  message: string;
}

// Thrown when the API responds but the requested resource does not exist, so
// the UI can render a distinct "not found" state instead of a generic error.
export class NotFoundError extends Error {
  constructor(message = "Image not found") {
    super(message);
    this.name = "NotFoundError";
  }
}

/**
 * Turns any thrown value into a user-facing error message. Maps axios timeout
 * and server errors to friendly text so callers don't render raw stack traces.
 */
export function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError<ApiError>(err)) {
    if (err.code === "ECONNABORTED") {
      return "The request timed out. Please try again.";
    }
    return (
      err.response?.data?.message ||
      err.message ||
      "An error occurred while fetching images"
    );
  }
  if (err instanceof Error) {
    return err.message;
  }
  return "An unexpected error occurred";
}

export async function searchImages(params: SearchParams): Promise<Images> {
  const { q, type, orientation, color, minWidth, minHeight, page } = params;

  let queryString = `${API_ENDPOINTS.PIXABAY_SEARCH}&q=${encodeURIComponent(q)}&page=${page}&per_page=${PER_PAGE}`;

  if (type !== "all") {
    queryString += `&image_type=${type}`;
  }
  if (orientation !== "all") {
    queryString += `&orientation=${orientation}`;
  }
  if (color !== "all") {
    queryString += `&colors=${color}`;
  }
  // Only send positive whole numbers, matching the Pixabay API contract.
  const width = Math.floor(Number(minWidth));
  if (Number.isFinite(width) && width > 0) {
    queryString += `&min_width=${width}`;
  }
  const height = Math.floor(Number(minHeight));
  if (Number.isFinite(height) && height > 0) {
    queryString += `&min_height=${height}`;
  }

  const response = await axios.get<Images>(queryString, { timeout: 10000 });

  if (!response.data || !Array.isArray(response.data.hits)) {
    throw new Error("Invalid API response format");
  }
  return response.data;
}

export async function getImageById(id: string): Promise<Hit> {
  const response = await axios.get<Images>(
    `${API_ENDPOINTS.PIXABAY_SEARCH}&id=${id}`,
    { timeout: 10000 },
  );

  const hit = response.data?.hits?.[0];
  if (!hit) {
    throw new NotFoundError();
  }
  return hit;
}
