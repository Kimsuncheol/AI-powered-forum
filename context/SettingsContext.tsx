"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface SettingsContextType {
  autoPlayEnabled: boolean;
  toggleAutoPlay: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("settings_autoPlay");
    if (stored !== null) {
      setAutoPlayEnabled(JSON.parse(stored));
    }
  }, []);

  const toggleAutoPlay = () => {
    setAutoPlayEnabled((prev) => {
      const newValue = !prev;
      localStorage.setItem("settings_autoPlay", JSON.stringify(newValue));
      return newValue;
    });
  };

  return (
    <SettingsContext.Provider value={{ autoPlayEnabled, toggleAutoPlay }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
