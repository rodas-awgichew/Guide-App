import { useEffect, useState } from "react";

export default function useGeolocation() {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        console.error("Geolocation error:", err);
      }
    );
  }, []);

  return { position };
}
