import { useEffect, useState } from "react"; 
import { useNavigate } from "react-router-dom";
import ScrollableSection from "../components/ScrollableSection";
import useGeolocation from "../hooks/useGeolocation";
import { getNearbyPlaces, getDistance } from "../utils/api";
import { useTheme } from "../context/ThemeContext";

export default function HomePage() {
  const navigate = useNavigate();
  const { position } = useGeolocation();
  const { darkMode } = useTheme();

  const [restaurants, setRestaurants] = useState([]);
  const [hotels, setHotels] = useState([]);

  // Stable images for restaurants and hotels
  const restaurantImages = [
    "/images/restaurant1.jpg",
    "/images/restaurant2.jpg",
    "/images/restaurant3.jpg",
    "/images/restaurant4.jpg"
  ];
  const hotelImages = [
    "/images/hotel1.jpg",
    "/images/hotel2.jpg",
    "/images/hotel3.jpg",
    "/images/hotel4.jpg"
  ];

  const handlePlaceClick = (place) => {
    if (!position) return;

    const distanceMeters = getDistance(
      [position.lng, position.lat],
      [place.lng, place.lat]
    );

    navigate("/map", {
      state: {
        destination: place,
        userLocation: position,
        distance: distanceMeters / 1000, // convert to km
      },
    });
  };

  const addImagesAndDistance = (places, keyword) =>
    (places || []).map((place, index) => ({
      ...place,
      image:
        keyword === "restaurant"
          ? restaurantImages[index % restaurantImages.length]
          : hotelImages[index % hotelImages.length],
      distance: position
        ? getDistance([position.lng, position.lat], [place.lng, place.lat]) / 1000 // meters → km
        : null,
    }));

  useEffect(() => {
    if (!position) return;

    const fetchNearbyData = async () => {
      try {
        const nearbyRestaurants = await getNearbyPlaces(
          position.lat,
          position.lng,
          "restaurant"
        );
        const nearbyHotels = await getNearbyPlaces(
          position.lat,
          position.lng,
          "hotel"
        );

        setRestaurants(addImagesAndDistance(nearbyRestaurants, "restaurant"));
        setHotels(addImagesAndDistance(nearbyHotels, "hotel"));
      } catch (err) {
        console.error("HomePage: fetchNearbyData failed:", err);
        setRestaurants([]);
        setHotels([]);
      }
    };

    fetchNearbyData();
  }, [position]);

  return (
    <div
      className={`min-h-screen transition-colors ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center py-12">
          <h1
            className={`text-4xl sm:text-5xl font-bold mb-4 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Explore Your City 🌍
          </h1>
          <p
            className={`text-lg max-w-2xl mx-auto ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Discover nearby restaurants, hotels, and landmarks — all in one
            place. Smooth navigation, smart suggestions, and a beautiful UI
            designed for you.
          </p>
        </section>

        {/* Restaurants Section */}
        {restaurants.length > 0 && (
          <ScrollableSection
            title="Nearby Restaurants"
            places={restaurants.map((r) => ({
              ...r,
              displayDistance: r.distance
                ? `${r.distance.toFixed(2)} km`
                : "N/A",
            }))}
            onPlaceClick={handlePlaceClick}
          />
        )}

        {/* Hotels Section */}
        {hotels.length > 0 && (
          <ScrollableSection
            title="Nearby Hotels"
            places={hotels.map((h) => ({
              ...h,
              displayDistance: h.distance
                ? `${h.distance.toFixed(2)} km`
                : "N/A",
            }))}
            onPlaceClick={handlePlaceClick}
          />
        )}
      </div>
    </div>
  );
}
