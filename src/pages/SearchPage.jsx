import { useState } from "react";
import SearchBar from "../components/SearchBar";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function SearchPage() {
  const [place, setPlace] = useState(null);

  return (
    <div className="h-screen w-full flex flex-col">
      {/* Header */}
      <header className="h-14 bg-blue-900 text-white flex items-center px-4 shadow z-50">
        <h1 className="text-lg font-bold">Search Destination</h1>
      </header>

      {/* Search bar */}
      <div className="p-4 z-50">
        <SearchBar onSelect={setPlace} />
      </div>

      {/* Map: Render only after search */}
      {place && (
        <div className="flex-1">
          <MapContainer
            center={[place.lat, place.lng]}
            zoom={16}
            className="h-full w-full"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <Marker position={[place.lat, place.lng]}>
              <Popup>{place.name}</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}
    </div>
  );
}
