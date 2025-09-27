import PlaceCard from "./PlaceCard";
import { useTheme } from "../context/ThemeContext";

export default function ScrollableSection({ title, places, onPlaceClick, distanceUnit }) {
  const { darkMode } = useTheme();

  return (
    <section className="my-8">
      <h2
        className={`text-2xl font-bold mb-4 px-2 ${
          darkMode ? "text-white" : "text-gray-800"
        }`}
      >
        {title}
      </h2>
      <div className="flex space-x-4 overflow-x-auto scrollbar-hide py-2 px-2">
        {places.map((place) => (
          <div
            key={place.id}
            onClick={() => onPlaceClick(place)}
            className="cursor-pointer transform transition duration-200 hover:scale-105 hover:shadow-lg"
          >
            <PlaceCard place={place} distanceUnit={distanceUnit} />
          </div>
        ))}
      </div>
    </section>
  );
}
