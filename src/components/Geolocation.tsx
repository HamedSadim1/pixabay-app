import React, { useState, useEffect, useEffectEvent } from "react";
import { parseAsFloat, useQueryStates } from "nuqs";
import Button from "./Button";
import Frame from "./Frame";
import Icon from "./Icon";
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

async function fetchAddress(
  latitude: number,
  longitude: number,
): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=jsonv2&addressdetails=1&accept-language=en`,
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

function Geolocation() {
  // Coordinates live in the URL so the location is shareable and is restored
  // when navigating back. Extras (accuracy/altitude/speed) stay local.
  const [{ lat, lon }, setCoordinates] = useQueryStates(
    { lat: parseAsFloat, lon: parseAsFloat },
    { history: "replace" },
  );

  const [details, setDetails] = useState<LocationDetails>({
    accuracy: null,
    altitude: null,
    speed: null,
    lastUpdated: null,
  });
  const [locationName, setLocationName] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(
    () => lat === null || lon === null,
  );
  const [permissionStatus, setPermissionStatus] =
    useState<PermissionState | null>(null);

  const getBrowserLocation = async () => {
    if (!navigator.geolocation) {
      setErrorMessage("Geolocation is not supported by this browser");
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 300000, // 5 minutes
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
      return;
    }
    let cancelled = false;
    void fetchAddress(lat, lon).then((address) => {
      if (!cancelled) {
        setLocationName(address);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [lat, lon]);

  // Check permission status.
  useEffect(() => {
    if ("permissions" in navigator) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        setPermissionStatus(result.state);
        result.addEventListener("change", () => {
          setPermissionStatus(result.state);
        });
      });
    }
  }, []);

  const formatCoordinate = (coord: number, type: "lat" | "lng") => {
    const direction =
      type === "lat" ? (coord >= 0 ? "N" : "S") : coord >= 0 ? "E" : "W";
    return `${Math.abs(coord).toFixed(6)}° ${direction}`;
  };

  const formatAccuracy = (accuracy: number) => {
    if (accuracy < 100) {
      return `${Math.round(accuracy)}m`;
    }
    return `${(accuracy / 1000).toFixed(1)}km`;
  };

  if (lat === null || lon === null) {
    if (errorMessage) {
      return (
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="border border-safelight bg-safelight/10 p-6">
            <div className="mb-3 flex items-center gap-3">
              <span className="text-2xl text-safelight">
                <Icon name="warning" />
              </span>
              <h3 className="font-display text-xl uppercase tracking-[0.03em] text-paper">
                Location Error
              </h3>
            </div>
            <p className="mb-5 font-mono text-xs text-muted">{errorMessage}</p>
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
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-line border-t-safelight" />
          <h2 className="mt-5 font-display text-xl uppercase tracking-[0.03em] text-paper">
            Finding Your Location
          </h2>
          <p className="mt-2 font-mono text-xs uppercase tracking-meta text-muted">
            Please allow location access
          </p>
        </div>

        {permissionStatus && (
          <div
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
            <div className="border border-line bg-panel-2 p-4">
              <h3 className="mb-2 font-mono text-[10px] uppercase tracking-label text-muted">
                Latitude
              </h3>
              <p className="font-mono text-xl text-safelight">
                {formatCoordinate(lat, "lat")}
              </p>
            </div>
            <div className="border border-line bg-panel-2 p-4">
              <h3 className="mb-2 font-mono text-[10px] uppercase tracking-label text-muted">
                Longitude
              </h3>
              <p className="font-mono text-xl text-safelight">
                {formatCoordinate(lon, "lng")}
              </p>
            </div>
            {locationName && (
              <div className="border border-line bg-panel-2 p-4 md:col-span-2">
                <h3 className="mb-2 font-mono text-[10px] uppercase tracking-label text-muted">
                  Address
                </h3>
                <p className="font-mono text-sm text-paper">{locationName}</p>
              </div>
            )}
          </div>

          {(details.accuracy !== null ||
            details.altitude !== null ||
            details.speed !== null) && (
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {details.accuracy !== null && (
                <div className="border border-line bg-panel-2 p-4">
                  <h4 className="mb-1 font-mono text-[10px] uppercase tracking-label text-muted">
                    Accuracy
                  </h4>
                  <p className="font-mono text-sm text-paper">
                    ±{formatAccuracy(details.accuracy)}
                  </p>
                </div>
              )}
              {details.altitude !== null && (
                <div className="border border-line bg-panel-2 p-4">
                  <h4 className="mb-1 font-mono text-[10px] uppercase tracking-label text-muted">
                    Altitude
                  </h4>
                  <p className="font-mono text-sm text-paper">
                    {Math.round(details.altitude)}m
                  </p>
                </div>
              )}
              {details.speed !== null && (
                <div className="border border-line bg-panel-2 p-4">
                  <h4 className="mb-1 font-mono text-[10px] uppercase tracking-label text-muted">
                    Speed
                  </h4>
                  <p className="font-mono text-sm text-paper">
                    {(details.speed * 3.6).toFixed(1)} km/h
                  </p>
                </div>
              )}
            </div>
          )}

          {details.lastUpdated && (
            <div className="mt-5 border-t border-line pt-4 font-mono text-[10px] uppercase tracking-meta text-muted">
              Last updated: {details.lastUpdated.toLocaleString()}
            </div>
          )}
        </div>
      </Frame>

      {/* Map Preview */}
      <Frame frame="COORD/02">
        <div className="p-6">
          <h3 className="mb-4 font-display text-lg uppercase tracking-[0.03em] text-paper">
            Location Preview
          </h3>
          <LocationMap latitude={lat} longitude={lon} />
          <p className="mt-3 font-mono text-[10px] uppercase tracking-meta text-muted">
            {formatCoordinate(lat, "lat")} · {formatCoordinate(lon, "lng")}
          </p>
        </div>
      </Frame>
    </div>
  );
}

export default Geolocation;
