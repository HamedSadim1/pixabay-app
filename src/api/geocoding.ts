import { API_CONFIG, REQUEST_TIMEOUT_MS } from "@/config/api";

interface NominatimAddress {
  house_number?: string;
  road?: string;
  postcode?: string;
  city?: string;
  town?: string;
  village?: string;
  country?: string;
}

interface NominatimResponse {
  display_name?: string;
  address?: NominatimAddress;
}

// Reverse-geocode coordinates into a human-readable address via Nominatim.
// Returns "" on failure so callers can show a fallback without throwing.
export async function fetchAddress(
  latitude: number,
  longitude: number,
): Promise<string> {
  try {
    const response = await fetch(
      `${API_CONFIG.NOMINATIM.BASE_URL}?lat=${latitude}&lon=${longitude}&format=jsonv2&addressdetails=1&accept-language=en`,
      { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) },
    );
    const geoData = (await response.json()) as NominatimResponse;
    const address = geoData.address;
    if (address) {
      const street = [address.house_number, address.road]
        .filter(Boolean)
        .join(" ");
      const locality = address.city || address.town || address.village || "";
      const parts = [street, address.postcode, locality, address.country]
        .filter(Boolean)
        .join(", ");
      return parts || geoData.display_name || "";
    }
    return geoData.display_name || "";
  } catch (geoError) {
    console.warn("Could not fetch location address:", geoError);
    return "";
  }
}
