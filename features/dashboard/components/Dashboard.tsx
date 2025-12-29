"use client";

import { Box } from "@mui/material";
import { useEffect } from "react";
import FollowingUserAvatars from "./FollowingUserAvatars";
import ThreadFeed from "./ThreadFeed";
import { useInfiniteThreadFeed } from "@/features/thread/hooks/useInfiniteThreadFeed";

export default function Dashboard() {
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
    <Box sx={{ maxWidth: "lg", mx: "auto" }}>
      {/* Welcome Header */}
      {/* Following Users Avatars */}
      <FollowingUserAvatars />

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
