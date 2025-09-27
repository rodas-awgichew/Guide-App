// src/context/SettingsContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
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

  useEffect(() => {
    try {
      localStorage.setItem("voiceDirections", voiceDirections);
      localStorage.setItem("distanceUnit", distanceUnit);
    } catch (err) {
      console.error("SettingsContext save failed", err);
    }
  }, [voiceDirections, distanceUnit]);

  return (
    <SettingsContext.Provider
      value={{
        voiceDirections,
        setVoiceDirections,
        distanceUnit,
        setDistanceUnit,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
