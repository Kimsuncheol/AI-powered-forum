"use client";

import { useState, useCallback } from "react";
import { Thread } from "@/features/thread/types";
import { UserProfile, SearchTab } from "../types";
import { searchThreads, searchUsers } from "../repositories/searchRepo";

interface UseSearchResult {
  threads: Thread[];
  users: UserProfile[];
  loading: boolean;
  error: string | null;
  search: (keyword: string, tab: SearchTab) => Promise<void>;
}

export function useSearch(): UseSearchResult {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (keyword: string, tab: SearchTab) => {
    if (!keyword.trim()) {
      setThreads([]);
      setUsers([]);
      setError(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (tab === "threads") {
        const results = await searchThreads(keyword);
        setThreads(results);
      } else {
        const results = await searchUsers(keyword);
        setUsers(results);
      }
    } catch (err) {
      console.error("Search failed:", err);
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    threads,
    users,
    loading,
    error,
    search,
  };
}
