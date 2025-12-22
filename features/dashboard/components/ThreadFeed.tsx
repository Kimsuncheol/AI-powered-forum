import React from "react";
import { Box, Typography, CircularProgress, Stack, Alert } from "@mui/material";
import ThreadItem from "./ThreadItem";
import { Thread } from "../api/thread.service";
import InfiniteScrollSentinel from "@/components/InfiniteScrollSentinel";


interface ThreadFeedProps {
  threads: Thread[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  onLoadMore: () => void;
}

export default function ThreadFeed({
  threads,
  loading,
  loadingMore,
  error,
  hasMore,
  onLoadMore,
}: ThreadFeedProps) {
  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (threads.length === 0) {
    return (
      <Box
        sx={{
          textAlign: "center",
          py: 8,
          backgroundColor: "background.paper",
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No threads found yet.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Create your first thread to get started!
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={2}>
      {threads.map((thread) => (
        <ThreadItem key={thread.id} thread={thread} />
      ))}

      <InfiniteScrollSentinel
        onLoadMore={onLoadMore}
        hasMore={hasMore}
        loading={loadingMore}
      />
    </Stack>
  );
}
