import { useCallback, useEffect, useState } from "react";
import { GEO_TIMEOUT_MS, GEO_MAX_AGE_MS } from "@/config/api";

export interface LocationDetails {
  accuracy: number | null;
  altitude: number | null;
  speed: number | null;
  lastUpdated: Date | null;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

// Browser geolocation + permission handling. `getLocation` resolves to the
// coordinates on success (and sets `details`) or null on failure (with
// `errorMessage` set), so the caller can decide where to persist them.
export function useGeolocation() {
  const [details, setDetails] = useState<LocationDetails>({
    accuracy: null,
    altitude: null,
    speed: null,
    lastUpdated: null,
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [permissionStatus, setPermissionStatus] =
    useState<PermissionState | null>(null);

  // Track permission status (and clean up the listener on unmount).
  useEffect(() => {
    if (!("permissions" in navigator)) {
      return;
    }
    let cancelled = false;
    let status: PermissionStatus | null = null;
    const onChange = () => {
      if (status) {
        setPermissionStatus(status.state);
      }
    };
    void navigator.permissions.query({ name: "geolocation" }).then((result) => {
      if (cancelled) {
        return;
      }
      status = result;
      setPermissionStatus(result.state);
      result.addEventListener("change", onChange);
    });
    return () => {
      cancelled = true;
      status?.removeEventListener("change", onChange);
    };
  }, []);

  const getLocation = useCallback(async (): Promise<Coordinates | null> => {
    if (!navigator.geolocation) {
      setErrorMessage("Geolocation is not supported by this browser");
      setLoading(false);
      return null;
    }

    setLoading(true);
    setErrorMessage("");
    setPermissionDenied(false);

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: GEO_TIMEOUT_MS,
            maximumAge: GEO_MAX_AGE_MS,
          });
        },
      );

      setDetails({
        accuracy: position.coords.accuracy,
        altitude: position.coords.altitude ?? null,
        speed: position.coords.speed ?? null,
        lastUpdated: new Date(),
      });
      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
    } catch (err) {
      const error = err as GeolocationPositionError;
      let message = "Unable to get your location";

      switch (error.code) {
        case error.PERMISSION_DENIED:
          message =
            "Location access denied. Please enable location permissions.";
          setPermissionDenied(true);
          break;
        case error.POSITION_UNAVAILABLE:
          message = "Location information is unavailable.";
          break;
        case error.TIMEOUT:
          message = "Location request timed out. Please try again.";
          break;
      }

      setErrorMessage(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    details,
    loading,
    errorMessage,
    permissionDenied,
    permissionStatus,
    getLocation,
  };
}
