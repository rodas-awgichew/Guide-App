import { useState } from "react";
import { searchPlace } from "../utils/api";

export default function SearchBar({ onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showDropdown, setShowDropdown] = useState(false);

  // Handle search
  async function handleSearch(e) {
    e.preventDefault();
    if (!query) return;
    const data = await searchPlace(query);
    setResults(data);
    setActiveIndex(-1);
    setShowDropdown(true);
  }

  // Handle keyboard navigation
  function handleKeyDown(e) {
    if (!results.length) return;

    if (e.key === "ArrowDown") {
      setActiveIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      if (activeIndex >= 0) selectPlace(results[activeIndex]);
    }
  }

  const selectPlace = (place) => {
    onSelect({
      lat: parseFloat(place.lat),
      lng: parseFloat(place.lon),
      name: place.display_name,
    });
    setResults([]);
    setQuery("");
    setShowDropdown(false);
  };

  return (
    <div className="w-full max-w-md mx-auto relative">
      <form onSubmit={handleSearch} className="flex mb-2 z-50 relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search for a place..."
          className="flex-1 px-4 py-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500 relative z-50"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600 transition relative z-50"
        >
          Search
        </button>
      </form>

      {/* Dropdown overlay */}
      {showDropdown && results.length > 0 && (
        <>
          {/* Blurred overlay behind dropdown */}
          <div
            className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm z-40"
            onClick={() => setShowDropdown(false)}
          ></div>

          <ul className="absolute z-50 w-full bg-white border rounded shadow max-h-60 overflow-y-auto">
            {results.map((place, idx) => (
              <li
                key={place.place_id}
                className={`p-2 cursor-pointer hover:bg-gray-100 ${
                  idx === activeIndex ? "bg-blue-100" : ""
                }`}
                onClick={() => selectPlace(place)}
              >
                {place.display_name}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
