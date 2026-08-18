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

  // Derive synchronous state transitions during render instead of inside an
  // effect, so we avoid cascading renders (React docs pattern for "storing
  // information from previous renders").
  const [prevLat, setPrevLat] = useState(lat);
  const [prevLon, setPrevLon] = useState(lon);
  if (prevLat !== lat || prevLon !== lon) {
    setPrevLat(lat);
    setPrevLon(lon);
    if (lat === null || lon === null) {
      setResolvingAddress(false);
    } else {
      setResolvingAddress(true);
      setLocationName("");
    }
  }

  // The effect only handles the async fetch — all synchronous state transitions
  // are derived during render above.
  useEffect(() => {
    if (lat === null || lon === null) {
      return;
    }
    let cancelled = false;
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
