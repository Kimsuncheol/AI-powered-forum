"use client";

import React, { createContext, useContext, useState, useMemo, ReactNode } from "react";
import { ThemeProvider as MUIThemeProvider, createTheme, CssBaseline, useMediaQuery } from "@mui/material";
import { getThemeOptions } from "@/lib/theme";

type Mode = "light" | "dark" | "system";

interface ThemeContextType {
  mode: Mode;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>(() => {
    if (typeof window !== "undefined") {
      const savedMode = localStorage.getItem("themeMode") as Mode;
      if (savedMode && ["light", "dark", "system"].includes(savedMode)) {
        return savedMode;
      }
    }
    return "light";
  });

  const systemIsDark = useMediaQuery("(prefers-color-scheme: dark)");

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
