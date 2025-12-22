"use client";

import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";

interface VoteButtonsProps {
  voteCount: number;
  userVote?: "up" | "down" | null;
  onUpvote?: () => void;
  onDownvote?: () => void;
  compact?: boolean;
}

export default function VoteButtons({
  voteCount = 0,
  userVote = null,
  onUpvote,
  onDownvote,
  compact = false,
}: VoteButtonsProps) {
  const handleUpvote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onUpvote?.();
  };

  const handleDownvote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDownvote?.();
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 0.25,
        minWidth: compact ? 32 : 40,
        py: 1,
      }}
    >
      {/* Upvote */}
      <IconButton
        size="small"
        onClick={handleUpvote}
        className="reddit-vote-button"
        sx={{
          p: 0.5,
          color: userVote === "up" ? "primary.main" : "text.secondary",
          "&:hover": {
            backgroundColor: "action.hover",
            color: userVote === "up" ? "primary.dark" : "primary.main",
          },
        }}
      >
        <ArrowUpward sx={{ fontSize: compact ? 18 : 20 }} />
      </IconButton>

      {/* Vote Count */}
      <Typography
        variant="caption"
        sx={{
          fontSize: compact ? "0.7rem" : "0.75rem",
          fontWeight: 700,
          color: userVote === "up" 
            ? "primary.main" 
            : userVote === "down" 
            ? "secondary.main" 
            : "text.primary",
          userSelect: "none",
        }}
      >
        {voteCount > 999 
          ? `${(voteCount / 1000).toFixed(1)}k` 
          : voteCount}
      </Typography>

      {/* Downvote */}
      <IconButton
        size="small"
        onClick={handleDownvote}
        className="reddit-vote-button"
        sx={{
          p: 0.5,
          color: userVote === "down" ? "secondary.main" : "text.secondary",
          "&:hover": {
            backgroundColor: "action.hover",
            color: userVote === "down" ? "secondary.dark" : "secondary.main",
          },
        }}
      >
        <ArrowDownward sx={{ fontSize: compact ? 18 : 20 }} />
      </IconButton>
    </Box>
  );
}
