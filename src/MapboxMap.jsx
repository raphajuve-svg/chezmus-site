import { useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";

const LOCATION = [5.62936, 50.66312];

export default function MapboxMap() {
  const containerRef = useRef(null);
  const [failed, setFailed] = useState(false);
  const token = import.meta.env.VITE_MAPBOX_TOKEN;

  useEffect(() => {
    if (!token || !containerRef.current) return undefined;

    let map;
    let cancelled = false;

    async function createMap() {
      try {
        const { default: mapboxgl } = await import("mapbox-gl");
        if (cancelled || !containerRef.current) return;

        mapboxgl.accessToken = token;
        map = new mapboxgl.Map({
          container: containerRef.current,
          style: "mapbox://styles/mapbox/navigation-night-v1",
          center: LOCATION,
          zoom: 15.4,
          attributionControl: false,
        });

        map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
        map.addControl(new mapboxgl.AttributionControl({ compact: true }));

        const marker = document.createElement("div");
        marker.className = "chezmus-marker";
        marker.setAttribute("aria-label", "Chez Mus");

        new mapboxgl.Marker({ element: marker, anchor: "bottom" })
          .setLngLat(LOCATION)
          .setPopup(
            new mapboxgl.Popup({ offset: 24, closeButton: false }).setHTML(
              "<strong>Chez Mus</strong><br>Rue Elisa Dumonceau 69",
            ),
          )
          .addTo(map);

        map.on("error", () => setFailed(true));
      } catch {
        setFailed(true);
      }
    }

    createMap();
    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [token]);

  if (!token || failed) {
    return (
      <div className="map-fallback">
        <div className="map-fallback-pin" aria-hidden="true">★</div>
        <div>
          <strong>Chez Mus · Herstal</strong>
          <span>Rue Elisa Dumonceau 69, 4040 Herstal</span>
          <a href="https://maps.google.com/?q=Rue+Elisa+Dumonceau+69+4040+Herstal" target="_blank" rel="noreferrer">
            Ouvrir l’itinéraire
          </a>
        </div>
      </div>
    );
  }

  return <div ref={containerRef} className="mapbox-canvas" aria-label="Carte de Chez Mus à Herstal" />;
}
