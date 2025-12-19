"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Thread } from "../../types";
import {
  searchThreads,
  ThreadSearchCursor,
} from "../repositories/threadSearchRepo";

interface UseThreadSearchResult {
  threads: Thread[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
}

export function useThreadSearch(
  queryText: string,
  pageSize: number = 20
): UseThreadSearchResult {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [cursor, setCursor] = useState<ThreadSearchCursor | null>(null);
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);
  const cursorRef = useRef<ThreadSearchCursor | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const normalizedQuery = useMemo(() => queryText.trim(), [queryText]);

  const runSearch = useCallback(
    async (reset: boolean) => {
      if (!normalizedQuery) {
        setThreads([]);
        setCursor(null);
        cursorRef.current = null;
        setHasMore(false);
        setError(null);
        return;
      }

      if (loadingRef.current) {
        return;
      }

      loadingRef.current = true;
      setLoading(true);
      setError(null);

      try {
        const result = await searchThreads(
          normalizedQuery,
          pageSize,
          reset ? null : cursorRef.current
        );
        setThreads((prev) =>
          reset ? result.threads : [...prev, ...result.threads]
        );
        setCursor(result.nextCursor);
        cursorRef.current = result.nextCursor;
        setHasMore(!!result.nextCursor);
      } catch (err) {
        console.error("Thread search failed:", err);
        setError("Failed to search threads. Please try again.");
      } finally {
        setLoading(false);
        loadingRef.current = false;
      }
    },
    [normalizedQuery, pageSize]
  );

  useEffect(() => {
    cursorRef.current = null;
    void runSearch(true);
  }, [runSearch, normalizedQuery]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) {
      return;
    }
    await runSearch(false);
  }, [hasMore, loading, runSearch]);

  return { threads, loading, error, hasMore, loadMore };
}
