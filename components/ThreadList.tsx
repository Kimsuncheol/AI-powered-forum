"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Stack,
  Alert,
} from "@mui/material";
import { Add, Refresh } from "@mui/icons-material";
import ThreadCard from "./ThreadCard";
import { getThreads, seedMockThreads, Thread } from "@/lib/db/threads";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

export default function ThreadList() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [sortBy, setSortBy] = useState<"latest" | "popular">("latest");
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchThreads = async (reset = false) => {
    try {
      const currentLastDoc = reset ? undefined : lastDoc || undefined;
      if (!reset && !currentLastDoc && threads.length > 0) return; // No more to load

      setLoading(reset);
      setLoadingMore(!reset);
      setError(null);

      const { threads: newThreads, lastDoc: newLastDoc } = await getThreads(
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
      setError("Failed to load threads. Please try again.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchThreads(true);
  }, [sortBy]);

  const handleSeedData = async () => {
    setLoading(true);
    await seedMockThreads();
    await fetchThreads(true);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Toolbar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Discussions
        </Typography>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value as "latest" | "popular")}
            >
              <MenuItem value="latest">Latest</MenuItem>
              <MenuItem value="popular">Popular</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Loading Initial */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Empty State */}
      {!loading && threads.length === 0 && (
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
          <Typography variant="body2" color="text.secondary" paragraph>
            Be the first to start a conversation!
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleSeedData}
          >
            Seed Sample Data
          </Button>
        </Box>
      )}

      {/* List */}
      <Stack spacing={2}>
        {threads.map((thread) => (
          <ThreadCard key={thread.id} thread={thread} />
        ))}
      </Stack>

      {/* Load More */}
      {hasMore && !loading && threads.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Button
            variant="outlined"
            onClick={() => fetchThreads(false)}
            disabled={loadingMore}
            startIcon={loadingMore ? <CircularProgress size={20} /> : <Refresh />}
          >
            {loadingMore ? "Loading..." : "Load More"}
          </Button>
        </Box>
      )}
    </Container>
  );
}
