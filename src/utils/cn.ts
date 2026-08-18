import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Merges Tailwind classes safely: clsx handles conditional/undefined values,
// twMerge deduplicates conflicting utilities (e.g. "px-2 px-4" → "px-4").
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
