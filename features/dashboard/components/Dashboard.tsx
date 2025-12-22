"use client";

import { Typography, Box, Paper } from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import ThreadFeed from "./ThreadFeed";
import { useThreadFeed } from "../hooks/useThreadFeed";

export default function Dashboard() {
  const { user } = useAuth();
  const { 
    threads, 
    loading, 
    loadingMore, 
    error, 
    hasMore, 
    loadMore, 
    seedData 
  } = useThreadFeed();

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
        loading={loading}
        loadingMore={loadingMore}
        error={error}
        hasMore={hasMore}
        onLoadMore={loadMore}
        onSeedData={seedData}
      />
    </Box>
  );
}
