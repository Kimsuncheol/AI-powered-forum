import React from "react";
import { Box, Avatar, Typography, Chip } from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import { Thread } from "@/lib/db/threads";

interface ThreadHeaderProps {
  thread: Thread;
}

export default function ThreadHeader({ thread }: ThreadHeaderProps) {
  return (
    <>
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
    </>
  );
}
