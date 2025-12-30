import React from "react";
import { Box, Avatar, Typography } from "@mui/material";
import { formatDistanceToNow } from "date-fns";

interface ThreadCardHeaderProps {
  authorName: string;
  createdAt: number;
}

export default function ThreadCardHeader({
  authorName,
  createdAt,
}: ThreadCardHeaderProps) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", mb: 1, gap: 1 }}>
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
  );
}
