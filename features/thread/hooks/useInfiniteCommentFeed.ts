"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { getCommentFeed } from "../api/commentRepo";
import { Comment } from "../types";

interface UseInfiniteCommentFeedOptions {
  filters?: {
    authorId?: string;
    threadId?: string;
  };
}

interface UseInfiniteCommentFeedResult {
  comments: Comment[];
  loadingInitial: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  loadInitial: (pageSize?: number) => Promise<void>;
  loadMore: (pageSize?: number) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useInfiniteCommentFeed(options: UseInfiniteCommentFeedOptions = {}): UseInfiniteCommentFeedResult {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  
  const lastDocRef = useRef<QueryDocumentSnapshot<DocumentData> | null>(null);
  const loadingRef = useRef(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const loadInitial = useCallback(async (pageSize = 20) => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    setLoadingInitial(true);
    setError(null);
    setHasMore(true);
    lastDocRef.current = null;

    try {
      const result = await getCommentFeed({ 
        pageSize, 
        cursor: null,
        filters: options.filters 
      });
      
      if (isMountedRef.current) {
        setComments(result.comments);
        lastDocRef.current = result.nextCursor;
        setHasMore(result.hasMore);
      }
    } catch (err) {
      if (isMountedRef.current) {
        console.error("Failed to load initial comments", err);
        setError("Failed to load comments.");
      }
    } finally {
      if (isMountedRef.current) {
        setLoadingInitial(false);
      }
      loadingRef.current = false;
    }
  }, [options.filters]);

  const loadMore = useCallback(async (pageSize = 20) => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;

    setLoadingMore(true);
    setError(null);

    try {
      const result = await getCommentFeed({ 
        pageSize, 
        cursor: lastDocRef.current,
        filters: options.filters
      });
      
      if (isMountedRef.current) {
        setComments((prev) => [...prev, ...result.comments]);
        lastDocRef.current = result.nextCursor;
        setHasMore(result.hasMore);
      }
    } catch (err) {
      if (isMountedRef.current) {
        console.error("Failed to load more comments", err);
        setError("Failed to load more comments.");
      }
    } finally {
      if (isMountedRef.current) {
        setLoadingMore(false);
      }
      loadingRef.current = false;
    }
  }, [hasMore, options.filters]);

  const refresh = useCallback(() => {
    return loadInitial();
  }, [loadInitial]);

  return {
    comments,
    loadingInitial,
    loadingMore,
    error,
    hasMore,
    loadInitial,
    loadMore,
    refresh,
  };
}
