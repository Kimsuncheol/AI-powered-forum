import { useState, useEffect } from "react";
import { toggleLike as toggleLikeRepo, getUserLike } from "../repositories/likeRepo";
import { useAuth } from "@/context/AuthContext";
import { notifyLike } from "@/lib/notifications/notificationService";

interface UseLikeOptions {
  threadAuthorId?: string;
  threadTitle?: string;
}

interface UseLikeResult {
  isLiked: boolean;
  likeCount: number;
  loading: boolean;
  toggleLike: () => Promise<void>;
}

export function useLike(
  threadId: string,
  initialLikeCount: number = 0,
  options?: UseLikeOptions
): UseLikeResult {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsLiked(false);
      return;
    }

    // Check if user has already liked this thread
    getUserLike(threadId, user.uid).then((liked) => {
      setIsLiked(liked);
    });
  }, [threadId, user]);

  const toggleLike = async () => {
    if (!user) {
      // TODO: Could show login prompt
      return;
    }

    setLoading(true);

    // Optimistic update
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikeCount((prev) => (newIsLiked ? prev + 1 : prev - 1));

    try {
      await toggleLikeRepo(threadId, user.uid);

      // Send email notification if liking (not unliking) and author info is available
      if (newIsLiked && options?.threadAuthorId && options?.threadTitle) {
        // Don't notify if user likes their own thread
        if (options.threadAuthorId !== user.uid) {
          // Fire and forget - don't block on email
          notifyLike(
            options.threadAuthorId,
            user.displayName || "Someone",
            options.threadTitle
          ).catch(console.error);
        }
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
      // Revert optimistic update on error
      setIsLiked(!newIsLiked);
      setLikeCount((prev) => (newIsLiked ? prev - 1 : prev + 1));
    } finally {
      setLoading(false);
    }
  };

  return {
    isLiked,
    likeCount,
    loading,
    toggleLike,
  };
}

