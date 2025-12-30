"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  isBookmarked as checkIsBookmarked,
  toggleBookmark as toggleBookmarkRepo,
} from "../repositories/collectionsRepository";

interface UseBookmarkOptions {
  threadTitle: string;
  threadAuthorId: string;
}

interface UseBookmarkReturn {
  isBookmarked: boolean;
  isLoading: boolean;
  toggleBookmark: () => Promise<void>;
}

export function useBookmark(
  threadId: string,
  options: UseBookmarkOptions
): UseBookmarkReturn {
  const { user } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check initial bookmark status
  useEffect(() => {
    async function checkBookmark() {
      if (!user) {
        setIsBookmarked(false);
        setIsLoading(false);
        return;
      }

      try {
        const bookmarked = await checkIsBookmarked(user.uid, threadId);
        setIsBookmarked(bookmarked);
      } catch (error) {
        console.error("Error checking bookmark status:", error);
      } finally {
        setIsLoading(false);
      }
    }

    checkBookmark();
  }, [user, threadId]);

  const toggleBookmark = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const newStatus = await toggleBookmarkRepo(user.uid, {
        threadId,
        threadTitle: options.threadTitle,
        threadAuthorId: options.threadAuthorId,
      });
      setIsBookmarked(newStatus);
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user, threadId, options.threadTitle, options.threadAuthorId]);

  return {
    isBookmarked,
    isLoading,
    toggleBookmark,
  };
}
