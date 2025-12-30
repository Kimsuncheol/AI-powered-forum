import React from "react";
import { Stack, Tooltip, IconButton, Button, Typography } from "@mui/material";
import { Favorite, Comment, Share } from "@mui/icons-material";

interface ThreadCardActionsProps {
  threadId: string;
  isLiked: boolean;
  likeCount: number;
  commentsCount: number;
  showComments: boolean;
  isAuthenticated: boolean;
  onToggleLike: () => void;
  onCommentClick: (e: React.MouseEvent) => void;
  onShare: (e: React.MouseEvent) => void;
}

export default function ThreadCardActions({
  isLiked,
  likeCount,
  commentsCount,
  showComments,
  isAuthenticated,
  onToggleLike,
  onCommentClick,
  onShare,
}: ThreadCardActionsProps) {
  return (
    <Stack
      direction="row"
      spacing={0.5}
      color="text.secondary"
      alignItems="center"
      sx={{ justifyContent: "flex-end" }}
    >
      {/* Like Button */}
      <Tooltip title={isAuthenticated ? "" : "Sign in to like"}>
        <span>
          <IconButton
            size="small"
            disabled={!isAuthenticated}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onToggleLike();
            }}
            sx={{ p: 0.5 }}
          >
            <Favorite
              fontSize="small"
              sx={{ fontSize: 16 }}
              color={isLiked ? "error" : "disabled"}
            />
          </IconButton>
        </span>
      </Tooltip>
      <Typography
        variant="caption"
        sx={{ fontSize: "0.7rem", fontWeight: 700 }}
      >
        {likeCount}
      </Typography>

      {/* Comment Button */}
      <Tooltip title={isAuthenticated ? "" : "Sign in to comment"}>
        <span>
          <Button
            size="small"
            disabled={!isAuthenticated}
            startIcon={<Comment sx={{ fontSize: 16 }} />}
            sx={{
              color: showComments ? "primary.main" : "text.secondary",
              minWidth: "auto",
              px: 0.75,
              py: 0.25,
              fontSize: "0.75rem",
              fontWeight: 700,
            }}
            onClick={onCommentClick}
          >
            {commentsCount || 0}
          </Button>
        </span>
      </Tooltip>

      {/* Share Button */}
      <Tooltip title="Copy link">
        <IconButton size="small" onClick={onShare} sx={{ p: 0.5 }}>
          <Share fontSize="small" sx={{ fontSize: 16 }} />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}
