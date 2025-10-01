import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";

export default function Settings() {
  const { darkMode, toggleDarkMode } = useTheme();

  // lazy init from localStorage (safe)
  const [offlineCache, setOfflineCache] = useState(() => {
    try {
      return localStorage.getItem("offlineCache") === "true";
    } catch {
      return false;
    }
  });
  const [voiceDirections, setVoiceDirections] = useState(() => {
    try {
      const v = localStorage.getItem("voiceDirections");
      return v === null ? true : v === "true";
    } catch {
      return true;
    }
  });
  const [distanceUnit, setDistanceUnit] = useState(() => {
    try {
      return localStorage.getItem("distanceUnit") || "km";
    } catch {
      return "km";
    }
  });

  // Persist toggles (safe)
  useEffect(() => {
    try {
      localStorage.setItem("offlineCache", offlineCache);
      localStorage.setItem("voiceDirections", voiceDirections);
      localStorage.setItem("distanceUnit", distanceUnit);
      // NOTE: theme is handled by ThemeContext (it writes darkMode).
    } catch (err) {
      console.error("Settings: failed to save settings", err);
    }
  }, [offlineCache, voiceDirections, distanceUnit]);

  // Clear cached app data but preserve theme preference
  const clearCache = () => {
    try {
      const keepDark = localStorage.getItem("darkMode");
      localStorage.clear();
      if (keepDark !== null) localStorage.setItem("darkMode", keepDark);
      // reset local component state to defaults
      setOfflineCache(false);
      setVoiceDirections(true);
      setDistanceUnit("km");
      alert("Cached data cleared (app settings preserved).");
    } catch (err) {
      console.error("Settings: clearCache failed", err);
      alert("Failed to clear cache.");
    }
  };

  return (
    // page root respects global header by using pt-14 and full height
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} min-h-screen pt-14 transition-colors`}>
      <div className="max-w-3xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Settings</h2>

        {/* Theme (uses ThemeContext) */}
        <div
       className={`flex justify-between items-center p-4 rounded-xl shadow-sm mb-4 transition-colors ${
        darkMode ? "bg-blue-900 text-white" : "bg-gray-200 text-gray-900"
        }`}
>
        <span className="font-medium">Dark Mode</span>
          <button
          onClick={toggleDarkMode}
           className={`px-4 py-2 rounded-full font-semibold transition-colors ${
         darkMode ? "bg-white text-blue-900" : "bg-blue-900 text-white"
        }`}
  >
    {darkMode ? "ON" : "OFF"}
  </button>
</div>


        {/* Offline Cache */}
        <div
       className={`flex justify-between items-center p-4 rounded-xl shadow-sm mb-4 transition-colors ${
        darkMode ? "bg-blue-900 text-white" : "bg-gray-200 text-gray-900"
        }`}
>
          <span className="font-medium">Offline Cache</span>
          <button
            onClick={() => setOfflineCache((v) => !v)}
            className={`px-4 py-2 rounded-full font-semibold transition-colors ${
              offlineCache ? "bg-blue-900 text-white" : "bg-gray-300 text-gray-800"
            }`}
          >
            {offlineCache ? "ON" : "OFF"}
          </button>
        </div>

        {/* Voice Directions */}
        <div
       className={`flex justify-between items-center p-4 rounded-xl shadow-sm mb-4 transition-colors ${
        darkMode ? "bg-blue-900 text-white" : "bg-gray-200 text-gray-900"
        }`}
>
          <span className="font-medium">Voice Directions</span>
          <button
            onClick={() => setVoiceDirections((v) => !v)}
            className={`px-4 py-2 rounded-full font-semibold transition-colors ${
              voiceDirections ? "bg-blue-900 text-white" : "bg-gray-300 text-gray-800"
            }`}
          >
            {voiceDirections ? "ON" : "OFF"}
          </button>
        </div>

        {/* Distance Units */}
        <div
       className={`flex justify-between items-center p-4 rounded-xl shadow-sm mb-4 transition-colors ${
        darkMode ? "bg-blue-900 text-white" : "bg-gray-200 text-gray-900"
        }`}
>
          <span className="font-medium">Distance Units</span>
          <button
            onClick={() => setDistanceUnit((u) => (u === "km" ? "mi" : "km"))}
            className="px-4 py-2 bg-blue-900 text-white rounded-full font-semibold"
          >
            {distanceUnit === "km" ? "Kilometers" : "Miles"}
          </button>
        </div>

        {/* Clear Cache */}
        <button
          onClick={clearCache}
          className="w-full mt-6 py-3 dark:bg-gray-800 text-white font-semibold rounded-xl shadow hover:bg-red-400 transition-colors"
        >
          Clear Cached Data
        </button>
      </div>
    </div>
  );
}
