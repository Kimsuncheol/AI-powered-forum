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
  Alert,
} from "@mui/material";
import { AutoAwesome, ArrowBack } from "@mui/icons-material";
import { useParams, useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Thread, getThread } from "@/lib/db/threads";
import { summarizeThread } from "@/lib/api/ai";
import ReactMarkdown from "react-markdown";
import CommentSection from "@/features/thread/components/CommentSection";

export default function ThreadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [thread, setThread] = useState<Thread | null>(null);
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
            {(thread.authorName?.[0] || thread.authorId?.[0] || "?").toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              {thread.authorName || thread.authorId || "Anonymous"}
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
          {(thread.tags || []).map((tag) => (
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


        {/* Location Map View */}
        {thread.location && (
          <Box sx={{ mb: 4, height: 300, borderRadius: 2, overflow: "hidden", border: 1, borderColor: "divider" }}>
             {/* Map will be rendered here. Since we are in a read-only view, we can reuse LocationPicker or just GoogleMap directly.
                 However, to avoid adding more imports to this file (GoogleMap, useLoadScript, etc.) and handling loading states, 
                 we can use the same pattern as LocationPicker but in read-only mode, or create a `LocationView` component. 
                 
                 For simplicity and cleaner architecture, I should probably create a `LocationView` component,
                 but for now I will use a simple static map approach or just reuse LocationPicker in read-only mode if it supported it.
                 
                 Let's create a LocationMapViewer component to handle the map loading and display.
             */}
             <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${thread.location.address}`}
            ></iframe>
          </Box>
        )}

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
      <CommentSection threadId={id} />
    </Container>
  );
}
