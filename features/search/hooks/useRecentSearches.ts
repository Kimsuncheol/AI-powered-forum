"use client";

import { useState, useCallback } from "react";
import { useSettings } from "@/context/SettingsContext";

const STORAGE_KEY = "recent_searches";

export function useRecentSearches() {
  const { 
    searchAutoSave, 
    toggleSearchAutoSave, 
    maxRecentSearches 
  } = useSettings();

  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const addSearch = useCallback((keyword: string) => {
    const trimmed = keyword.trim();
    if (!trimmed) return;

    if (!searchAutoSave) {
      return;
    }

    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item !== trimmed);
      const updated = [trimmed, ...filtered].slice(0, maxRecentSearches);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, [searchAutoSave, maxRecentSearches]);

  const clearSearches = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const removeSearch = useCallback((keyword: string) => {
    setRecentSearches((prev) => {
      const updated = prev.filter((item) => item !== keyword);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return {
    recentSearches,
    isAutoSaveEnabled: searchAutoSave,
    toggleAutoSave: toggleSearchAutoSave,
    addSearch,
    clearSearches,
    removeSearch,
  };
}
