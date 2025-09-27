export default function PlaceCard({ place }) {
  return (
    <div className="w-64 rounded-lg  bg-Dark dark:bg-gray-900 shadow-md">
      <img
        src={place.image}
        alt={place.name}
        className="w-full h-40 object-cover"
        onError={(e) => {
          e.target.src = "https://picsum.photos/400/300?blur";
        }}
      />
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 dark:text-white">{place.name}</h3>
        {place.displayDistance && (
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {place.displayDistance} away
          </p>
        )}
      </div>
    </div>
  );
}
