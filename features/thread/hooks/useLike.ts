import { useState, useEffect } from "react";
import { toggleLike as toggleLikeRepo, getUserLike } from "../repositories/likeRepo";
import { useAuth } from "@/context/AuthContext";

interface UseLikeResult {
  isLiked: boolean;
  likeCount: number;
  loading: boolean;
  toggleLike: () => Promise<void>;
}

export function useLike(threadId: string, initialLikeCount: number = 0): UseLikeResult {
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
