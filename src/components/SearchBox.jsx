import { useState } from "react";

export default function SearchBox({ label, onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (value) => {
    setQuery(value);
    if (value.length < 3) return;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          value
        )}`
      );
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  return (
    <div className="relative mb-2">
      <label className="text-sm font-semibold text-gray-600">{label}</label>
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder={`Search ${label}`}
        className="mt-1 w-full p-2 border rounded"
      />
      {results.length > 0 && (
        <ul className="absolute z-50 bg-white border mt-1 w-full max-h-40 overflow-y-auto shadow-lg rounded">
          {results.map((place) => (
            <li
              key={place.place_id}
              className="p-2 hover:bg-blue-100 cursor-pointer text-sm"
              onClick={() => {
                setQuery(place.display_name);
                setResults([]);
                onSelect({
                  lat: parseFloat(place.lat),
                  lng: parseFloat(place.lon),
                  name: place.display_name,
                });
              }}
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
