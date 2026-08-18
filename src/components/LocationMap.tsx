import { useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import L, { type LatLngTuple } from "leaflet";

interface LocationMapProps {
  latitude: number;
  longitude: number;
}

// Themed marker: safelight dot with a gold ring. Uses a divIcon because
// Leaflet's default marker images don't resolve cleanly under Vite.
const markerIcon = L.divIcon({
  className: "map-marker",
  html: '<span class="map-marker__dot"></span>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

const DARK_TILES_URL =
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

const DARK_TILES_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

// react-leaflet only applies `center` on mount, so re-center when the
// coordinates change (e.g. after a "refresh").
function RecenterMap({ latitude, longitude }: LocationMapProps) {
  const map = useMap();

  useEffect(() => {
    map.setView([latitude, longitude], map.getZoom());
  }, [latitude, longitude, map]);

  return null;
}

const LocationMap: React.FC<LocationMapProps> = ({ latitude, longitude }) => {
  const position: LatLngTuple = [latitude, longitude];

  return (
    <MapContainer
      center={position}
      zoom={15}
      scrollWheelZoom={false}
      className="h-64 w-full"
    >
      <TileLayer url={DARK_TILES_URL} attribution={DARK_TILES_ATTRIBUTION} />
      <Marker position={position} icon={markerIcon} />
      <RecenterMap latitude={latitude} longitude={longitude} />
    </MapContainer>
  );
};

export default LocationMap;
