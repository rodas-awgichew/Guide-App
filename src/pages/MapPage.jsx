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
import { useTheme } from "../context/ThemeContext";

// Fit bounds helper
function FitBounds({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords?.length > 0) map.fitBounds(coords);
  }, [coords, map]);
  return null;
}

// Distance conversion helper
function convertDistance(meters, unit) {
  if (!meters) return "-";
  const km = meters / 1000;
  return unit === "mi"
    ? `${(km * 0.621371).toFixed(2)} mi`
    : `${km.toFixed(2)} km`;
}

// Human-readable instruction
function formatInstruction(step, unit) {
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
  if (step.distance)
    text += ` for ${convertDistance(step.distance, unit)}`;
  return text.trim();
}

export default function MapPage() {
  const { darkMode } = useTheme();

  const [start, setStart] = useState(null);
  const [destination, setDestination] = useState(null);
  const [route, setRoute] = useState(null);
  const [mode, setMode] = useState("driving");

  const { position, getLocation } = useGeolocation();

  // Settings from localStorage
  const [voiceDirections, setVoiceDirections] = useState(true);
  const [distanceUnit, setDistanceUnit] = useState("km");

  useEffect(() => {
    try {
      const v = localStorage.getItem("voiceDirections");
      setVoiceDirections(v === null ? true : v === "true");

      const u = localStorage.getItem("distanceUnit");
      setDistanceUnit(u || "km");
    } catch {
      setVoiceDirections(true);
      setDistanceUnit("km");
    }
  }, []);

  useEffect(() => {
    if (start && destination) fetchRoute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, destination, mode]);

  const fetchRoute = async () => {
    try {
      const data = await getRoute(
        [start.lng, start.lat],
        [destination.lng, destination.lat],
        mode
      );
      if (data) setRoute(data);
    } catch (err) {
      console.error("MapPage: fetchRoute failed", err);
    }
  };

  const speak = (text) => {
    if (!voiceDirections || !text) return;
    const utter = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utter);
  };

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      } h-screen flex flex-col`}
    >
      {/* Secondary (page) header */}
      <div className="px-4 py-3 border-b">
        <h2 className="text-lg font-bold">Smart Navigator</h2>
      </div>

      {/* Main area: sidebar + map */}
      <div className="flex flex-1 overflow-hidden text-gray-900">
        {/* Sidebar */}
        <aside
          className={`${
            darkMode ? "bg-gray-800" : "bg-gray-100"
          } w-80 shadow-md flex flex-col z-10`}
        >
          <div className="p-4 border-b">
            <h3
              className={`${
                darkMode ? "text-gray-100" : "text-gray-700"
              } font-semibold mb-2`}
            >
              Plan Your Trip
            </h3>

            <SearchBox label="Start" onSelect={setStart} />
            <SearchBox label="Destination" onSelect={setDestination} />

            <button
              onClick={() => position && setStart(position)}
              className="mt-2 w-full bg-blue-600 text-white py-2 rounded"
            >
              📍 Use My Location
            </button>
          </div>

          {/* Mode switch */}
          <div className="p-2 flex space-x-2 bg-blue-50">
            {[
              { key: "driving", label: "🚗" },
              { key: "walking", label: "🚶" },
              { key: "cycling", label: "🚴" },
            ].map((m) => (
              <button
                key={m.key}
                className={`px-2 py-1 rounded ${
                  mode === m.key
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
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
                  Total:{" "}
                  {route?.distance
                    ? convertDistance(route.distance, distanceUnit)
                    : "-"}{" "}
                  •{" "}
                  {route?.duration
                    ? `${Math.floor(route.duration / 3600)} hr ${Math.round(
                        (route.duration % 3600) / 60
                      )} min`
                    : "-"}
                </p>

                <ol className="space-y-2">
                  {route.steps.map((step, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between bg-white rounded p-2 shadow-sm"
                    >
                      <span>
                        <span className="font-bold">{i + 1}.</span>{" "}
                        {formatInstruction(step, distanceUnit)}
                      </span>
                      {voiceDirections && (
                        <button
                          onClick={() =>
                            speak(formatInstruction(step, distanceUnit))
                          }
                          className="ml-2 text-blue-600"
                        >
                          🔊
                        </button>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            ) : (
              <p className="text-gray-500">Enter start & destination</p>
            )}
          </div>
        </aside>

        {/* Map */}
        <main className="flex-1 relative">
          <MapContainer
            center={[9.0155, 38.7636]}
            zoom={14}
            style={{ height: "100%", width: "100%" }}
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

          
        </main>
      </div>
    </div>
  );
}
