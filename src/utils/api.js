const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const ROUTE_URL = "https://api.openrouteservice.org/v2/directions";
const API_KEY = "YOUR_OPENROUTESERVICE_KEY"; // free signup, no card

// 🔍 Search place by name
// Search place using OpenStreetMap Nominatim
export async function searchPlace(query) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
    query
  )}&format=json&limit=5`;
  const res = await fetch(url);
  return res.json();
}


// 🛣️ Get route between two points
export async function getRoute(start, end, mode = "driving-car") {
  const url = `${ROUTE_URL}/${mode}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      coordinates: [
        [start.lng, start.lat],
        [end.lng, end.lat],
      ],
    }),
  });
  return res.json();
}
