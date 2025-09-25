import Header from "../components/Header";
import ScrollableSection from "../components/ScrollableSection";
import { useNavigate } from "react-router-dom";

// Sample data
const restaurants = [
  {
    id: 1,
    name: "Cafe Blue",
    type: "Restaurant",
    address: "Downtown",
    image: "https://source.unsplash.com/400x300/?restaurant,cafe",
  },
  {
    id: 2,
    name: "The Gourmet",
    type: "Restaurant",
    address: "City Center",
    image: "https://source.unsplash.com/400x300/?restaurant,food",
  },
  {
    id: 3,
    name: "Green Garden",
    type: "Restaurant",
    address: "Suburb",
    image: "https://source.unsplash.com/400x300/?restaurant,dinner",
  },
  {
    id: 4,
    name: "Green Garden",
    type: "Restaurant",
    address: "Suburb",
    image: "https://source.unsplash.com/400x300/?restaurant,dinner",
  },
  {
    id: 5,
    name: "Green Garden",
    type: "Restaurant",
    address: "Suburb",
    image: "https://source.unsplash.com/400x300/?restaurant,dinner",
  },
  {
    id: 6,
    name: "Green Garden",
    type: "Restaurant",
    address: "Suburb",
    image: "https://source.unsplash.com/400x300/?restaurant,dinner",
  },

  {
    id: 7,
    name: "Green Garden",
    type: "Restaurant",
    address: "Suburb",
    image: "https://source.unsplash.com/400x300/?restaurant,dinner",
  },
];

const hotels = [
  {
    id: 1,
    name: "Grand Hotel",
    type: "Hotel",
    address: "Main Street",
    image: "https://source.unsplash.com/400x300/?hotel,luxury",
  },
  {
    id: 2,
    name: "Skyline Inn",
    type: "Hotel",
    address: "Uptown",
    image: "https://source.unsplash.com/400x300/?hotel,room",
  },
  {
    id: 3,
    name: "Ocean View",
    type: "Hotel",
    address: "Beachside",
    image: "https://source.unsplash.com/400x300/?hotel,resort",
  },
  {
  id: 4,
    name: "Ocean View",
    type: "Hotel",
    address: "Beachside",
    image: "https://source.unsplash.com/400x300/?hotel,resort",
  },
  {
  id: 5,
    name: "Ocean View",
    type: "Hotel",
    address: "Beachside",
    image: "https://source.unsplash.com/400x300/?hotel,resort",
  },
{
  id: 6,
    name: "Ocean View",
    type: "Hotel",
    address: "Beachside",
    image: "https://source.unsplash.com/400x300/?hotel,resort",
  },
  {
  id: 7,
    name: "Ocean View",
    type: "Hotel",
    address: "Beachside",
    image: "https://source.unsplash.com/400x300/?hotel,resort",
  },
];

export default function HomePage() {
  const navigate = useNavigate();

  const handlePlaceClick = (place) => {
    navigate("/map", { state: { destination: place } });
  };

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
        <ScrollableSection
          title="Nearby Restaurants"
          places={restaurants}
          onPlaceClick={handlePlaceClick}
        />
        <ScrollableSection
          title="Nearby Hotels"
          places={hotels}
          onPlaceClick={handlePlaceClick}
        />
      </div>
    </div>
  );
}

// export default function HomePage() {
//   return (
//     <div className="bg-darkblue min-h-screen">
//       <div className="max-w-7xl mx-auto py-8">
//         <section className="text-center text-white py-12">
//           <h1 className="text-4xl font-bold mb-4">Explore Your City</h1>
//           <p className="text-lg text-gray-300 max-w-2xl mx-auto">
//             Discover nearby restaurants, hotels, and landmarks — all in one
//             place. Smooth navigation, smart suggestions, and a beautiful UI
//             designed for you.
//           </p>
//         </section>

//         <ScrollableSection title="Nearby Restaurants" places={restaurants} />
//         <ScrollableSection title="Nearby Hotels" places={hotels} />
//       </div>
//     </div>
//   );
// }
