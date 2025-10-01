import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
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
  if (step.distance) text += ` for ${convertDistance(step.distance, unit)}`;
  return text.trim();
}

export default function MapPage() {
  const location = useLocation(); // for HomePage navigation
  const { darkMode } = useTheme();
  const { position: geoPosition, getLocation } = useGeolocation();

  const [start, setStart] = useState(null);
  const [destination, setDestination] = useState(null);
  const [route, setRoute] = useState(null);
  const [mode, setMode] = useState("driving");

  const [voiceDirections, setVoiceDirections] = useState(true);
  const [distanceUnit, setDistanceUnit] = useState("km");

  // Load settings from localStorage
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

  // Initialize start/destination from HomePage card click
  useEffect(() => {
    if (location.state?.userLocation && !start) setStart(location.state.userLocation);
    if (location.state?.destination && !destination) setDestination(location.state.destination);
  }, [location.state, start, destination]);

  // Fetch route when start/destination/mode changes
  useEffect(() => {
    if (start && destination) {
      fetchRoute(mode); // explicitly pass mode
    }
  }, [start, destination, mode]);
  
  const fetchRoute = async (travelMode) => {
    try {
      const data = await getRoute(
        [start.lng, start.lat],
        [destination.lng, destination.lat],
        travelMode
      );
      if (data) {
        setRoute(data); // replaces old route with new
      }
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
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} h-screen flex flex-col`}>
      {/* Secondary header */}
      <div className="px-4 py-3 border-b">
        <h2 className="text-lg font-bold">Smart Navigator</h2>
      </div>

      <div className="flex flex-1 overflow-hidden text-gray-900">
        {/* Sidebar */}
        <aside className={`${darkMode ? "bg-gray-800" : "bg-gray-100"} w-80 shadow-md flex flex-col z-10`}>
          <div className="p-4 border-b">
            <h3 className={`${darkMode ? "text-gray-100" : "text-gray-700"} font-semibold mb-2`}>
              Plan Your Trip
            </h3>

            <SearchBox label="Start" onSelect={setStart} />
            <SearchBox label="Destination" onSelect={setDestination} />

            <button
              onClick={() => geoPosition && setStart(geoPosition)}
              className="mt-2 w-full bg-blue-600 text-white py-2 rounded"
            >
              📍 Use My Location
            </button>
          </div>


{/* Directions */}
<div className="flex-1 overflow-y-auto p-4 text-sm ">

  {/* Mode switch */}
  <div className="p-2 flex space-x-2 bg-gray-100  dark:bg-gray-100 rounded-md mb-4">
    {[
      { key: "driving", label: "🚗 Driving", color: "" },
      { key: "walking", label: "🚶 Walking", color: "green" },
      { key: "cycling", label: "🚴 Cycling", color: "orange" },
    ].map((m) => (
      <button
        key={m.key}
        className={`px-3 py-1 rounded-full font-medium transition-colors ${
          mode === m.key
            ? `bg-${m.color}-600 text-white dark:bg-gray-500`
            : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-100"
        }`}
        onClick={() => setMode(m.key)}
      >
        {m.label}
      </button>
    ))}
  </div>

  {/* Directions List */}
  {route?.steps ? (
    <div key={mode}>
      <p className="font-semibold mb-3 flex items-center dark:text-gray-200 ">
        {mode === "driving" && <span className="mr-2">🚗 Driving Route</span>}
        {mode === "walking" && <span className="mr-2">🚶 Walking Route</span>}
        {mode === "cycling" && <span className="mr-2">🚴 Cycling Route</span>}
      </p>

      <p className="mb-4 dark:text-gray-200">
        <span className="font-semibold">Total:</span>{" "}
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

      <ol className="space-y-2 ">
        {route.steps.map((step, i) => (
          <li
            key={i}
            className="flex items-center justify-between bg-white dark:bg-gray-800 rounded p-2 shadow-sm"
          >
            <span className="text-gray-800  dark:text-gray-200">
  <span className="font-bold">{i + 1}.</span>{" "}
  {formatInstruction(step, distanceUnit)}
</span>
            {voiceDirections && (
              <button
                onClick={() => speak(formatInstruction(step, distanceUnit))}
                className="ml-2 text-blue-600 dark:text-blue-400"
              >
                🔊
              </button>
            )}
          </li>
        ))}
      </ol>
    </div>
  ) : (
    <p className="text-gray-500 dark:text-gray-400">
      Enter start & destination
    </p>
  )}
</div>


        </aside>

        {/* Map */}
        <main className="flex-1 relative">
          <MapContainer center={[9.0155, 38.7636]} zoom={14} style={{ height: "100%", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />

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
    <Polyline
      key={mode}
      positions={route.coords}
      color={
        mode === "driving" ? "blue" : mode === "walking" ? "green" : "orange"
      }
    />
    <FitBounds coords={route.coords} />
  </>
)}
          </MapContainer>

        
        </main>
      </div>
    </div>
  );
}
