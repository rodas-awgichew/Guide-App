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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Local fallback images
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
      [position.lat, position.lng],
      [place.lat, place.lng]
    );

    navigate("/map", {
      state: {
        destination: place,
        userLocation: position,
        distance: distanceMeters / 1000, // km
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
        ? getDistance([position.lat, position.lng], [place.lat, place.lng]) / 1000
        : null,
    }));

  useEffect(() => {
    if (!position) return;

    const fetchNearbyData = async () => {
      setLoading(true);
      setError(null);

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

        console.log("Fetched restaurants:", nearbyRestaurants);
        console.log("Fetched hotels:", nearbyHotels);

        setRestaurants(addImagesAndDistance(nearbyRestaurants, "restaurant"));
        setHotels(addImagesAndDistance(nearbyHotels, "hotel"));
      } catch (err) {
        console.error("HomePage: fetchNearbyData failed:", err);
        setError("Failed to load nearby places.");
        setRestaurants([]);
        setHotels([]);
      } finally {
        setLoading(false);
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
<section className="relative text-center py-20 rounded-2xl overflow-hidden">
  {/* Background image with dark overlay */}
  <div className="absolute inset-0">
    <img
      src="/assets/bg.jpg"
      alt=""
      className="w-full h-full object-cover opacity-40"
    />
    <div className="absolute inset-0 bg-black/50"></div>
  </div>

  {/* Content */}
  <div className="relative z-10 px-4">
    <h1
      className={`text-4xl sm:text-5xl font-bold mb-4 ${
        darkMode ? "text-white" : "text-gray-900"
      }`}
    >
      Explore Your City 🌍
    </h1>
    <p
      className={`text-lg max-w-2xl mx-auto ${
        darkMode ? "text-gray-300" : "text-gray-100"
      }`}
    >
      Discover nearby restaurants, hotels, and landmarks — all in one place.  
      Smooth navigation,and smart suggestions.
    </p>
  </div>
</section>


        {/* Loading / Error / Empty States */}
        {loading && (
          <p className="text-center text-gray-500">Loading nearby places...</p>
        )}
        {error && (
          <p className="text-center text-red-500">{error}</p>
        )}
        {!loading && !error && restaurants.length === 0 && hotels.length === 0 && (
          <p className="text-center text-gray-500">
            No nearby restaurants or hotels found within 2km.
          </p>
        )}

        {/* Restaurants */}
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

        {/* Hotels */}
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
