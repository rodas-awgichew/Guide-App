import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ScrollableSection from "../components/ScrollableSection";
import useGeolocation from "../hooks/useGeolocation";
import { getNearbyPlaces, getDistance } from "../utils/api";

export default function HomePage() {
  const navigate = useNavigate();
  const { position } = useGeolocation();

  const [restaurants, setRestaurants] = useState([]);
  const [hotels, setHotels] = useState([]);

   const handlePlaceClick = (place) => {
  if (!position) return;

  const distance = getDistance(
    [position.lng, position.lat],
    [place.lng, place.lat]
  );

  navigate("/map", {
    state: {
      destination: place,
      userLocation: position,
      distance,
    },
  });
};



  const addImagesAndDistance = (places, keyword) =>
  places.map((place, index) => ({
    ...place,
    image: `https://source.unsplash.com/400x300/?${keyword}&sig=${index}`,
    distance: position
      ? getDistance([position.lng, position.lat], [place.lng, place.lat])
      : null,
  }));

useEffect(() => {
  if (position) {
    const fetchNearbyData = async () => {
      const nearbyRestaurants = await getNearbyPlaces(position.lat, position.lng, "restaurant");
      const nearbyHotels = await getNearbyPlaces(position.lat, position.lng, "hotel");

      setRestaurants(addImagesAndDistance(nearbyRestaurants, "restaurant"));
      setHotels(addImagesAndDistance(nearbyHotels, "hotel"));
    };
    fetchNearbyData();
  }
}, [position]);
  



  return (
    <div className="bg-darkblue min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center text-white py-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Explore Your City 🌍
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Discover nearby restaurants, hotels, and landmarks — all in one
            place. Smooth navigation, smart suggestions, and a beautiful UI
            designed for you.
          </p>
        </section>

        {/* Scrollable Sections */}
        {restaurants.length > 0 && (
          <ScrollableSection
            title="Nearby Restaurants"
            places={restaurants}
            onPlaceClick={handlePlaceClick}
          />
        )}

        {hotels.length > 0 && (
          <ScrollableSection
            title="Nearby Hotels"
            places={hotels}
            onPlaceClick={handlePlaceClick}
          />
        )}
      </div>
    </div>
  );
}
