"use client";

import { useState, useEffect } from "react";
import { UserProfile } from "@/features/profile/types";
import { followService } from "../services/follow.service";

export function useFollowing(userId: string | undefined) {
  const [following, setFollowing] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchFollowing = async () => {
      try {
        setLoading(true);
        const data = await followService.getFollowingUsers(userId);
        setFollowing(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load following.");
      } finally {
        setLoading(false);
      }
    };

    fetchFollowing();
  }, [userId]);

  return { following, loading, error };
}
