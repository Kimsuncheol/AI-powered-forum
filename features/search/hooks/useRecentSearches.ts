"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const MAX_RECENT_SEARCHES = 5;
const STORAGE_KEY = "recent_searches";
const AUTO_SAVE_KEY = "search_auto_save";

export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState(() => {
    if (typeof window === 'undefined') return true;
    const stored = localStorage.getItem(AUTO_SAVE_KEY);
    return stored !== null ? stored === "true" : true;
  });
  
  // Use a ref to access the latest auto-save state in callbacks without adding it to dependencies
  const isAutoSaveEnabledRef = useRef(isAutoSaveEnabled);

  // Sync ref with state
  useEffect(() => {
    isAutoSaveEnabledRef.current = isAutoSaveEnabled;
  }, [isAutoSaveEnabled]);

  const toggleAutoSave = useCallback(() => {
    setIsAutoSaveEnabled((prev) => {
      const next = !prev;
      localStorage.setItem(AUTO_SAVE_KEY, String(next));
      isAutoSaveEnabledRef.current = next;
      return next;
    });
  }, []);

  const addSearch = useCallback((keyword: string) => {
    const trimmed = keyword.trim();
    if (!trimmed) return;

    if (!isAutoSaveEnabledRef.current) {
      return;
    }

    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item !== trimmed);
      const updated = [trimmed, ...filtered].slice(0, MAX_RECENT_SEARCHES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

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
    isAutoSaveEnabled,
    toggleAutoSave,
    addSearch,
    clearSearches,
    removeSearch,
  };
}
