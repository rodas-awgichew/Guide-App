import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import useGeolocation from "../hooks/useGeolocation";
import SearchBox from "../components/SearchBox";
import { getRoute } from "../utils/api";

// Fit map bounds
function FitBounds({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords?.length > 0) map.fitBounds(coords);
  }, [coords, map]);
  return null;
}

// Format human-readable instructions
function formatInstruction(step) {
  let text = "";
  switch (step.maneuver?.type) {
    case "turn":
      text = `Turn ${step.maneuver.modifier || ""}`;
      break;
    case "depart":
      text = "Start";
      break;
    case "arrive":
      text = "Arrive at destination";
      break;
    default:
      text = step.maneuver?.type || "Continue";
  }
  if (step.name) text += ` onto ${step.name}`;
  if (step.distance) text += ` for ${(step.distance / 1000).toFixed(2)} km`;
  return text.trim();
}

export default function MapPage() {
  const [start, setStart] = useState(null);
  const [destination, setDestination] = useState(null);
  const [route, setRoute] = useState(null);
  const [mode, setMode] = useState("driving");

  const { position, getLocation } = useGeolocation();

  useEffect(() => {
    if (start && destination) fetchRoute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, destination, mode]);

  const fetchRoute = async () => {
    const data = await getRoute(
      [start.lng, start.lat],
      [destination.lng, destination.lat],
      mode
    );
    if (data) setRoute(data);
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Fixed Header */}
      <div className="p-4 border-b">
  <h2 className="text-lg font-bold text-gray-700">Smart Navigator</h2>
</div>
      {/* Main content: sidebar + map */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-gray-100 shadow-lg flex flex-col z-50">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-gray-700 mb-2">Plan Your Trip</h2>

            <SearchBox label="Start" onSelect={setStart} />
            <SearchBox label="Destination" onSelect={setDestination} />

            <button
              onClick={() => position && setStart(position)}
              className="mt-2 w-full bg-blue-600 text-white py-2 rounded"
            >
              📍 Use My Location
            </button>
          </div>

          {/* Mode Switch */}
          <div className="p-2 flex space-x-2 bg-blue-50">
            {[
              { key: "driving", label: "🚗" },
              { key: "walking", label: "🚶" },
              { key: "cycling", label: "🚴" },
            ].map((m) => (
              <button
                key={m.key}
                className={`px-2 py-1 rounded ${
                  mode === m.key ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
                onClick={() => setMode(m.key)}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Directions */}
          <div className="flex-1 overflow-y-auto p-4 text-sm">
            {route?.steps ? (
              <div>
                <p className="font-semibold mb-2">
                  Total: {(route.distance / 1000).toFixed(2)} km •{" "}
                  {Math.floor(route.duration / 3600)} hr{" "}
                  {Math.round((route.duration % 3600) / 60)} min
                </p>
                <ol className="space-y-2">
                  {route.steps.map((step, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between bg-white p-2 rounded shadow"
                    >
                      <span>
                        <span className="font-bold">{i + 1}.</span>{" "}
                        {formatInstruction(step)}
                      </span>
                      <button
                        onClick={() => speak(formatInstruction(step))}
                        className="ml-2 text-blue-600 hover:underline"
                      >
                        🔊
                      </button>
                    </li>
                  ))}
                </ol>
              </div>
            ) : (
              <p className="text-gray-500">Enter start & destination</p>
            )}
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <MapContainer
            center={[9.0155, 38.7636]}
            zoom={14}
            style={{ height: "calc(100vh - 56px)", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />

            {start && (
              <Marker position={[start.lat, start.lng]}>
                <Popup>Start</Popup>
              </Marker>
            )}
            {destination && (
              <Marker position={[destination.lat, destination.lng]}>
                <Popup>Destination</Popup>
              </Marker>
            )}

            {route?.coords && (
              <>
                <Polyline positions={route.coords} color="blue" />
                <FitBounds coords={route.coords} />
              </>
            )}
          </MapContainer>

          {/* Floating Locate Me button */}
          
        </div>
      </div>
    </div>
  );
}
