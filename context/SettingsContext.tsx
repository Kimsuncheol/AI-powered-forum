"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { AiFeatureType } from "@/features/ai/types/AiQuota";

interface SettingsContextType {
  // General
  autoPlayEnabled: boolean;
  toggleAutoPlay: () => void;
  
  // Notifications & Privacy
  emailNotifications: boolean;
  pushNotifications: boolean;
  profileVisibility: 'public' | 'private';
  showOnlineStatus: boolean;
  toggleEmailNotifications: () => void;
  togglePushNotifications: () => void;
  setProfileVisibility: (visibility: 'public' | 'private') => void;
  toggleOnlineStatus: () => void;
  
  // Content Preferences
  defaultFeed: 'global' | 'following';
  nsfwFilterEnabled: boolean;
  compactView: boolean;
  commentsSortOrder: 'newest' | 'oldest';
  setDefaultFeed: (feed: 'global' | 'following') => void;
  toggleNsfwFilter: () => void;
  toggleCompactView: () => void;
  setCommentsSortOrder: (sort: 'newest' | 'oldest') => void;
  
  // AI Features
  aiAssistanceEnabled: boolean;
  defaultAiModel: AiFeatureType;
  toggleAiAssistance: () => void;
  setDefaultAiModel: (model: AiFeatureType) => void;
  
  // Search & History
  searchAutoSave: boolean;
  maxRecentSearches: 5 | 10 | 20 | 9999;
  toggleSearchAutoSave: () => void;
  setMaxRecentSearches: (max: 5 | 10 | 20 | 9999) => void;
  clearSearchHistory: () => void;
  
  // Localization
  language: string;
  timezone: string;
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY';
  setLanguage: (lang: string) => void;
  setTimezone: (tz: string) => void;
  setDateFormat: (format: 'MM/DD/YYYY' | 'DD/MM/YYYY') => void;
  
  // Accessibility
  reduceAnimations: boolean;
  toggleReduceAnimations: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const STORAGE_KEYS = {
  autoPlay: "settings_autoPlay",
  emailNotifications: "settings_emailNotifications",
  pushNotifications: "settings_pushNotifications",
  profileVisibility: "settings_profileVisibility",
  showOnlineStatus: "settings_showOnlineStatus",
  defaultFeed: "settings_defaultFeed",
  nsfwFilter: "settings_nsfwFilter",
  compactView: "settings_compactView",
  commentsSortOrder: "settings_commentsSortOrder",
  aiAssistance: "settings_aiAssistance",
  defaultAiModel: "settings_defaultAiModel",
  searchAutoSave: "settings_searchAutoSave",
  maxRecentSearches: "settings_maxRecentSearches",
  language: "settings_language",
  timezone: "settings_timezone",
  dateFormat: "settings_dateFormat",
  reduceAnimations: "settings_reduceAnimations",
} as const;

// Helper to safely get from localStorage with SSR support
function getStoredValue<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const stored = localStorage.getItem(key);
    return stored !== null ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

// Helper to set in localStorage
function setStoredValue<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  // Initialize all settings with stable defaults
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [profileVisibility, setProfileVisibilityState] = useState<'public' | 'private'>('public');
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [defaultFeed, setDefaultFeedState] = useState<'global' | 'following'>('global');
  const [nsfwFilterEnabled, setNsfwFilterEnabled] = useState(true);
  const [compactView, setCompactView] = useState(false);
  const [commentsSortOrder, setCommentsSortOrderState] = useState<'newest' | 'oldest'>('newest');
  const [aiAssistanceEnabled, setAiAssistanceEnabled] = useState(true);
  const [defaultAiModel, setDefaultAiModelState] = useState<AiFeatureType>('image');
  const [searchAutoSave, setSearchAutoSave] = useState(true);
  const [maxRecentSearches, setMaxRecentSearchesState] = useState<5 | 10 | 20 | 9999>(10);
  const [language, setLanguageState] = useState('en');
  const [timezone, setTimezoneState] = useState('UTC');
  const [dateFormat, setDateFormatState] = useState<'MM/DD/YYYY' | 'DD/MM/YYYY'>('MM/DD/YYYY');
  const [reduceAnimations, setReduceAnimations] = useState(false);

  // Load from localStorage after mount
  useEffect(() => {
    setAutoPlayEnabled(getStoredValue(STORAGE_KEYS.autoPlay, false));
    setEmailNotifications(getStoredValue(STORAGE_KEYS.emailNotifications, true));
    setPushNotifications(getStoredValue(STORAGE_KEYS.pushNotifications, false));
    setProfileVisibilityState(getStoredValue(STORAGE_KEYS.profileVisibility, 'public'));
    setShowOnlineStatus(getStoredValue(STORAGE_KEYS.showOnlineStatus, true));
    setDefaultFeedState(getStoredValue(STORAGE_KEYS.defaultFeed, 'global'));
    setNsfwFilterEnabled(getStoredValue(STORAGE_KEYS.nsfwFilter, true));
    setCompactView(getStoredValue(STORAGE_KEYS.compactView, false));
    setCommentsSortOrderState(getStoredValue(STORAGE_KEYS.commentsSortOrder, 'newest'));
    setAiAssistanceEnabled(getStoredValue(STORAGE_KEYS.aiAssistance, true));
    setDefaultAiModelState(getStoredValue(STORAGE_KEYS.defaultAiModel, 'image'));
    setSearchAutoSave(getStoredValue(STORAGE_KEYS.searchAutoSave, true));
    setMaxRecentSearchesState(getStoredValue(STORAGE_KEYS.maxRecentSearches, 10));
    setLanguageState(getStoredValue(STORAGE_KEYS.language, 'en'));
    setTimezoneState(getStoredValue(STORAGE_KEYS.timezone, 'UTC'));
    setDateFormatState(getStoredValue(STORAGE_KEYS.dateFormat, 'MM/DD/YYYY'));
    setReduceAnimations(getStoredValue(STORAGE_KEYS.reduceAnimations, false));
  }, []);

