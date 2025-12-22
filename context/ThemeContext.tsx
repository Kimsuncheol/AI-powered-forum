"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, ReactNode } from "react";
import { ThemeProvider as MUIThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { getThemeOptions } from "@/lib/theme";

type Mode = "light" | "dark" | "system";

interface ThemeContextType {
  mode: Mode;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("themeMode") as Mode;
    if (savedMode) {
      setMode(savedMode);
    }
    setMounted(true);
  }, []);

  const [systemIsDark, setSystemIsDark] = useState(false);

  useEffect(() => {
    setSystemIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemIsDark(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const resolvedMode = mode === "system" 
    ? (systemIsDark ? "dark" : "light") 
    : mode === "dark" ? "dark" : "light";

  const toggleMode = () => {
    setMode((prev) => {
      const nextMode: Mode = prev === "light" ? "dark" : prev === "dark" ? "system" : "light";
      localStorage.setItem("themeMode", nextMode);
      return nextMode;
    });
  };

  const theme = useMemo(
    () => createTheme(getThemeOptions(resolvedMode)),
    [resolvedMode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useThemeMode() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useThemeMode must be used within a ThemeProvider");
  }
  return context;
}
