"use client";

import { useState, useEffect, useCallback } from "react";
import { UserProfile } from "../types";
import { userProfileRepo } from "../repositories/userProfileRepo";

interface UseUserProfileResult {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useUserProfile(uid: string | null): UseUserProfileResult {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!uid) {
      setProfile(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await userProfileRepo.getUserProfile(uid);
      // Ensure we don't set state on unmounted component if we wanted to be ultra-safe,
      // but React mostly handles this with warnings now. 
      // A simple ref could be used if strict unmount safety is needed.
      setProfile(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load user profile");
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, loading, error, refresh: fetchProfile };
}
