"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  sendFollowRequest,
  cancelFollowRequest,
  getRequestStatus,
  isFollowing,
  unfollow as unfollowRepo,
} from "../repositories/followRequestRepo";
import { RepoResult } from "../types";

// --- Relationship State ---
export type RelationshipStatus =
  | "SELF"
  | "NOT_FOLLOWING"
  | "REQUESTED"
  | "FOLLOWING"
  | "LOADING";

interface UseFollowRelationshipResult {
  status: RelationshipStatus;
  loading: boolean;
  error: string | null;
  // Actions
  requestFollow: () => Promise<RepoResult<string>>;
  cancelRequest: () => Promise<RepoResult>;
  unfollow: () => Promise<RepoResult>;
}

/**
 * Hook to manage follow relationship between viewer and target user.
 * 
 * @param viewerUid - The current user's UID (null if not authenticated)
 * @param targetUid - The target user's UID
 * @returns Relationship status and actions
 * 
 * @example
 * const { status, requestFollow, cancelRequest, unfollow } = useFollowRelationship(user?.uid, profileUser.uid);
 * 
 * // In render:
 * {status === "NOT_FOLLOWING" && <Button onClick={requestFollow}>Follow</Button>}
 * {status === "REQUESTED" && <Button onClick={cancelRequest}>Cancel Request</Button>}
 * {status === "FOLLOWING" && <Button onClick={unfollow}>Unfollow</Button>}
 */
export function useFollowRelationship(
  viewerUid: string | null | undefined,
  targetUid: string | undefined
): UseFollowRelationshipResult {
  const [status, setStatus] = useState<RelationshipStatus>("LOADING");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Derived: is this the user viewing their own profile?
  const isSelf = useMemo(() => {
    return Boolean(viewerUid && targetUid && viewerUid === targetUid);
  }, [viewerUid, targetUid]);

  // Check relationship status on mount and when users change
  useEffect(() => {
    // No viewer = not authenticated, treat as NOT_FOLLOWING (button hidden anyway)
    if (!viewerUid || !targetUid) {
      setStatus("NOT_FOLLOWING");
      setLoading(false);
      return;
    }

    // Self check
    if (isSelf) {
      setStatus("SELF");
      setLoading(false);
      return;
    }

    const checkRelationship = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Check if already following (most common case for existing relationships)
        const following = await isFollowing(viewerUid, targetUid);
        if (following) {
          setStatus("FOLLOWING");
          return;
        }

        // 2. Check for pending request
        const reqStatus = await getRequestStatus(viewerUid, targetUid);
        if (reqStatus === "PENDING") {
          setStatus("REQUESTED");
          return;
        }

        // 3. No relationship
        setStatus("NOT_FOLLOWING");
      } catch (err) {
        console.error("Failed to check relationship:", err);
        setError("Failed to load relationship status");
        setStatus("NOT_FOLLOWING"); // Fallback
      } finally {
        setLoading(false);
      }
    };

    checkRelationship();
  }, [viewerUid, targetUid, isSelf]);

  // --- Actions ---

  const requestFollow = useCallback(async (): Promise<RepoResult<string>> => {
    if (!viewerUid || !targetUid) {
      return { success: false, errorMessage: "Not authenticated" };
    }

    try {
      setLoading(true);
      setError(null);
      const result = await sendFollowRequest(viewerUid, targetUid);
      
      if (result.success) {
        setStatus("REQUESTED");
      } else {
        setError(result.errorMessage || "Failed to send request");
      }
      
      return result;
    } finally {
      setLoading(false);
    }
  }, [viewerUid, targetUid]);

  const cancelRequest = useCallback(async (): Promise<RepoResult> => {
    if (!viewerUid || !targetUid) {
      return { success: false, errorMessage: "Not authenticated" };
    }

    try {
      setLoading(true);
      setError(null);
      const result = await cancelFollowRequest(viewerUid, targetUid);
      
      if (result.success) {
        setStatus("NOT_FOLLOWING");
      } else {
        setError(result.errorMessage || "Failed to cancel request");
      }
      
      return result;
    } finally {
      setLoading(false);
    }
  }, [viewerUid, targetUid]);

  const unfollow = useCallback(async (): Promise<RepoResult> => {
    if (!viewerUid || !targetUid) {
      return { success: false, errorMessage: "Not authenticated" };
    }

    try {
      setLoading(true);
      setError(null);
      const result = await unfollowRepo(viewerUid, targetUid);
      
      if (result.success) {
        setStatus("NOT_FOLLOWING");
      } else {
        setError(result.errorMessage || "Failed to unfollow");
      }
      
      return result;
    } finally {
      setLoading(false);
    }
  }, [viewerUid, targetUid]);

  return {
    status,
    loading,
    error,
    requestFollow,
    cancelRequest,
    unfollow,
  };
}
