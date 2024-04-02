import { createContext, useContext, useState, useMemo, useEffect } from "react";

const ThemeContext = createContext();

export default function ThemeProvider({ children }) {
  const [themeMode, setThemeMode] = useState(
    localStorage.getItem("theme") || "light",
  );

  function setTheme() {
    if (themeMode === "light") {
      return setThemeMode("dark");
    } else {
      return setThemeMode("light");
    }
  }

  useEffect(() => {
    document.querySelector("html").classList.remove("dark", "light");
    document.querySelector("html").classList.add(themeMode);
    localStorage.setItem("theme", themeMode);
  }, [themeMode]);

  const contextValue = useMemo(() => {
    return {
      themeMode,
      setTheme,
    };
  }, [themeMode]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
