// Single source of truth for the search filter values and their types. The
// union types are derived from these arrays, so adding a filter value only
// ever means editing this one file.

export const IMAGE_TYPES = ["all", "photo", "illustration", "vector"] as const;
export const ORIENTATIONS = ["all", "horizontal", "vertical"] as const;
export const COLORS = [
  "all",
  "grayscale",
  "transparent",
  "red",
  "orange",
  "yellow",
  "green",
  "turquoise",
  "blue",
  "lilac",
  "pink",
  "white",
  "gray",
  "black",
  "brown",
] as const;

export type ImageType = (typeof IMAGE_TYPES)[number];
export type Orientation = (typeof ORIENTATIONS)[number];
export type Color = (typeof COLORS)[number];
