"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { DocumentSnapshot } from "firebase/firestore";
import { UserProfile } from "@/features/profile/types";
import { followService } from "../services/follow.service";
import { findChatRoom } from "@/features/chat/repositories/chatRepository";

export interface UserProfileWithChat extends UserProfile {
  chatRoomId: string | null;
}

interface UseInfiniteFollowingUsersForChatListResult {
  users: UserProfileWithChat[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
}

const PAGE_SIZE = 15;

export function useInfiniteFollowingUsersForChatList(
  userId: string | undefined
): UseInfiniteFollowingUsersForChatListResult {
  const [users, setUsers] = useState<UserProfileWithChat[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const lastDocRef = useRef<DocumentSnapshot | null>(null);

  // Enrich users with chat room info
  const enrichWithChatInfo = useCallback(
    async (profiles: UserProfile[]): Promise<UserProfileWithChat[]> => {
      if (!userId) return profiles.map((p) => ({ ...p, chatRoomId: null }));

      const enriched = await Promise.all(
        profiles.map(async (profile) => {
          try {
            const roomId = await findChatRoom(userId, profile.uid);
            return { ...profile, chatRoomId: roomId };
          } catch {
            return { ...profile, chatRoomId: null };
          }
        })
      );
      return enriched;
    },
    [userId]
  );

  // Initial load
  const loadInitial = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { users: initialUsers, lastDoc } =
        await followService.getFollowingUsersPaginated(userId, PAGE_SIZE, null);
      const enrichedUsers = await enrichWithChatInfo(initialUsers);
      setUsers(enrichedUsers);
      lastDocRef.current = lastDoc;
      setHasMore(!!lastDoc);
    } catch (err) {
      console.error("Failed to load following users:", err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [userId, enrichWithChatInfo]);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  // Load more
  const loadMore = useCallback(async () => {
    if (!userId || loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const { users: newUsers, lastDoc } =
        await followService.getFollowingUsersPaginated(
          userId,
          PAGE_SIZE,
          lastDocRef.current
        );

      const enrichedUsers = await enrichWithChatInfo(newUsers);
      setUsers((prev) => [...prev, ...enrichedUsers]);
      lastDocRef.current = lastDoc;
      setHasMore(!!lastDoc);
    } catch (err) {
      console.error("Failed to load more users:", err);
    } finally {
      setLoadingMore(false);
    }
  }, [userId, loadingMore, hasMore, enrichWithChatInfo]);

  return {
    users,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
  };
}
