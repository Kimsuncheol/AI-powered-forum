"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Bookmark } from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";
import { getBookmarks, BookmarkedThread } from "@/features/collections";
import ThreadCard from "@/features/thread/components/ThreadCard";
import { getThread } from "@/features/thread/repositories/threadRepo";
import { Thread } from "@/features/thread/types";

export default function CollectionsPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<BookmarkedThread[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBookmarks() {
      if (!user) {
        setError("Please sign in to view your collections");
        setIsLoading(false);
        return;
      }

      // For now, only support "saved" collection (user's bookmarks)
      if (id !== "saved" && id !== user.uid) {
        setError("Collection not found");
        setIsLoading(false);
        return;
      }

      try {
        const userBookmarks = await getBookmarks(user.uid);
        setBookmarks(userBookmarks);

        // Fetch full thread data for each bookmark
        const threadPromises = userBookmarks.map((bookmark) =>
          getThread(bookmark.threadId)
        );
        const threadResults = await Promise.all(threadPromises);
        const validThreads = threadResults.filter(
          (t): t is Thread => t !== null
        );
        setThreads(validThreads);
      } catch (err) {
        console.error("Error loading bookmarks:", err);
        setError("Failed to load bookmarks");
      } finally {
        setIsLoading(false);
      }
    }

    loadBookmarks();
  }, [user, id]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
        <Bookmark sx={{ fontSize: 28, color: "primary.main" }} />
        <Typography variant="h5" fontWeight="bold">
          Saved Threads
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ({bookmarks.length})
        </Typography>
      </Box>

      {threads.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Bookmark sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No saved threads yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Threads you save will appear here
          </Typography>
        </Box>
      ) : (
        <Box>
          {threads.map((thread) => (
            <ThreadCard key={thread.id} thread={thread} />
          ))}
        </Box>
      )}
    </Container>
  );
}
