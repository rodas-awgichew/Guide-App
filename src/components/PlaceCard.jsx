export default function PlaceCard({ place, index }) {
  // Fallback image list (will alternate)
  const fallbackImages = [
    "/images/restaurant1.jpg",
    "/images/restaurant2.jpg",
    "/images/restaurant3.jpg",
    "/images/restaurant4.jpg",
  ];

  const imageSrc =
    place.image || fallbackImages[index % fallbackImages.length];

  return (
    <div className="w-64 rounded-lg bg-gray-100 dark:bg-gray-900 shadow-md">
      <img
        src={imageSrc}
        alt={place.name}
        className="w-full h-40 object-cover rounded-lg"
        onError={(e) => {
          e.target.src = "https://picsum.photos/400/300?blur";
        }}
      />
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          {place.name}
        </h3>
        {place.displayDistance && (
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {place.displayDistance} away
          </p>
        )}
      </div>
    </div>
  );
}
