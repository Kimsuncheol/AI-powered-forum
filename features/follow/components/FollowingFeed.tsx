"use client";

import React from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Stack,
  Button,
} from "@mui/material";
import RssFeedIcon from "@mui/icons-material/RssFeed";
import { useAuth } from "@/context/AuthContext";
import { useInfiniteFollowingFeed } from "../hooks/useInfiniteFollowingFeed";
import ThreadCard from "@/features/thread/components/ThreadCard";
import InfiniteScrollSentinel from "@/components/InfiniteScrollSentinel";

export function FollowingFeed() {
  const { user } = useAuth();
  const {
    threads,
    loading,
    loadingMore,
    error,
    hasMore,
    isEmpty,
    isFollowingTooLarge,
    loadMore,
    refresh,
  } = useInfiniteFollowingFeed(user?.uid);

  // Not authenticated
  if (!user) {
    return (
      <Alert severity="info">
        Sign in to see threads from people you follow.
      </Alert>
    );
  }

  // Initial loading
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert severity="error" action={
        <Button color="inherit" size="small" onClick={refresh}>
          Retry
        </Button>
      }>
        {error}
      </Alert>
    );
  }

  // Empty state
  if (isEmpty) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 8,
          color: "text.secondary",
        }}
      >
        <RssFeedIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
        <Typography variant="h6" gutterBottom>
          Your feed is empty
        </Typography>
        <Typography variant="body2" align="center">
          Follow some users to see their threads here!
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Warning for too many following */}
      {isFollowingTooLarge && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          You&apos;re following more than 30 users. Only showing threads from the first 30.
          <br />
          <Typography variant="caption">
            (This is a Firestore IN query limitation. Future updates will support more.)
          </Typography>
        </Alert>
      )}

      {/* Thread list */}
      <Stack spacing={2}>
        {threads.map((thread) => (
          <ThreadCard key={thread.id} thread={thread} />
        ))}
      </Stack>

      {/* Loading more indicator */}
      {loadingMore && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
          <CircularProgress size={32} />
        </Box>
      )}

      {/* Infinite scroll sentinel */}
      {hasMore && (
        <InfiniteScrollSentinel 
          onLoadMore={loadMore}
          hasMore={hasMore}
          loading={loadingMore}
        />
      )}

      {/* End of feed */}
      {!hasMore && threads.length > 0 && (
        <Box sx={{ textAlign: "center", py: 3, color: "text.secondary" }}>
          <Typography variant="body2">
            You&apos;ve reached the end of your feed
          </Typography>
        </Box>
      )}
    </Box>
  );
}
