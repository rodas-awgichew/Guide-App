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
    const url = `https://router.project-osrm.org/route/v1/${mode}/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson&steps=true`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.code !== "Ok" || !data.routes?.length) return null;

    const route = data.routes[0];

    return {
      coords: route.geometry.coordinates.map(([lng, lat]) => [lat, lng]),
      steps: route.legs[0].steps.map((step) => ({
        instruction: step.maneuver.instruction || step.name,
        distance: step.distance,
        maneuver: step.maneuver,
        name: step.name,
      })),
      distance: route.distance,
      duration: route.duration,
    };
  } catch (err) {
    console.error("Error fetching route:", err);
    return null;
  }
}

// 🏨 Fetch nearby places from OpenStreetMap Overpass API
export async function getNearbyPlaces(lat, lng, type) {
  try {
    const radius = 2000; // 2km radius
    const filter =
      type === "hotel" ? '["tourism"="hotel"]' : `["amenity"="${type}"]`;

    const query = `
      [out:json];
      (
        node${filter}(around:${radius},${lat},${lng});
        way${filter}(around:${radius},${lat},${lng});
        relation${filter}(around:${radius},${lat},${lng});
      );
      out center;
    `;

    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
      query
    )}`;

    const res = await fetch(url);
    const data = await res.json();

    return data.elements.map((el, idx) => ({
      id: el.id || idx,
      name: el.tags?.name || `${type} ${idx + 1}`,
      type: type,
      address:
        el.tags?.addr_full ||
        el.tags?.street ||
        el.tags?.addr_city ||
        "Unknown address",
      lat: el.lat || el.center?.lat,
      lng: el.lon || el.center?.lon,
      image: `https://source.unsplash.com/400x300/?${type}`,
    }));
  } catch (err) {
    console.error("Error fetching nearby places:", err);
    return [];
  }
}

// 📏 Correct Haversine Distance (expects [lat, lng])
export function getDistance([lat1, lng1], [lat2, lng2]) {
  const R = 6371e3; // meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // meters
}
