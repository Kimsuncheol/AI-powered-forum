import React, { useState, useEffect, useRef, useCallback } from "react";
import { Container, Box, Typography, CircularProgress } from "@mui/material";
import ThreadItem from "../components/ThreadItem";

// Mock data generator
const generateThreads = (startId: number, count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: startId + i,
    author: {
      name: `User ${startId + i}`,
      avatar: `/static/images/avatar/${((startId + i) % 5) + 1}.jpg`,
    },
    content: `This is thread #${
      startId + i
    }. It contains some sample content to demonstrate the feed layout and infinite scroll functionality.`,
    initialLikes: Math.floor(Math.random() * 50),
    initialComments: Math.floor(Math.random() * 20),
  }));
};

const DashboardPage: React.FC = () => {
  const [threads, setThreads] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const loadMoreThreads = useCallback(() => {
    if (loading || !hasMore) return;

    setLoading(true);
    // Simulate network delay
    setTimeout(() => {
      const newThreads = generateThreads(threads.length + 1, 10);
      setThreads((prev) => [...prev, ...newThreads]);
      setLoading(false);
      if (threads.length > 50) {
        // Stop after 60 items for demo
        setHasMore(false);
      }
    }, 1000);
  }, [loading, hasMore, threads.length]);

  // Initial load
  useEffect(() => {
    loadMoreThreads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lastThreadElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreThreads();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadMoreThreads]
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
        align="left"
        sx={{ mb: 4 }}
      >
        Your Feed
      </Typography>

      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "left" }}
      >
        {threads.map((thread, index) => {
          if (threads.length === index + 1) {
            return (
              <div
                ref={lastThreadElementRef}
                key={thread.id}
                style={{ width: "100%" }}
              >
                <ThreadItem {...thread} />
              </div>
            );
          } else {
            return <ThreadItem key={thread.id} {...thread} />;
          }
        })}
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!hasMore && (
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ my: 4 }}
        >
          You've reached the end of the feed.
        </Typography>
      )}
    </Container>
  );
};

export default DashboardPage;
