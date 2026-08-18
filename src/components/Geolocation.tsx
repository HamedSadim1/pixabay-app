import React, { useState, useEffect } from "react";
import Button from "./Button";
import Frame from "./Frame";
import Icon from "./Icon";
import LocationMap from "./LocationMap";

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  altitude?: number;
  altitudeAccuracy?: number;
  heading?: number;
  speed?: number;
}

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

function Geolocation() {
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [permissionStatus, setPermissionStatus] =
    useState<PermissionState | null>(null);
  const [locationName, setLocationName] = useState<string>("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const getLocation = async () => {
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

      const data: LocationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp,
        altitude: position.coords.altitude || undefined,
        altitudeAccuracy: position.coords.altitudeAccuracy || undefined,
        heading: position.coords.heading || undefined,
        speed: position.coords.speed || undefined,
      };

      setLocationData(data);
      setLastUpdated(new Date());

      // Reverse geocode to a human-readable street address via OpenStreetMap
      // Nominatim (free, no API key).
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${data.latitude}&lon=${data.longitude}&format=jsonv2&addressdetails=1&accept-language=en`,
        );
        const geoData = (await response.json()) as NominatimResponse;
        const address = geoData.address;
        if (address) {
          const street = [address.house_number, address.road]
            .filter(Boolean)
            .join(" ");
          const locality =
            address.city || address.town || address.village || "";
          const parts = [street, address.postcode, locality, address.country]
            .filter(Boolean)
            .join(", ");
          setLocationName(parts || geoData.display_name || "");
        } else if (geoData.display_name) {
          setLocationName(geoData.display_name);
        }
      } catch (geoError) {
        console.warn("Could not fetch location address:", geoError);
      }
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

  useEffect(() => {
    getLocation();

    // Check permission status
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

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="border border-line bg-panel p-10 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-line border-t-safelight" />
          <h2 className="mt-5 font-display text-xl uppercase tracking-[0.03em] text-paper">
            Finding Your Location
          </h2>
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.15em] text-muted">
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
    <div className="mx-auto max-w-4xl space-y-6">
      {errorMessage ? (
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
          <Button onClick={getLocation} variant="primary">
            <Icon name="rotateRight" /> Try Again
          </Button>
        </div>
      ) : locationData ? (
        <div className="space-y-6">
          {/* Main Location Card */}
          <Frame frame="COORD/01">
            <div className="p-6">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-xl uppercase tracking-[0.03em] text-paper">
                    Current Location
                  </h2>
                </div>
                <button
                  onClick={getLocation}
                  disabled={loading}
                  title="Refresh Location"
                  className="border border-line px-3 py-2 text-muted transition-colors hover:border-safelight hover:text-safelight disabled:opacity-50"
                >
                  <Icon name="rotateRight" />
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="border border-line bg-panel-2 p-4">
                  <h3 className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                    Latitude
                  </h3>
                  <p className="font-mono text-xl text-safelight">
                    {formatCoordinate(locationData.latitude, "lat")}
                  </p>
                </div>
                <div className="border border-line bg-panel-2 p-4">
                  <h3 className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                    Longitude
                  </h3>
                  <p className="font-mono text-xl text-safelight">
                    {formatCoordinate(locationData.longitude, "lng")}
                  </p>
                </div>
                {locationName && (
                  <div className="border border-line bg-panel-2 p-4 md:col-span-2">
                    <h3 className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                      Address
                    </h3>
                    <p className="font-mono text-sm text-paper">
                      {locationName}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div className="border border-line bg-panel-2 p-4">
                  <h4 className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                    Accuracy
                  </h4>
                  <p className="font-mono text-sm text-paper">
                    ±{formatAccuracy(locationData.accuracy)}
                  </p>
                </div>
                {locationData.altitude && (
                  <div className="border border-line bg-panel-2 p-4">
                    <h4 className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                      Altitude
                    </h4>
                    <p className="font-mono text-sm text-paper">
                      {Math.round(locationData.altitude)}m
                    </p>
                  </div>
                )}
                {locationData.speed !== null &&
                  locationData.speed !== undefined && (
                    <div className="border border-line bg-panel-2 p-4">
                      <h4 className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                        Speed
                      </h4>
                      <p className="font-mono text-sm text-paper">
                        {(locationData.speed * 3.6).toFixed(1)} km/h
                      </p>
                    </div>
                  )}
              </div>

              {lastUpdated && (
                <div className="mt-5 border-t border-line pt-4 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
                  Last updated: {lastUpdated.toLocaleString()}
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
              <LocationMap
                latitude={locationData.latitude}
                longitude={locationData.longitude}
              />
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
                {formatCoordinate(locationData.latitude, "lat")} ·{" "}
                {formatCoordinate(locationData.longitude, "lng")}
              </p>
            </div>
          </Frame>
        </div>
      ) : null}
    </div>
  );
}

export default Geolocation;
