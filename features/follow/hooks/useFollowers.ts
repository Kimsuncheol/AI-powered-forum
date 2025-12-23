"use client";

import { useState, useEffect } from "react";
import { UserProfile } from "@/features/profile/types";
import { followService } from "../services/follow.service";

export function useFollowers(userId: string | undefined) {
  const [followers, setFollowers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchFollowers = async () => {
      try {
        setLoading(true);
        const data = await followService.getFollowersUsers(userId);
        setFollowers(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load followers.");
      } finally {
        setLoading(false);
      }
    };

    fetchFollowers();
  }, [userId]);

  return { followers, loading, error };
}
