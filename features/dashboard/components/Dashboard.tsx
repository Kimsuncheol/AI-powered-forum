"use client";

import { Typography, Box, Paper } from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import ThreadFeed from "./ThreadFeed";
import { useInfiniteThreadFeed } from "@/features/thread/hooks/useInfiniteThreadFeed";

export default function Dashboard() {
  const { user } = useAuth();
  const { 
    threads, 
    loadingInitial, 
    loadingMore, 
    error, 
    hasMore, 
    loadInitial,
    loadMore,
  } = useInfiniteThreadFeed();

  // Load initial threads on mount
  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  return (
    <Box sx={{ maxWidth: 800, mx: "auto" }}>
      {/* Welcome Header */}
      <Paper 
        sx={{ 
          p: 2, 
          mb: 2, 
          bgcolor: "background.paper",
          borderRadius: 1,
        }}
      >
        <Typography 
          variant="h5" 
          component="h1" 
          sx={{ fontWeight: 600, fontSize: "1.375rem", mb: 0.5 }}
        >
          Welcome to the Forum
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.875rem" }}>
          {user ? `Hello, ${user.email}!` : "Please log in to create posts and interact with the community."}
        </Typography>
      </Paper>

      {/* Thread Feed */}
      <ThreadFeed 
        threads={threads}
        loading={loadingInitial}
        loadingMore={loadingMore}
        error={error}
        hasMore={hasMore}
        onLoadMore={loadMore}
      />
    </Box>
  );
}
