"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface SettingsContextType {
  autoPlayEnabled: boolean;
  toggleAutoPlay: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("settings_autoPlay");
      return stored !== null ? JSON.parse(stored) : false;
    }
    return false;
  });

  const toggleAutoPlay = () => {
    setAutoPlayEnabled((prev: boolean) => {
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
