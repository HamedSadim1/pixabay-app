// Shared formatting helpers.

import type { Hit } from "../models/IPixabay";

// Extract up to two initials from a full name, e.g. "Jane Doe" → "JD".
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// Compact number formatting, e.g. 1.2K / 3.4M.
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

// Split a comma-separated tag string into a trimmed, non-empty array.
// e.g. "nature, city , " → ["nature", "city"]
export function parseTags(tags: string): string[] {
  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

// Extract the file extension from a URL, stripping query parameters.
// Falls back to "jpg" when the URL has no recognisable extension.
export function getFileExtension(url: string, fallback = "jpg"): string {
  const pathname = url.split("?")[0];
  return pathname.split(".").pop() || fallback;
}

// Human-readable byte size, e.g. 1.5 MB.
export function formatFileSize(bytes: number): string {
  if (bytes === 0) {
    return "0 Bytes";
  }
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// Returns the key-value pairs displayed in the image-detail information panel.
export function getImageInfoFields(
  image: Pick<Hit, "id" | "imageWidth" | "imageHeight" | "imageSize" | "type">,
): [label: string, value: string][] {
  return [
    ["Frame ID", `#${image.id}`],
    ["Dimensions", `${image.imageWidth} × ${image.imageHeight}`],
    ["File Size", formatFileSize(image.imageSize)],
    ["Type", image.type],
  ];
}
