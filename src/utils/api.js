// utils/api.js

// --- Utility: Cached Fetch ---
async function cachedFetch(key, fetchFn) {
  // If offline → return only cache
  if (!navigator.onLine) {
    const cached = localStorage.getItem(key);
    if (cached) {
      console.log("Loaded from cache:", key);
      return JSON.parse(cached);
    }
    return []; // no data available offline
  }

  // Online → check cache first (optional optimization)
  const cached = localStorage.getItem(key);
  if (cached) {
    console.log("Using cached copy (online):", key);
    return JSON.parse(cached);
  }

  // Fetch fresh data
  const data = await fetchFn();

  // Save to cache only if offlineCache setting is enabled
  const offlineEnabled = localStorage.getItem("offlineCache") === "true";
  if (offlineEnabled) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  return data;
}

// --- Place Search using Nominatim ---
export async function searchPlace(query) {
  return cachedFetch(`search-${query}`, async () => {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      query
    )}&format=json&limit=5`;
    const res = await fetch(url);
    return res.json();
  });
}

// --- Get Route using OSRM ---
export async function getRoute(start, end, mode = "driving") {
  return cachedFetch(`route-${mode}-${start.join(",")}-${end.join(",")}`, async () => {
    const url = `https://router.project-osrm.org/route/v1/${mode}/${start[0]},${start[1]};${end[0]},${end[1]}?overview=full&geometries=geojson&steps=true`;
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
  });
}

// --- Nearby Places using Overpass ---
export async function getNearbyPlaces(lat, lng, type) {
  return cachedFetch(`nearby-${type}-${lat}-${lng}`, async () => {
    const radius = 2000;
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
      type,
      address:
        el.tags?.addr_full ||
        el.tags?.street ||
        el.tags?.addr_city ||
        "Unknown address",
      lat: el.lat || el.center?.lat,
      lng: el.lon || el.center?.lon,
      image: `https://source.unsplash.com/400x300/?${type}`,
    }));
  });
}

// --- Distance Calculation ---
export function getDistance([lng1, lat1], [lng2, lat2]) {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
