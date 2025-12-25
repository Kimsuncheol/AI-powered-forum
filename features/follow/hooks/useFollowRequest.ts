"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  sendFollowRequest,
  cancelFollowRequest,
  getRequestStatus,
  isFollowing,
} from "../repositories/followRequestRepo";
import { RequestStatus, RepoResult } from "../types";

type CombinedStatus = RequestStatus | "FOLLOWING" | "NONE";

interface UseFollowRequestResult {
  status: CombinedStatus;
  loading: boolean;
  error: string | null;
  sendRequest: () => Promise<RepoResult<string>>;
  cancelRequest: () => Promise<RepoResult>;
}

export function useFollowRequest(targetUserId: string | undefined): UseFollowRequestResult {
  const { user } = useAuth();
  const [status, setStatus] = useState<CombinedStatus>("NONE");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid || !targetUserId || user.uid === targetUserId) {
      setLoading(false);
      setStatus("NONE");
      return;
    }

    const checkStatus = async () => {
      try {
        setLoading(true);
        // Check if already following
        const following = await isFollowing(user.uid, targetUserId);
        if (following) {
          setStatus("FOLLOWING");
          return;
        }

        // Check request status
        const reqStatus = await getRequestStatus(user.uid, targetUserId);
        if (reqStatus === "PENDING") {
          setStatus("PENDING");
        } else {
          setStatus("NONE");
        }
      } catch (err) {
        setError("Failed to check status");
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, [user?.uid, targetUserId]);

  const sendRequest = useCallback(async (): Promise<RepoResult<string>> => {
    if (!user?.uid || !targetUserId) {
      return { success: false, errorMessage: "Not authenticated" };
    }
    try {
      setLoading(true);
      setError(null);
      const result = await sendFollowRequest(user.uid, targetUserId);
      if (result.success) {
        setStatus("PENDING");
        // Send email notification to target user (fire and forget)
        import("@/lib/notifications/notificationService").then(({ notifyFollowRequest }) => {
          notifyFollowRequest(targetUserId, user.displayName || "Someone").catch(console.error);
        });
      } else {
        setError(result.errorMessage || "Failed to send request");
      }
      return result;
    } finally {
      setLoading(false);
    }
  }, [user?.uid, user?.displayName, targetUserId]);

  const cancelRequest = useCallback(async (): Promise<RepoResult> => {
    if (!user?.uid || !targetUserId) {
      return { success: false, errorMessage: "Not authenticated" };
    }
    try {
      setLoading(true);
      setError(null);
      const result = await cancelFollowRequest(user.uid, targetUserId);
      if (result.success) {
        setStatus("NONE");
      } else {
        setError(result.errorMessage || "Failed to cancel request");
      }
      return result;
    } finally {
      setLoading(false);
    }
  }, [user?.uid, targetUserId]);

  return { status, loading, error, sendRequest, cancelRequest };
}
