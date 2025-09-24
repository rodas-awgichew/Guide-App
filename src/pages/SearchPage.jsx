import { useState } from "react";
import SearchBar from "../components/SearchBar";
import { useNavigate } from "react-router-dom";

export default function SearchPage() {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  function handleSelect(place) {
    setSelected(place);
    // Go to map and pass coordinates
    navigate("/map", { state: { destination: place } });
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Search Destination</h1>
      <SearchBar onSelect={handleSelect} />

      {selected && (
        <div className="mt-4 p-2 bg-gray-100 rounded">
          <p>Selected: {selected.name}</p>
        </div>
      )}
    </div>
  );
}
