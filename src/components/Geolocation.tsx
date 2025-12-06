import React, { useState, useEffect } from "react";
import {
  FaMapMarkerAlt,
  FaSync,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";

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
        }
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

      // Try to get location name using reverse geocoding
      try {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${data.latitude}&longitude=${data.longitude}&localityLanguage=en`
        );
        const geoData = await response.json();
        if (geoData.city && geoData.countryName) {
          setLocationName(`${geoData.city}, ${geoData.countryName}`);
        } else if (geoData.locality) {
          setLocationName(geoData.locality);
        }
      } catch (geoError) {
        console.warn("Could not fetch location name:", geoError);
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
    if (accuracy < 100) return `${Math.round(accuracy)}m`;
    return `${(accuracy / 1000).toFixed(1)}km`;
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/20 border-t-white mx-auto mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FaMapMarkerAlt className="text-2xl text-white animate-pulse" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Finding Your Location
          </h2>
          <p className="text-gray-300">
            Please allow location access for the best experience
          </p>
        </div>

        {permissionStatus && (
          <div
            className={`p-4 rounded-lg border backdrop-blur-sm ${
              permissionStatus === "granted"
                ? "bg-green-500/20 border-green-400 text-green-200"
                : permissionStatus === "denied"
                ? "bg-red-500/20 border-red-400 text-red-200"
                : "bg-yellow-500/20 border-yellow-400 text-yellow-200"
            }`}
          >
            <div className="flex items-center space-x-2">
              {permissionStatus === "granted" ? (
                <FaCheckCircle />
              ) : permissionStatus === "denied" ? (
                <FaExclamationTriangle />
              ) : (
                <FaInfoCircle />
              )}
              <span className="font-medium">
                Location Permission:{" "}
                {permissionStatus.charAt(0).toUpperCase() +
                  permissionStatus.slice(1)}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <FaMapMarkerAlt className="text-3xl text-purple-400" />
          <h1 className="text-4xl font-bold text-white">Location Services</h1>
        </div>
        <p className="text-gray-300 text-lg">
          Discover your current location with precision
        </p>
      </div>

      {errorMessage ? (
        <div className="bg-red-500/20 backdrop-blur-lg border border-red-400 text-red-200 p-6 rounded-xl shadow-2xl">
          <div className="flex items-center space-x-3 mb-4">
            <FaExclamationTriangle className="text-2xl" />
            <h3 className="text-xl font-bold">Location Error</h3>
          </div>
          <p className="mb-4">{errorMessage}</p>
          <button
            onClick={getLocation}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <FaSync />
            <span>Try Again</span>
          </button>
        </div>
      ) : locationData ? (
        <div className="space-y-6">
          {/* Main Location Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-2xl border border-white/20">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Your Current Location
                </h2>
                {locationName && (
                  <p className="text-purple-300 text-lg font-medium">
                    {locationName}
                  </p>
                )}
              </div>
              <button
                onClick={getLocation}
                disabled={loading}
                className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50"
                title="Refresh Location"
              >
                <FaSync className={loading ? "animate-spin" : ""} />
              </button>
            </div>

            {/* Coordinates Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>Latitude</span>
                </h3>
                <p className="text-2xl font-mono text-green-300">
                  {formatCoordinate(locationData.latitude, "lat")}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Decimal: {locationData.latitude.toFixed(8)}
                </p>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <span>Longitude</span>
                </h3>
                <p className="text-2xl font-mono text-blue-300">
                  {formatCoordinate(locationData.longitude, "lng")}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Decimal: {locationData.longitude.toFixed(8)}
                </p>
              </div>
            </div>

            {/* Additional Info Grid */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
                <h4 className="text-sm font-medium text-gray-300 mb-1">
                  Accuracy
                </h4>
                <p className="text-lg font-semibold text-white">
                  ±{formatAccuracy(locationData.accuracy)}
                </p>
              </div>

              {locationData.altitude && (
                <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
                  <h4 className="text-sm font-medium text-gray-300 mb-1">
                    Altitude
                  </h4>
                  <p className="text-lg font-semibold text-white">
                    {Math.round(locationData.altitude)}m
                  </p>
                </div>
              )}

              {locationData.speed !== null &&
                locationData.speed !== undefined && (
                  <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
                    <h4 className="text-sm font-medium text-gray-300 mb-1">
                      Speed
                    </h4>
                    <p className="text-lg font-semibold text-white">
                      {(locationData.speed * 3.6).toFixed(1)} km/h
                    </p>
                  </div>
                )}
            </div>

            {lastUpdated && (
              <div className="mt-6 pt-4 border-t border-white/10">
                <p className="text-sm text-gray-400">
                  Last updated: {lastUpdated.toLocaleString()}
                </p>
              </div>
            )}
          </div>

          {/* Map Placeholder */}
          <div className="bg-slate-900/50 backdrop-blur-lg rounded-xl p-8 shadow-2xl border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
              <FaMapMarkerAlt />
              <span>Location Preview</span>
            </h3>
            <div className="bg-slate-800 rounded-lg h-64 flex items-center justify-center border-2 border-dashed border-slate-600">
              <div className="text-center">
                <FaMapMarkerAlt className="text-4xl text-gray-400 mx-auto mb-3" />
                <p className="text-gray-400">
                  Interactive map would be displayed here
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Coordinates: {locationData.latitude.toFixed(4)},{" "}
                  {locationData.longitude.toFixed(4)}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Geolocation;
