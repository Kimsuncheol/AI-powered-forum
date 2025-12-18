import React from "react";
import { Box, Typography, Button, CircularProgress, Stack, Alert } from "@mui/material";
import { Add, Refresh } from "@mui/icons-material";
import ThreadItem from "./ThreadItem";
import { Thread } from "../api/thread.service";

interface ThreadFeedProps {
  threads: Thread[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  onLoadMore: () => void;
  onSeedData: () => void;
}

export default function ThreadFeed({
  threads,
  loading,
  loadingMore,
  error,
  hasMore,
  onLoadMore,
  onSeedData,
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
        <Button variant="contained" startIcon={<Add />} onClick={onSeedData}>
          Seed Sample Data
        </Button>
      </Box>
    );
  }

  return (
    <Stack spacing={2}>
      {threads.map((thread) => (
        <ThreadItem key={thread.id} thread={thread} />
      ))}

      {hasMore && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Button
            variant="outlined"
            onClick={onLoadMore}
            disabled={loadingMore}
            startIcon={loadingMore ? <CircularProgress size={20} /> : <Refresh />}
          >
            {loadingMore ? "Loading..." : "Load More"}
          </Button>
        </Box>
      )}
    </Stack>
  );
}
