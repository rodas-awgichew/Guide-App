// utils/api.js

// 🔍 Search place using OpenStreetMap Nominatim (free, no key required)
export async function searchPlace(query) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
    query
  )}&format=json&limit=5`;
  const res = await fetch(url);
  return res.json();
}

// 🚗 Get route from OSRM (no key needed)
// mode can be "driving", "walking", "cycling"
export async function getRoute(start, end, mode = "driving") {
  try {
    const url = `https://router.project-osrm.org/route/v1/${mode}/${start[0]},${start[1]};${end[0]},${end[1]}?overview=full&geometries=geojson&steps=true`;
    console.log("Requesting route:", url);

    const res = await fetch(url);
    const data = await res.json();
    console.log("OSRM response:", data);

    if (data.code !== "Ok" || !data.routes?.length) {
      console.error("No route found:", data);
      return null;
    }

    const route = data.routes[0];
    return {
      coords: route.geometry.coordinates.map(([lng, lat]) => [lat, lng]), // Leaflet format
      steps: route.legs[0].steps.map((step) => ({
        instruction: step.maneuver.instruction || step.name,
        distance: step.distance,
      })),
    };
  } catch (err) {
    console.error("Error fetching route:", err);
    return null;
  }
}
