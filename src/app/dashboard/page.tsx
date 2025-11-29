import React, { useState, useEffect, useRef, useCallback } from "react";
import { Container, Box, CircularProgress, Typography } from "@mui/material";
import ThreadItem, { ThreadData } from "../../components/ThreadItem";

const MOCK_THREADS: ThreadData[] = Array.from({ length: 10 }).map((_, i) => ({
  id: `thread-${i}`,
  author: `User ${i + 1}`,
  content: `This is thread number ${
    i + 1
  }. It has some interesting content to read.`,
  likes: Math.floor(Math.random() * 50),
  commentCount: Math.floor(Math.random() * 10),
  timestamp: `${Math.floor(Math.random() * 24)}h ago`,
}));

const DashboardPage = () => {
  const [threads, setThreads] = useState<ThreadData[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const observerTarget = useRef(null);

  const fetchThreads = useCallback(async (pageNum: number) => {
    setLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newThreads = MOCK_THREADS.map((t) => ({
      ...t,
      id: `${t.id}-page-${pageNum}`,
      author: `${t.author} (Page ${pageNum})`,
    }));

    setThreads((prev) => [...prev, ...newThreads]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchThreads(1);
  }, [fetchThreads]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [loading]);

  useEffect(() => {
    if (page > 1) {
      fetchThreads(page);
    }
  }, [page, fetchThreads]);

  return (
    <Container maxWidth="md" sx={{ mt: 4, pb: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Feed
      </Typography>

      <Box>
        {threads.map((thread) => (
          <ThreadItem key={thread.id} thread={thread} />
        ))}
      </Box>

      <Box
        ref={observerTarget}
        sx={{ display: "flex", justifyContent: "center", p: 3 }}
      >
        {loading && <CircularProgress />}
      </Box>
    </Container>
  );
};

export default DashboardPage;
