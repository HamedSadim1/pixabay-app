import { useEffect, useState } from "react";
import { fetchAddress } from "../api/geocoding";
import { isValidCoordinates } from "../utils/geo";

// Resolves the human-readable address for the given coordinates. Returns
// `resolvingAddress` while in-flight and `locationName` once done (or "" on
// failure, which callers can present as "Address unavailable").
export function useReverseGeocode(lat: number | null, lon: number | null) {
  const [locationName, setLocationName] = useState("");
  const [resolvingAddress, setResolvingAddress] = useState(() =>
    isValidCoordinates(lat, lon),
  );

  useEffect(() => {
    if (lat === null || lon === null) {
      setResolvingAddress(false);
      return;
    }
    let cancelled = false;
    setResolvingAddress(true);
    setLocationName("");
    void fetchAddress(lat, lon).then((address) => {
      if (!cancelled) {
        setResolvingAddress(false);
        setLocationName(address);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [lat, lon]);

  return { locationName, resolvingAddress };
}
