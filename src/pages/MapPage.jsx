import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import useGeolocation from "../hooks/useGeolocation";
import { getRoute } from "../utils/api";
import { useLocation } from "react-router-dom";

export default function MapPage() {
  const { position } = useGeolocation();
  const [route, setRoute] = useState([]);
  const [destination, setDestination] = useState(null);

  const location = useLocation();

  useEffect(() => {
    if (location.state?.destination) {
      setDestination(location.state.destination);
    }
  }, [location.state]);

  async function handleRoute() {
    if (!position || !destination) return;

    const data = await getRoute(position, destination, "driving-car");

    const coords = data.features[0].geometry.coordinates.map((c) => [c[1], c[0]]);
    setRoute(coords);
  }

  return (
    <div className="h-screen w-full">
      <MapContainer center={[9.0108, 38.7578]} zoom={13} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {position && (
          <Marker position={[position.lat, position.lng]}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {destination && (
          <Marker position={[destination.lat, destination.lng]}>
            <Popup>{destination.name}</Popup>
          </Marker>
        )}

        {route.length > 0 && (
          <Polyline positions={route} pathOptions={{ color: "blue", weight: 5 }} />
        )}
      </MapContainer>

      {/* Route button */}
      {destination && (
        <div className="absolute top-4 left-4 bg-white p-2 rounded shadow">
          <button
            onClick={handleRoute}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Get Route
          </button>
        </div>
      )}
    </div>
  );
}
