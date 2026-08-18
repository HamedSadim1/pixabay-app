import React, { useState, useEffect, useEffectEvent } from "react";
import { parseAsFloat, useQueryStates } from "nuqs";
import { API_CONFIG, REQUEST_TIMEOUT_MS } from "../config/api";
import Button from "./Button";
import Frame from "./Frame";
import Icon from "./Icon";
import MetaLabel from "./MetaLabel";
import Spinner from "./Spinner";
import LocationMap from "./LocationMap";

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

// Browser-only extras that aren't persisted to the URL.
interface LocationDetails {
  accuracy: number | null;
  altitude: number | null;
  speed: number | null;
  lastUpdated: Date | null;
}

const GEO_TIMEOUT_MS = 15_000;
const GEO_MAX_AGE_MS = 300_000; // 5 minutes
const ACCURACY_KM_THRESHOLD_M = 100;
const COORD_BOUNDS = {
  LAT_MIN: -90,
  LAT_MAX: 90,
  LON_MIN: -180,
  LON_MAX: 180,
} as const;

async function fetchAddress(
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

interface DataFieldProps {
  label: string;
  children: React.ReactNode;
  valueClassName?: string;
  className?: string;
}

// Label + value block used for coordinates, address and location details.
function DataField({
  label,
  children,
  valueClassName = "text-sm text-paper",
  className = "",
}: DataFieldProps) {
  return (
    <div className={`border border-line bg-panel-2 p-4 ${className}`}>
      <div className="mb-2 font-mono text-[10px] uppercase tracking-label text-muted">
        {label}
      </div>
      <p className={`font-mono ${valueClassName}`}>{children}</p>
    </div>
  );
}

function Geolocation() {
  // Coordinates live in the URL so the location is shareable and is restored
  // when navigating back. Extras (accuracy/altitude/speed) stay local.
  const [{ lat, lon }, setCoordinates] = useQueryStates(
    { lat: parseAsFloat, lon: parseAsFloat },
    { history: "replace" },
  );

  const hasValidCoordinates =
    lat !== null &&
    lon !== null &&
    lat >= COORD_BOUNDS.LAT_MIN &&
    lat <= COORD_BOUNDS.LAT_MAX &&
    lon >= COORD_BOUNDS.LON_MIN &&
    lon <= COORD_BOUNDS.LON_MAX;

  const [details, setDetails] = useState<LocationDetails>({
    accuracy: null,
    altitude: null,
    speed: null,
    lastUpdated: null,
  });
  const [locationName, setLocationName] = useState<string>("");
  const [resolvingAddress, setResolvingAddress] = useState<boolean>(
    () => hasValidCoordinates,
  );
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(
    () => lat === null || lon === null,
  );
  const [permissionStatus, setPermissionStatus] =
    useState<PermissionState | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const getBrowserLocation = async () => {
    if (!navigator.geolocation) {
      setErrorMessage("Geolocation is not supported by this browser");
      setLoading(false);
      return;
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

      void setCoordinates({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      });
      setDetails({
        accuracy: position.coords.accuracy,
        altitude: position.coords.altitude ?? null,
        speed: position.coords.speed ?? null,
        lastUpdated: new Date(),
      });
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
    } finally {
      setLoading(false);
    }
  };

  // On mount, request the browser location only if the URL has no coordinates.
  const requestInitialLocation = useEffectEvent(() => {
    if (lat === null || lon === null) {
      void getBrowserLocation();
    }
  });

  useEffect(() => {
    requestInitialLocation();
  }, []);

  // Reverse geocode whenever the coordinates change (geolocation or restore).
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

  // Check permission status (and clean up the listener on unmount).
  useEffect(() => {
    if (!("permissions" in navigator)) {
      return;
    }
    let cancelled = false;
    let permissionStatus: PermissionStatus | null = null;
    const onChange = () => {
      if (permissionStatus) {
        setPermissionStatus(permissionStatus.state);
      }
    };
    void navigator.permissions.query({ name: "geolocation" }).then((result) => {
      if (cancelled) {
        return;
      }
      permissionStatus = result;
      setPermissionStatus(result.state);
      result.addEventListener("change", onChange);
    });
    return () => {
      cancelled = true;
      permissionStatus?.removeEventListener("change", onChange);
    };
  }, []);

  const formatCoordinate = (coord: number, type: "lat" | "lng") => {
    const direction =
      type === "lat" ? (coord >= 0 ? "N" : "S") : coord >= 0 ? "E" : "W";
    return `${Math.abs(coord).toFixed(6)}° ${direction}`;
  };

  const formatAccuracy = (accuracy: number) => {
    if (accuracy < ACCURACY_KM_THRESHOLD_M) {
      return `${Math.round(accuracy)}m`;
    }
    return `${(accuracy / 1000).toFixed(1)}km`;
  };

  if (lat !== null && lon !== null && !hasValidCoordinates) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="border border-safelight bg-safelight/10 p-6">
          <div className="mb-3 flex items-center gap-3">
            <span className="text-2xl text-safelight">
              <Icon name="warning" />
            </span>
            <h2 className="font-display text-lg uppercase tracking-[0.03em] text-paper">
              Invalid Location
            </h2>
          </div>
          <p className="font-mono text-xs text-paper">
            The coordinates in the URL are out of range. Latitude must be
            between −90 and 90, and longitude between −180 and 180.
          </p>
        </div>
      </div>
    );
  }

  if (lat === null || lon === null) {
    if (errorMessage) {
      return (
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="border border-safelight bg-safelight/10 p-6">
            <div className="mb-3 flex items-center gap-3">
              <span className="text-2xl text-safelight">
                <Icon name="warning" />
              </span>
              <h2 className="font-display text-lg uppercase tracking-[0.03em] text-paper">
                Location Error
              </h2>
            </div>
            <p className="mb-5 font-mono text-xs text-muted">{errorMessage}</p>
            {permissionDenied && (
              <div className="mb-5 border border-gold bg-gold/10 p-4 text-left">
                <h3 className="mb-2 font-display text-sm uppercase tracking-[0.03em] text-gold">
                  Re-enable location
                </h3>
                <p className="font-mono text-xs leading-relaxed text-paper">
                  Your browser is blocking location access and won't re-prompt.
                  Click the lock/location icon in the address bar and allow
                  "Location", or open your browser's site settings and enable it
                  for this site.
                </p>
              </div>
            )}
            <Button onClick={getBrowserLocation} variant="primary">
              <Icon name="rotateRight" /> Try Again
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="border border-line bg-panel p-10 text-center">
          <Spinner size="lg" className="mx-auto" />
          <h2 className="mt-5 font-display text-xl uppercase tracking-[0.03em] text-paper">
            Finding Your Location
          </h2>
          <p className="mt-2 font-mono text-xs uppercase tracking-meta text-muted">
            Please allow location access
          </p>
        </div>

        {permissionStatus && (
          <div
            role="status"
            className={`border p-4 font-mono text-xs uppercase tracking-[0.12em] ${
              permissionStatus === "granted"
                ? "border-gold text-gold"
                : permissionStatus === "denied"
                  ? "border-safelight text-safelight"
                  : "border-line text-muted"
            }`}
          >
            Location Permission: {permissionStatus}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Location Card */}
      <Frame frame="COORD/01">
        <div className="p-6">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-lg uppercase tracking-[0.03em] text-paper">
                Current Location
              </h2>
            </div>
            <Button
              size="sm"
              onClick={getBrowserLocation}
              disabled={loading}
              aria-label="Refresh location"
              title="Refresh Location"
            >
              <Icon name="rotateRight" />
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <DataField label="Latitude" valueClassName="text-xl text-safelight">
              {formatCoordinate(lat, "lat")}
            </DataField>
            <DataField
              label="Longitude"
              valueClassName="text-xl text-safelight"
            >
              {formatCoordinate(lon, "lng")}
            </DataField>
            <DataField
              label="Address"
              className="md:col-span-2"
              valueClassName={
                resolvingAddress || !locationName
                  ? "text-sm text-muted"
                  : "text-sm text-paper"
              }
            >
              {resolvingAddress
                ? "Resolving address…"
                : locationName || "Address unavailable"}
            </DataField>
          </div>

          {(details.accuracy !== null ||
            details.altitude !== null ||
            details.speed !== null) && (
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {details.accuracy !== null && (
                <DataField label="Accuracy">
                  ±{formatAccuracy(details.accuracy)}
                </DataField>
              )}
              {details.altitude !== null && (
                <DataField label="Altitude">
                  {Math.round(details.altitude)}m
                </DataField>
              )}
              {details.speed !== null && (
                <DataField label="Speed">
                  {(details.speed * 3.6).toFixed(1)} km/h
                </DataField>
              )}
            </div>
          )}

          {details.lastUpdated && (
            <MetaLabel as="div" className="mt-5 border-t border-line pt-4">
              Last updated: {details.lastUpdated.toLocaleString()}
            </MetaLabel>
          )}
        </div>
      </Frame>

      {/* Map Preview */}
      <Frame frame="COORD/02">
        <div className="p-6">
          <h2 className="mb-4 font-display text-lg uppercase tracking-[0.03em] text-paper">
            Location Preview
          </h2>
          <LocationMap latitude={lat} longitude={lon} />
          <MetaLabel as="p" className="mt-3">
            {formatCoordinate(lat, "lat")} · {formatCoordinate(lon, "lng")}
          </MetaLabel>
        </div>
      </Frame>
    </div>
  );
}

export default Geolocation;
