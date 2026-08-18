// Shared geolocation helpers: coordinate bounds, validation and formatting.

export const COORD_BOUNDS = {
  LAT_MIN: -90,
  LAT_MAX: 90,
  LON_MIN: -180,
  LON_MAX: 180,
} as const;

export const ACCURACY_KM_THRESHOLD_M = 100;

export function isValidCoordinates(
  lat: number | null,
  lon: number | null,
): boolean {
  return (
    lat !== null &&
    lon !== null &&
    lat >= COORD_BOUNDS.LAT_MIN &&
    lat <= COORD_BOUNDS.LAT_MAX &&
    lon >= COORD_BOUNDS.LON_MIN &&
    lon <= COORD_BOUNDS.LON_MAX
  );
}

export function formatCoordinate(coord: number, type: "lat" | "lng"): string {
  const direction =
    type === "lat" ? (coord >= 0 ? "N" : "S") : coord >= 0 ? "E" : "W";
  return `${Math.abs(coord).toFixed(6)}° ${direction}`;
}

export function formatAccuracy(accuracy: number): string {
  if (accuracy < ACCURACY_KM_THRESHOLD_M) {
    return `${Math.round(accuracy)}m`;
  }
  return `${(accuracy / 1000).toFixed(1)}km`;
}
