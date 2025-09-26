export default function PlaceCard({ place }) {
  return (
    <div className="w-64 bg-white rounded-xl shadow-md overflow-hidden flex-shrink-0">
      <img src={`https://source.unsplash.com/400x300/?restaurant&sig=${place.id}`} alt={place.name} />

      <div className="p-3">
        <h3 className="text-base font-semibold text-gray-800 line-clamp-1">
          {place.name}
        </h3>
        {place.distance != null && (
          <p className="text-sm text-gray-500 mt-1">
            {(place.distance / 1000).toFixed(1)} km away
          </p>
        )}
      </div>
    </div>
  );
}
