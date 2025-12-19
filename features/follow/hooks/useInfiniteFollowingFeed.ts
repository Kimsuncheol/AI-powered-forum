"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { DocumentSnapshot } from "firebase/firestore";
import { Thread } from "@/features/thread/types";
import { getFollowingUids, fetchFollowingFeed } from "../repositories/feedRepo";

interface UseInfiniteFollowingFeedResult {
  threads: Thread[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  isEmpty: boolean;
  isFollowingTooLarge: boolean;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

const PAGE_SIZE = 10;
const MAX_FOLLOWING_SIZE = 30; // Firestore IN limit

/**
 * Hook for infinite scroll following feed.
 */
export function useInfiniteFollowingFeed(
  viewerUid: string | null | undefined
): UseInfiniteFollowingFeedResult {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isFollowingTooLarge, setIsFollowingTooLarge] = useState(false);
  
  const cursorRef = useRef<DocumentSnapshot | null>(null);
  const followingUidsRef = useRef<string[]>([]);

  // Initial load
  const loadInitial = useCallback(async () => {
    if (!viewerUid) {
      setLoading(false);
      setIsEmpty(true);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 1. Get following UIDs
      const uids = await getFollowingUids(viewerUid);
      followingUidsRef.current = uids;

      if (uids.length === 0) {
        setIsEmpty(true);
        setHasMore(false);
        setLoading(false);
        return;
      }

      if (uids.length > MAX_FOLLOWING_SIZE) {
        setIsFollowingTooLarge(true);
      }

      // 2. Fetch first page
      const page = await fetchFollowingFeed({
        followingUids: uids,
        cursor: null,
        pageSize: PAGE_SIZE,
      });

      setThreads(page.threads);
      cursorRef.current = page.lastDoc;
      setHasMore(page.hasMore);
      setIsEmpty(page.threads.length === 0);
    } catch (err) {
      console.error("Failed to load following feed:", err);
      setError("Failed to load feed");
    } finally {
      setLoading(false);
    }
  }, [viewerUid]);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  // Load more (infinite scroll)
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || followingUidsRef.current.length === 0) {
      return;
    }

    try {
      setLoadingMore(true);

      const page = await fetchFollowingFeed({
        followingUids: followingUidsRef.current,
        cursor: cursorRef.current,
        pageSize: PAGE_SIZE,
      });

      setThreads((prev) => [...prev, ...page.threads]);
      cursorRef.current = page.lastDoc;
      setHasMore(page.hasMore);
    } catch (err) {
      console.error("Failed to load more:", err);
      setError("Failed to load more");
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore]);

  // Refresh
  const refresh = useCallback(async () => {
    cursorRef.current = null;
    setThreads([]);
    await loadInitial();
  }, [loadInitial]);

  return {
    threads,
    loading,
    loadingMore,
    error,
    hasMore,
    isEmpty,
    isFollowingTooLarge,
    loadMore,
    refresh,
  };
}
