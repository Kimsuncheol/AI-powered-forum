"use client";

import React from "react";
import { Box, Avatar, Typography } from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import ThreadMoreMenu from "@/features/thread/components/ThreadMoreMenu";

interface ThreadCardHeaderProps {
  authorName: string;
  createdAt: number;
  threadId: string;
  threadTitle: string;
}

export default function ThreadCardHeader({
  authorName,
  createdAt,
  threadId,
  threadTitle,
}: ThreadCardHeaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        mb: 1,
        gap: 1,
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Avatar sx={{ width: 24, height: 24, fontSize: "0.75rem" }}>
          {authorName[0].toUpperCase()}
        </Avatar>
        <Typography variant="caption" color="text.secondary" fontWeight="bold">
          {authorName}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          • {formatDistanceToNow(createdAt)} ago
        </Typography>
      </Box>

      <ThreadMoreMenu
        threadId={threadId}
        threadTitle={threadTitle}
        authorId={authorName}
      />
    </Box>
  );
}
