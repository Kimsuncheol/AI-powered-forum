"use client";

import React, { useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Alert,
  Skeleton,
  Stack, // Kept for Skeletons
  Button,
} from "@mui/material";
import { Refresh } from "@mui/icons-material";
import VirtualThreadFeed from "./VirtualThreadFeed";
import { useInfiniteThreadFeed } from "@/features/thread/hooks/useInfiniteThreadFeed";
import { threadService } from "../api/thread.service";

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

  // Load initial data on mount
  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  // Handle manual seeding (for demo purposes)
  const handleSeedData = async () => {
    await threadService.seedData();
    loadInitial();
  };

  return (
    <Container sx={{ py: 2, height: "100vh", overflowY: "auto" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Discussions
      </Typography>

      {/* Error State */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          action={
            <Button color="inherit" size="small" onClick={() => loadInitial()}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Empty State (After Loading) */}
      {!loadingInitial && !error && threads.length === 0 && (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            backgroundColor: "background.paper",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No threads found.
          </Typography>
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={handleSeedData}
            sx={{ mt: 2 }}
          >
            Seed Sample Data
          </Button>
        </Box>
      )}

      {/* Thread List (Virtualized) */}
      {!loadingInitial && threads.length > 0 && (
        <VirtualThreadFeed
          threads={threads}
          hasMore={hasMore}
          loading={loadingMore}
          onLoadMore={loadMore}
        />
      )}

      {/* Loading Skeletons (Initial Only) */}
      {loadingInitial && (
        <Stack spacing={2}>
          {[1, 2, 3].map((n) => (
            <Skeleton
              key={n}
              variant="rectangular"
              height={160}
              sx={{ borderRadius: 2 }}
            />
          ))}
        </Stack>
      )}
    </Container>
  );
}
