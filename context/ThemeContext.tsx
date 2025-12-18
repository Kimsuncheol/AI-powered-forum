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
  const [mode, setMode] = useState<Mode>("system");
  const [resolvedMode, setResolvedMode] = useState<"light" | "dark">("light");

  // Load from localStorage on mount
  useEffect(() => {
    const savedMode = localStorage.getItem("themeMode") as Mode | null;
    if (savedMode) {
      setMode(savedMode);
    }
  }, []);

  // System preference listener
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = () => {
      if (mode === "system") {
        setResolvedMode(mediaQuery.matches ? "dark" : "light");
      }
    };

    // Calculate effective mode
    const effectiveMode = mode === "system" 
      ? (mediaQuery.matches ? "dark" : "light") 
      : mode;

    setResolvedMode((prev) => (prev !== effectiveMode ? effectiveMode : prev));

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [mode]);

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
