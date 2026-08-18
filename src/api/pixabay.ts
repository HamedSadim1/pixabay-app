import axios from "axios";
import { API_ENDPOINTS, REQUEST_TIMEOUT_MS } from "../config/api";
import type { Images, Hit } from "../models/IPixabay";
import type { Color, ImageType, Orientation } from "../constants/filters";

// Number of results fetched per page. Kept here (single source of truth) so the
// search UI and the pagination logic agree on the page size.
export const PER_PAGE = 20;

// The effective parameters sent to the Pixabay API. Optional fields are
// omitted from the request (and from the React Query key) when they are
// no-ops — e.g. `type` only appears when it is not "all".
export interface SearchQuery {
  q: string;
  type?: ImageType;
  orientation?: Orientation;
  color?: Color;
  minWidth?: number;
  minHeight?: number;
  page: number;
}

// Thrown when the API responds but the requested resource does not exist, so
// the UI can render a distinct "not found" state instead of a generic error.
export class NotFoundError extends Error {
  constructor(message = "Image not found") {
    super(message);
    this.name = "NotFoundError";
  }
}

export async function searchImages(params: SearchQuery): Promise<Images> {
  const { q, type, orientation, color, minWidth, minHeight, page } = params;

  let queryString = `${API_ENDPOINTS.PIXABAY_SEARCH}&q=${encodeURIComponent(q)}&page=${page}&per_page=${PER_PAGE}`;

  if (type) {
    queryString += `&image_type=${type}`;
  }
  if (orientation) {
    queryString += `&orientation=${orientation}`;
  }
  if (color) {
    queryString += `&colors=${color}`;
  }
  if (minWidth !== undefined) {
    queryString += `&min_width=${minWidth}`;
  }
  if (minHeight !== undefined) {
    queryString += `&min_height=${minHeight}`;
  }

  const response = await axios.get<Images>(queryString, {
    timeout: REQUEST_TIMEOUT_MS,
  });

  if (!response.data || !Array.isArray(response.data.hits)) {
    throw new Error("Invalid API response format");
  }
  return response.data;
}

export async function getImageById(id: string): Promise<Hit> {
  const response = await axios.get<Images>(
    `${API_ENDPOINTS.PIXABAY_SEARCH}&id=${id}`,
    { timeout: REQUEST_TIMEOUT_MS },
  );

  const hit = response.data?.hits?.[0];
  if (!hit) {
    throw new NotFoundError();
  }
  return hit;
}
