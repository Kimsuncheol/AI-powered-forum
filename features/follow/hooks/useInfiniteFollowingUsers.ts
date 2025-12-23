"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { DocumentSnapshot } from "firebase/firestore";
import { UserProfile } from "@/features/profile/types";
import { followService } from "../services/follow.service";

interface UseInfiniteFollowingUsersResult {
  users: UserProfile[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
}

const PAGE_SIZE = 15;

export function useInfiniteFollowingUsers(
  userId: string | undefined
): UseInfiniteFollowingUsersResult {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const lastDocRef = useRef<DocumentSnapshot | null>(null);

  // Initial load
  const loadInitial = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { users: initialUsers, lastDoc } = await followService.getFollowingUsersPaginated(
        userId,
        PAGE_SIZE,
        null
      );
      setUsers(initialUsers);
      lastDocRef.current = lastDoc;
      setHasMore(!!lastDoc);
    } catch (err) {
      console.error("Failed to load following users:", err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  // Load more
  const loadMore = useCallback(async () => {
    if (!userId || loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const { users: newUsers, lastDoc } = await followService.getFollowingUsersPaginated(
        userId,
        PAGE_SIZE,
        lastDocRef.current
      );

      setUsers((prev) => [...prev, ...newUsers]);
      lastDocRef.current = lastDoc;
      setHasMore(!!lastDoc);
    } catch (err) {
      console.error("Failed to load more users:", err);
      // Optional: don't set error state to avoid full UI error, just log
    } finally {
      setLoadingMore(false);
    }
  }, [userId, loadingMore, hasMore]);

  return {
    users,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
  };
}
