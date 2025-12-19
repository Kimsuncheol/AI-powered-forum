"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { UserProfile } from "../../types";
import { searchUsers, UserSearchCursor } from "../repositories/userSearchRepo";

interface UseUserSearchResult {
  users: UserProfile[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
}

export function useUserSearch(
  queryText: string,
  pageSize: number = 20
): UseUserSearchResult {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [cursor, setCursor] = useState<UserSearchCursor | null>(null);
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);
  const cursorRef = useRef<UserSearchCursor | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const normalizedQuery = useMemo(() => queryText.trim(), [queryText]);

  const runSearch = useCallback(
    async (reset: boolean) => {
      if (!normalizedQuery) {
        setUsers([]);
        setCursor(null);
        cursorRef.current = null;
        setHasMore(false);
        setError(null);
        return;
      }

      if (loadingRef.current) {
        return;
      }

      loadingRef.current = true;
      setLoading(true);
      setError(null);

      try {
        const result = await searchUsers(
          normalizedQuery,
          pageSize,
          reset ? null : cursorRef.current
        );
        setUsers((prev) => (reset ? result.users : [...prev, ...result.users]));
        setCursor(result.nextCursor);
        cursorRef.current = result.nextCursor;
        setHasMore(!!result.nextCursor);
      } catch (err) {
        console.error("User search failed:", err);
        setError("Failed to search users. Please try again.");
      } finally {
        setLoading(false);
        loadingRef.current = false;
      }
    },
    [normalizedQuery, pageSize]
  );

  useEffect(() => {
    cursorRef.current = null;
    void runSearch(true);
  }, [runSearch, normalizedQuery]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loadingRef.current) {
      return;
    }
    await runSearch(false);
  }, [hasMore, runSearch]);

  return { users, loading, error, hasMore, loadMore };
}
