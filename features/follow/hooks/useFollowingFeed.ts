"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { getFollowing } from "../repositories/followRepo";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  startAfter,
  DocumentSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Thread } from "@/features/thread/types";
import { Timestamp } from "firebase/firestore";

interface UseFollowingFeedResult {
  threads: Thread[];
  loading: boolean;
  error: Error | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

const PAGE_SIZE = 20;

/**
 * Hook to fetch threads from users the current user follows.
 */
export function useFollowingFeed(): UseFollowingFeedResult {
  const { user } = useAuth();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<DocumentSnapshot | null>(null);
  const [followingIds, setFollowingIds] = useState<string[]>([]);

  // Fetch following list first
  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    const fetchFollowing = async () => {
      try {
        const ids = await getFollowing(user.uid, 30);
        setFollowingIds(ids);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch following"));
      }
    };

    fetchFollowing();
  }, [user?.uid]);

  // Fetch threads when following list is ready
  const fetchThreads = useCallback(async (isRefresh: boolean = false) => {
    if (followingIds.length === 0) {
      setThreads([]);
      setLoading(false);
      setHasMore(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Firestore IN queries limited to 30 values - already limited in getFollowing
      let q = query(
        collection(db, "threads"),
        where("authorId", "in", followingIds),
        orderBy("createdAt", "desc"),
        limit(PAGE_SIZE)
      );

      if (!isRefresh && cursor) {
        q = query(q, startAfter(cursor));
      }

      const snap = await getDocs(q);
      
      const newThreads: Thread[] = snap.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || "",
          body: data.body || "",
          authorId: data.authorId || "",
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt : Timestamp.now(),
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt : Timestamp.now(),
          tagIds: Array.isArray(data.tagIds) ? data.tagIds : [],
          categoryId: data.categoryId || "",
          type: data.type || "text",
          likes: data.likes || 0,
          commentsCount: data.commentsCount || 0,
          likesCount: data.likesCount || 0,
        };
      });

      if (isRefresh) {
        setThreads(newThreads);
      } else {
        setThreads((prev) => [...prev, ...newThreads]);
      }

      setHasMore(snap.docs.length === PAGE_SIZE);
      setCursor(snap.docs.length > 0 ? snap.docs[snap.docs.length - 1] : null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch feed"));
    } finally {
      setLoading(false);
    }
  }, [followingIds, cursor]);

  // Initial fetch when following IDs are ready
  useEffect(() => {
    if (followingIds.length > 0) {
      fetchThreads(true);
    } else if (user?.uid) {
      // User has no following
      setLoading(false);
      setHasMore(false);
    }
  }, [followingIds]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadMore = useCallback(async () => {
    if (!loading && hasMore) {
      await fetchThreads(false);
    }
  }, [loading, hasMore, fetchThreads]);

  const refresh = useCallback(async () => {
    setCursor(null);
    await fetchThreads(true);
  }, [fetchThreads]);

  return {
    threads,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
  };
}
