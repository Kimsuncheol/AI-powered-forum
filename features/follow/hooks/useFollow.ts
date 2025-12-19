"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  followUser,
  unfollowUser,
  isFollowing as checkIsFollowing,
} from "../repositories/followRepo";

interface UseFollowResult {
  isFollowing: boolean;
  loading: boolean;
  error: Error | null;
  follow: () => Promise<void>;
  unfollow: () => Promise<void>;
  toggleFollow: () => Promise<void>;
}

/**
 * Hook to manage follow state for a specific user.
 */
export function useFollow(targetUserId: string | undefined): UseFollowResult {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Check initial follow state
  useEffect(() => {
    if (!user?.uid || !targetUserId || user.uid === targetUserId) {
      setLoading(false);
      setIsFollowing(false);
      return;
    }

    const checkFollow = async () => {
      try {
        setLoading(true);
        const following = await checkIsFollowing(user.uid, targetUserId);
        setIsFollowing(following);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to check follow status"));
      } finally {
        setLoading(false);
      }
    };

    checkFollow();
  }, [user?.uid, targetUserId]);

  const follow = useCallback(async () => {
    if (!user?.uid || !targetUserId) return;
    
    try {
      setLoading(true);
      setError(null);
      await followUser(user.uid, targetUserId);
      setIsFollowing(true);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to follow"));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user?.uid, targetUserId]);

  const unfollow = useCallback(async () => {
    if (!user?.uid || !targetUserId) return;
    
    try {
      setLoading(true);
      setError(null);
      await unfollowUser(user.uid, targetUserId);
      setIsFollowing(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to unfollow"));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user?.uid, targetUserId]);

  const toggleFollow = useCallback(async () => {
    if (isFollowing) {
      await unfollow();
    } else {
      await follow();
    }
  }, [isFollowing, follow, unfollow]);

  return {
    isFollowing,
    loading,
    error,
    follow,
    unfollow,
    toggleFollow,
  };
}
