import PlaceCard from "./PlaceCard";

export default function ScrollableSection({ title, places, onPlaceClick }) {
  return (
    <section className="my-8">
      <h2 className="text-white text-2xl font-bold mb-4 px-2">{title}</h2>
      <div className="flex space-x-4 overflow-x-auto scrollbar-hide py-2 px-2">
        {places.map((place) => (
          <div key={place.id} onClick={() => onPlaceClick(place)}>
            <PlaceCard place={place} />
          </div>
        ))}
      </div>
    </section>
  );
}
