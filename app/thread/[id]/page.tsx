"use client";

import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useParams, useRouter } from "next/navigation";
import { Thread, getThread } from "@/lib/db/threads";
import CommentSection from "@/features/thread/components/CommentSection";
import ThreadHeader from "@/features/thread/components/detail/ThreadHeader";
import ThreadContent from "@/features/thread/components/detail/ThreadContent";
import ThreadLocation from "@/features/thread/components/detail/ThreadLocation";
import ThreadAISummary from "@/features/thread/components/detail/ThreadAISummary";

export default function ThreadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [thread, setThread] = useState<Thread | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      try {
        const t = await getThread(id);
        if (!t) {
          setError("Thread not found.");
        } else {
          setThread(t);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load thread.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !thread) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error || "Thread not found"}</Alert>
        <Button startIcon={<ArrowBack />} onClick={() => router.back()} sx={{ mt: 2 }}>
          Back to Discussions
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button startIcon={<ArrowBack />} onClick={() => router.back()} sx={{ mb: 2 }}>
        Back
      </Button>

      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <ThreadHeader thread={thread} />

        <ThreadContent thread={thread} />

        <Divider sx={{ mb: 3 }} />

        <ThreadLocation location={thread.location} />

        <ThreadAISummary thread={thread} />
      </Paper>

      <CommentSection threadId={id} />
    </Container>
  );
}
