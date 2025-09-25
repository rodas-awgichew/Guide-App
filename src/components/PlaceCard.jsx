export default function PlaceCard({ place }) {
  return (
    <div
      className="min-w-[220px] sm:min-w-[250px] bg-white rounded-xl shadow-md overflow-hidden 
                 cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-xl"
    >
      <img
        src={place.image}
        alt={place.name}
        className="h-36 w-full object-cover"
      />
      <div className="p-4">
        <h3 className="font-bold text-lg text-darkblue">{place.name}</h3>
        <p className="text-gray-600 text-sm">{place.type}</p>
        <p className="text-gray-500 text-xs mt-1">{place.address}</p>
      </div>
    </div>
  );
}
