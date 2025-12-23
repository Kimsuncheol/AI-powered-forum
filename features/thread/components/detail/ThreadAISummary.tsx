import React, { useState } from "react";
import { Paper, Typography, Box, Button, CircularProgress } from "@mui/material";
import { AutoAwesome } from "@mui/icons-material";
import ReactMarkdown from "react-markdown";
import { summarizeThread } from "@/lib/api/ai";
import { Thread } from "@/lib/db/threads";

interface ThreadAISummaryProps {
  thread: Thread;
}

export default function ThreadAISummary({ thread }: ThreadAISummaryProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  const handleSummarize = async () => {
    setLoadingSummary(true);
    try {
      const result = await summarizeThread(thread.id, thread.content);
      setSummary(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSummary(false);
    }
  };

  if (summary) {
    return (
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
    );
  }

  return (
    <Button
      variant="contained"
      color="secondary"
      startIcon={loadingSummary ? <CircularProgress size={20} color="inherit" /> : <AutoAwesome />}
      onClick={handleSummarize}
      disabled={loadingSummary}
    >
      {loadingSummary ? "Generating Summary..." : "Summarize with AI"}
    </Button>
  );
}
