"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUnreadInboxItems } from "../repositories/inboxRepo";
import {
  acceptFollowRequest,
  declineFollowRequest,
} from "@/features/follow/repositories/followRequestRepo";
import { InboxItem } from "../types";
import { RepoResult } from "@/features/follow/types";

interface UseInboxResult {
  items: InboxItem[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  accept: (item: InboxItem) => Promise<RepoResult>;
  decline: (item: InboxItem) => Promise<RepoResult>;
}

export function useInbox(): UseInboxResult {
  const { user } = useAuth();
  const [items, setItems] = useState<InboxItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    if (!user?.uid) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getUnreadInboxItems(user.uid);
      setItems(data);
    } catch (err) {
      setError("Failed to fetch inbox");
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const accept = useCallback(async (item: InboxItem): Promise<RepoResult> => {
    if (!user?.uid) return { success: false, errorMessage: "Not authenticated" };

    // Optimistic update
    setItems((prev) => prev.filter((i) => i.id !== item.id));

    const result = await acceptFollowRequest(item.referenceId, user.uid);
    if (!result.success) {
      // Revert on error
      await fetchItems();
    }
    return result;
  }, [user?.uid, fetchItems]);

  const decline = useCallback(async (item: InboxItem): Promise<RepoResult> => {
    if (!user?.uid) return { success: false, errorMessage: "Not authenticated" };

    setItems((prev) => prev.filter((i) => i.id !== item.id));

    const result = await declineFollowRequest(item.referenceId, user.uid);
    if (!result.success) {
      await fetchItems();
    }
    return result;
  }, [user?.uid, fetchItems]);

  return { items, loading, error, refresh: fetchItems, accept, decline };
}
