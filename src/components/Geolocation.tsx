import { useEffect, useEffectEvent } from "react";
import { parseAsFloat, useQueryStates } from "nuqs";
import Button from "./Button";
import DataField from "./DataField";
import Frame from "./Frame";
import Icon from "./Icon";
import MetaLabel from "./MetaLabel";
import Spinner from "./Spinner";
import LocationMap from "./LocationMap";
import { useGeolocation } from "../hooks/useGeolocation";
import { useReverseGeocode } from "../hooks/useReverseGeocode";
import {
  formatAccuracy,
  formatCoordinate,
  isValidCoordinates,
} from "../utils/geo";

function Geolocation() {
  // Coordinates live in the URL so the location is shareable and is restored
  // when navigating back. Extras (accuracy/altitude/speed) stay local.
  const [{ lat, lon }, setCoordinates] = useQueryStates(
    { lat: parseAsFloat, lon: parseAsFloat },
    { history: "replace" },
  );

  const hasValidCoordinates = isValidCoordinates(lat, lon);

  const {
    details,
    loading,
    errorMessage,
    permissionDenied,
    permissionStatus,
    getLocation,
  } = useGeolocation();

  const { locationName, resolvingAddress } = useReverseGeocode(lat, lon);

  // Persist a successful browser lookup into the URL (the source of truth).
  const getBrowserLocation = async () => {
    const coords = await getLocation();
    if (coords) {
      void setCoordinates({ lat: coords.latitude, lon: coords.longitude });
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
