import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

/**
 * ThemeProvider
 * - Stores darkMode in localStorage (safe)
 * - Adds/removes "dark" class on <html> (Tailwind class-based dark mode)
 */
export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  // read saved preference once (safe)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("darkMode");
      if (saved !== null) {
        setDarkMode(saved === "true");
      } else {
        setDarkMode(false); // default: light
      }
    } catch (err) {
      console.error("ThemeProvider: failed to read localStorage:", err);
      setDarkMode(false);
    }
  }, []);

  // apply class + persist whenever darkMode changes
  useEffect(() => {
    try {
      localStorage.setItem("darkMode", darkMode);
    } catch (err) {
      console.error("ThemeProvider: failed to write localStorage:", err);
    }

    const html = document.documentElement;
    if (darkMode) html.classList.add("dark");
    else html.classList.remove("dark");
  }, [darkMode]);

  const toggleDarkMode = useCallback(() => setDarkMode((v) => !v), []);

  const value = {
    darkMode,
    setDarkMode,
    toggleDarkMode,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
