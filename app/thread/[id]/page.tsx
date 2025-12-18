"use client";

import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Avatar,
  Chip,
  Button,
  Divider,
  CircularProgress,
  Stack,
  Alert,
} from "@mui/material";
import { AutoAwesome, ArrowBack } from "@mui/icons-material";
import { useParams, useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Thread, Comment, getThread, getComments } from "@/lib/db/threads";
import { summarizeThread } from "@/lib/api/ai";
import ReactMarkdown from "react-markdown";

export default function ThreadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [thread, setThread] = useState<Thread | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
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
          const c = await getComments(id);
          setComments(c);
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

  const handleSummarize = async () => {
    if (!thread) return;
    setLoadingSummary(true);
    try {
      const result = await summarizeThread(thread.id, thread.content);
      setSummary(result);
    } catch (err) {
      console.error(err);
      // Fallback is handled in API client, but just in case
    } finally {
      setLoadingSummary(false);
    }
  };

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

      {/* Main Thread Content */}
      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1.5 }}>
          <Avatar sx={{ bgcolor: "primary.main" }}>
            {thread.authorName[0].toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              {thread.authorName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDistanceToNow(thread.createdAt)} ago
            </Typography>
          </Box>
        </Box>

        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          {thread.title}
        </Typography>

        <Box sx={{ mb: 3 }}>
          {thread.tags.map((tag) => (
            <Chip
              key={tag}
              label={`#${tag}`}
              size="small"
              sx={{ mr: 1, borderRadius: 1 }}
            />
          ))}
        </Box>

        <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", mb: 4 }}>
          {thread.content}
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {/* AI Summary Section */}
        {summary ? (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              backgroundColor: (theme) =>
                theme.palette.mode === "light" ? "#fff9c4" : "#423e20",
              border: "1px solid",
              borderColor: "warning.main",
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" gutterBottom color="warning.main" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AutoAwesome /> AI Summary
            </Typography>
            <Box className="markdown-body">
              <ReactMarkdown>{summary}</ReactMarkdown>
            </Box>
          </Paper>
        ) : (
          <Button
            variant="contained"
            color="secondary"
            startIcon={loadingSummary ? <CircularProgress size={20} color="inherit" /> : <AutoAwesome />}
            onClick={handleSummarize}
            disabled={loadingSummary}
          >
            {loadingSummary ? "Generating Summary..." : "Summarize with AI"}
          </Button>
        )}
      </Paper>

      {/* Comments Section */}
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Comments ({comments.length})
      </Typography>
      
      <Stack spacing={2}>
        {comments.map((comment) => (
          <Paper key={comment.id} elevation={1} sx={{ p: 2, borderRadius: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="subtitle2" fontWeight="bold">
                {comment.authorName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatDistanceToNow(comment.createdAt)} ago
              </Typography>
            </Box>
            <Typography variant="body2">{comment.content}</Typography>
          </Paper>
        ))}
        {comments.length === 0 && (
            <Typography color='text.secondary'>No comments yet.</Typography>
        )}
      </Stack>
    </Container>
  );
}
