import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import L, { type LatLngTuple } from "leaflet";
import Icon from "@/components/ui/Icon";

interface LocationMapProps {
  latitude: number;
  longitude: number;
}

// Themed marker: safelight dot with a gold ring. Uses a divIcon because
// Leaflet's default marker images don't resolve cleanly under Vite.
const markerIcon = L.divIcon({
  className: "map-marker",
  html: '<span class="map-marker__pulse"></span><span class="map-marker__dot"></span>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const DARK_TILES_URL =
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

const DARK_TILES_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

const DEFAULT_ZOOM = 15;

// react-leaflet only applies `center` on mount, so re-center when the
// coordinates change (e.g. after a "refresh").
function RecenterMap({ latitude, longitude }: LocationMapProps) {
  const map = useMap();

  useEffect(() => {
    map.setView([latitude, longitude], map.getZoom());
  }, [latitude, longitude, map]);

  return null;
}

// The Leaflet container is always `height: 100%` of the wrapper, so the
// wrapper controls the size. When toggling fullscreen we only have to tell
// Leaflet to recalculate its size after the wrapper resizes.
function FullscreenController({ isFullscreen }: { isFullscreen: boolean }) {
  const map = useMap();

  useEffect(() => {
    if (isFullscreen) {
      map.scrollWheelZoom.enable();
    } else {
      map.scrollWheelZoom.disable();
    }
    // Wait a frame so the wrapper has reflowed to its new size before
    // Leaflet re-measures.
    const raf = requestAnimationFrame(() => {
      map.invalidateSize();
    });
    return () => cancelAnimationFrame(raf);
  }, [isFullscreen, map]);

  return null;
}

const LocationMap: React.FC<LocationMapProps> = ({ latitude, longitude }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tilesFailed, setTilesFailed] = useState(false);
  const position: LatLngTuple = [latitude, longitude];

  // Lock body scroll while fullscreen and close on Escape.
  useEffect(() => {
    if (!isFullscreen) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsFullscreen(false);
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isFullscreen]);

  return (
    <div
      role="region"
      aria-label="Location map"
      className={
        isFullscreen
          ? "fixed inset-0 z-2000 bg-dark"
          : "relative h-64 w-full sm:h-80 lg:h-96"
      }
    >
      <MapContainer
        center={position}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          url={DARK_TILES_URL}
          attribution={DARK_TILES_ATTRIBUTION}
          eventHandlers={{ tileerror: () => setTilesFailed(true) }}
        />
        <Marker position={position} icon={markerIcon} />
        <RecenterMap latitude={latitude} longitude={longitude} />
        <FullscreenController isFullscreen={isFullscreen} />
      </MapContainer>
      {tilesFailed && (
        <div className="pointer-events-none absolute inset-0 z-500 flex items-center justify-center bg-dark/60">
          <p className="border border-safelight bg-panel px-3 py-2 font-mono text-[10px] uppercase tracking-meta text-safelight">
            Map tiles unavailable
          </p>
        </div>
      )}
      <button
        type="button"
        onClick={() => setIsFullscreen((prev) => !prev)}
        className="absolute right-3 top-3 z-1000 inline-flex items-center gap-1.5 border border-line bg-panel px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-paper transition-colors hover:border-gold hover:text-gold"
      >
        <Icon name={isFullscreen ? "compress" : "expand"} />
        {isFullscreen ? "Close" : "Expand"}
      </button>
    </div>
  );
};

export default LocationMap;
