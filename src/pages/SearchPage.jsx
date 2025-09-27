import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useTheme } from "../context/ThemeContext";

export default function SearchPage() {
  const { darkMode } = useTheme();
  const [place, setPlace] = useState(null);

  // Ensure page respects global header (pt-14) and uses flex so map fills remaining height
  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} h-screen flex flex-col`}>
      {/* Page title (not fixed) */}
      <div className="px-4 py-4 border-b bg-transparent">
        <h1 className="text-lg font-bold">Search Destination</h1>
      </div>

      {/* Search bar */}
      <div className="p-4 z-10 text-gray-900">
        <SearchBar onSelect={setPlace} />
      </div>

      {/* Map: render only after selecting a place */}
      <div className="flex-1">
        {place ? (
          <MapContainer center={[place.lat, place.lng]} zoom={16} className="h-full w-full">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <Marker position={[place.lat, place.lng]}>
              <Popup>{place.name}</Popup>
            </Marker>
          </MapContainer>
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <p className="text-gray-500">Search for a place to show it on the map</p>
          </div>
        )}
      </div>
    </div>
  );
}
