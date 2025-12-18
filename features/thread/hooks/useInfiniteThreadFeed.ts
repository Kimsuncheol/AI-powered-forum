import { useState, useRef, useEffect, useCallback } from "react";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { getThreadFeed } from "../api/threadFeedRepo";
import { Thread } from "../types";

interface UseInfiniteThreadFeedResult {
  threads: Thread[];
  loadingInitial: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  loadInitial: (pageSize?: number) => Promise<void>;
  loadMore: (pageSize?: number) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useInfiniteThreadFeed(): UseInfiniteThreadFeedResult {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  
  // Internal state for cursor
  const lastDocRef = useRef<QueryDocumentSnapshot<DocumentData> | null>(null);
  
  // Prevention of race conditions & duplicate calls
  const loadingRef = useRef(false);
  
  // Safe unmount handling
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const loadInitial = useCallback(async (pageSize = 20) => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    setLoadingInitial(true);
    setError(null);
    setHasMore(true); // Reset hasMore on initial load attempt
    lastDocRef.current = null; // Reset cursor

    try {
      const result = await getThreadFeed({ pageSize, cursor: null });
      
      if (isMountedRef.current) {
        setThreads(result.threads);
        lastDocRef.current = result.nextCursor;
        setHasMore(result.hasMore);
      }
    } catch (err) {
      if (isMountedRef.current) {
        console.error("Failed to load initial threads", err);
        setError("Failed to load feed.");
      }
    } finally {
      if (isMountedRef.current) {
        setLoadingInitial(false);
      }
      loadingRef.current = false;
    }
  }, []);

  const loadMore = useCallback(async (pageSize = 20) => {
    // Basic guards
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;

    setLoadingMore(true);
    setError(null);

    try {
      const result = await getThreadFeed({ 
        pageSize, 
        cursor: lastDocRef.current 
      });
      
      if (isMountedRef.current) {
        setThreads((prev) => [...prev, ...result.threads]);
        lastDocRef.current = result.nextCursor;
        setHasMore(result.hasMore);
      }
    } catch (err) {
      if (isMountedRef.current) {
        console.error("Failed to load more threads", err);
        setError("Failed to load more threads.");
      }
    } finally {
      if (isMountedRef.current) {
        setLoadingMore(false);
      }
      loadingRef.current = false;
    }
  }, [hasMore]);

  const refresh = useCallback(() => {
    return loadInitial();
  }, [loadInitial]);

  return {
    threads,
    loadingInitial,
    loadingMore,
    error,
    hasMore,
    loadInitial,
    loadMore,
    refresh,
  };
}
