import { useState, useEffect } from "react";
import { threadService, Thread } from "../api/thread.service";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";

export function useThreadFeed() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [sortBy, setSortBy] = useState<"latest" | "popular">("latest");
  const [hasMore, setHasMore] = useState(true);

  const fetchThreads = async (reset = false) => {
    try {
      const currentLastDoc = reset ? undefined : lastDoc || undefined;
      
      // Prevent fetching if we are not resetting and have no more data or already loading
      if (!reset && (!hasMore || loadingMore)) return;

      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      const { threads: newThreads, lastDoc: newLastDoc } = await threadService.getThreads(
        currentLastDoc,
        sortBy
      );

      if (reset) {
        setThreads(newThreads);
      } else {
        setThreads((prev) => [...prev, ...newThreads]);
      }

      setLastDoc(newLastDoc);
      setHasMore(newThreads.length > 0);
    } catch (err) {
      console.error("Error fetching threads:", err);
      setError("Failed to load threads.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Initial fetch when sort changes
  useEffect(() => {
    fetchThreads(true);
  }, [sortBy]);

  const seedData = async () => {
    setLoading(true);
    await threadService.seedData();
    await fetchThreads(true);
  };

  return {
    threads,
    loading,
    loadingMore,
    error,
    hasMore,
    sortBy,
    setSortBy,
    loadMore: () => fetchThreads(false),
    seedData,
    refresh: () => fetchThreads(true),
  };
}
