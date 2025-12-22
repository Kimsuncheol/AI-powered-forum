"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import type { AiQuota, AiFeatureType } from "../types/AiQuota";
import {
  getUserQuota,
  incrementUsage,
  checkQuotaAvailable,
} from "../repositories/aiQuotaRepo";

interface QuotaStatus {
  available: boolean;
  remaining: number;
  limit: number;
}

export function useAiQuota(featureType: AiFeatureType) {
  const { user } = useAuth();
  const [quota, setQuota] = useState<AiQuota | null>(null);
  const [status, setStatus] = useState<QuotaStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch quota on mount and when user changes
  useEffect(() => {
    if (!user) {
      setQuota(null);
      setStatus(null);
      setLoading(false);
      return;
    }

    const fetchQuota = async () => {
      try {
        setLoading(true);
        setError(null);
        const userQuota = await getUserQuota(user.uid);
        setQuota(userQuota);
        
        const quotaStatus = await checkQuotaAvailable(user.uid, featureType);
        setStatus(quotaStatus);
      } catch (err) {
        console.error("Error fetching AI quota:", err);
        setError("Failed to fetch quota information");
      } finally {
        setLoading(false);
      }
    };

    fetchQuota();
  }, [user, featureType]);

  // Function to consume quota (call before generating AI content)
  const consumeQuota = useCallback(async (): Promise<boolean> => {
    if (!user) {
      setError("User not authenticated");
      return false;
    }

    try {
      // Check if quota is available
      const quotaStatus = await checkQuotaAvailable(user.uid, featureType);
      
      if (!quotaStatus.available) {
        setError(`You've reached your monthly limit for ${featureType} generation`);
        return false;
      }

      // Increment usage
      await incrementUsage(user.uid, featureType);
      
      // Refresh quota status
      const updatedQuota = await getUserQuota(user.uid);
      setQuota(updatedQuota);
      
      const updatedStatus = await checkQuotaAvailable(user.uid, featureType);
      setStatus(updatedStatus);
      
      return true;
    } catch (err) {
      console.error("Error consuming quota:", err);
      setError("Failed to update quota");
      return false;
    }
  }, [user, featureType]);

  // Refresh quota data
  const refreshQuota = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const userQuota = await getUserQuota(user.uid);
      setQuota(userQuota);
      
      const quotaStatus = await checkQuotaAvailable(user.uid, featureType);
      setStatus(quotaStatus);
      setError(null);
    } catch (err) {
      console.error("Error refreshing quota:", err);
      setError("Failed to refresh quota");
    } finally {
      setLoading(false);
    }
  }, [user, featureType]);

  return {
    quota,
    status,
    loading,
    error,
    consumeQuota,
    refreshQuota,
    hasQuota: status?.available ?? false,
    remaining: status?.remaining ?? 0,
    limit: status?.limit ?? 0,
  };
}
