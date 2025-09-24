import { useState } from "react";
import { searchPlace } from "../utils/api";

export default function SearchBar({ onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  async function handleSearch(e) {
    e.preventDefault();
    if (!query) return;
    const data = await searchPlace(query);
    setResults(data);
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Search input */}
      <form onSubmit={handleSearch} className="flex mb-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a place..."
          className="flex-1 px-4 py-2 border rounded-l"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-r"
        >
          Search
        </button>
      </form>

      {/* Results */}
      {results.length > 0 && (
        <ul className="bg-white border rounded shadow">
          {results.map((place) => (
            <li
              key={place.place_id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() =>
                onSelect({
                  lat: parseFloat(place.lat),
                  lng: parseFloat(place.lon),
                  name: place.display_name,
                })
              }
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