  // Toggle functions
  const toggleAutoPlay = () => {
    setAutoPlayEnabled(prev => {
      const newValue = !prev;
      setStoredValue(STORAGE_KEYS.autoPlay, newValue);
      return newValue;
    });
  };

  const toggleEmailNotifications = () => {
    setEmailNotifications(prev => {
      const newValue = !prev;
      setStoredValue(STORAGE_KEYS.emailNotifications, newValue);
      return newValue;
    });
  };

  const togglePushNotifications = () => {
    setPushNotifications(prev => {
      const newValue = !prev;
      setStoredValue(STORAGE_KEYS.pushNotifications, newValue);
      return newValue;
    });
  };

  const setProfileVisibility = (visibility: 'public' | 'private') => {
    setProfileVisibilityState(visibility);
    setStoredValue(STORAGE_KEYS.profileVisibility, visibility);
  };

  const toggleOnlineStatus = () => {
    setShowOnlineStatus(prev => {
      const newValue = !prev;
      setStoredValue(STORAGE_KEYS.showOnlineStatus, newValue);
      return newValue;
    });
  };

  const setDefaultFeed = (feed: 'global' | 'following') => {
    setDefaultFeedState(feed);
    setStoredValue(STORAGE_KEYS.defaultFeed, feed);
  };

  const toggleNsfwFilter = () => {
    setNsfwFilterEnabled(prev => {
      const newValue = !prev;
      setStoredValue(STORAGE_KEYS.nsfwFilter, newValue);
      return newValue;
    });
  };

  const toggleCompactView = () => {
    setCompactView(prev => {
      const newValue = !prev;
      setStoredValue(STORAGE_KEYS.compactView, newValue);
      return newValue;
    });
  };

  const setCommentsSortOrder = (sort: 'newest' | 'oldest') => {
    setCommentsSortOrderState(sort);
    setStoredValue(STORAGE_KEYS.commentsSortOrder, sort);
  };

  const toggleAiAssistance = () => {
    setAiAssistanceEnabled(prev => {
      const newValue = !prev;
      setStoredValue(STORAGE_KEYS.aiAssistance, newValue);
      return newValue;
    });
  };

  const setDefaultAiModel = (model: AiFeatureType) => {
    setDefaultAiModelState(model);
    setStoredValue(STORAGE_KEYS.defaultAiModel, model);
  };

  const toggleSearchAutoSave = () => {
    setSearchAutoSave(prev => {
      const newValue = !prev;
      setStoredValue(STORAGE_KEYS.searchAutoSave, newValue);
      // Also update the legacy key for backward compatibility
      if (typeof window !== 'undefined') {
        localStorage.setItem('search_auto_save', String(newValue));
      }
      return newValue;
    });
  };

  const setMaxRecentSearches = (max: 5 | 10 | 20 | 9999) => {
    setMaxRecentSearchesState(max);
    setStoredValue(STORAGE_KEYS.maxRecentSearches, max);
  };

  const clearSearchHistory = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('recent_searches');
    }
  };

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    setStoredValue(STORAGE_KEYS.language, lang);
  };

  const setTimezone = (tz: string) => {
    setTimezoneState(tz);
    setStoredValue(STORAGE_KEYS.timezone, tz);
  };

  const setDateFormat = (format: 'MM/DD/YYYY' | 'DD/MM/YYYY') => {
    setDateFormatState(format);
    setStoredValue(STORAGE_KEYS.dateFormat, format);
  };

  const toggleReduceAnimations = () => {
    setReduceAnimations(prev => {
      const newValue = !prev;
      setStoredValue(STORAGE_KEYS.reduceAnimations, newValue);
      return newValue;
    });
  };

  const value: SettingsContextType = {
    autoPlayEnabled,
    toggleAutoPlay,
    emailNotifications,
    pushNotifications,
    profileVisibility,
    showOnlineStatus,
    toggleEmailNotifications,
    togglePushNotifications,
    setProfileVisibility,
    toggleOnlineStatus,
    defaultFeed,
    nsfwFilterEnabled,
    compactView,
    commentsSortOrder,
    setDefaultFeed,
    toggleNsfwFilter,
    toggleCompactView,
    setCommentsSortOrder,
    aiAssistanceEnabled,
    defaultAiModel,
    toggleAiAssistance,
    setDefaultAiModel,
    searchAutoSave,
    maxRecentSearches,
    toggleSearchAutoSave,
    setMaxRecentSearches,
    clearSearchHistory,
    language,
    timezone,
    dateFormat,
    setLanguage,
    setTimezone,
    setDateFormat,
    reduceAnimations,
    toggleReduceAnimations,
  };

  return (
    <SettingsContext.Provider value={value}>
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
