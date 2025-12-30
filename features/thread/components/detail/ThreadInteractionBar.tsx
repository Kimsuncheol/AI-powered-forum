import React, { useState } from "react";
import { Stack, Tooltip, IconButton, Typography, Snackbar } from "@mui/material";
import { Favorite, Share } from "@mui/icons-material";
import { Thread } from "@/lib/db/threads";
import { useLike } from "@/features/thread/hooks/useLike";
import { useAuth } from "@/context/AuthContext";

interface ThreadInteractionBarProps {
  thread: Thread;
  threadId: string;
}

export default function ThreadInteractionBar({ thread, threadId }: ThreadInteractionBarProps) {
  const { isLiked, likeCount, toggleLike } = useLike(threadId, thread.likesCount || 0, {
    threadAuthorId: thread.authorId,
    threadTitle: thread.title,
  });
  const { user } = useAuth();
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const isAuthenticated = !!user;

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setSnackbarOpen(true);
    });
  };

  return (
    <>
      <Stack direction="row" spacing={1} sx={{ mb: 3 }} alignItems="center">
        <Tooltip title={isAuthenticated ? "" : "Sign in to like"}>
          <span>
            <IconButton
              disabled={!isAuthenticated}
              onClick={(e) => {
                e.stopPropagation();
                toggleLike();
              }}
              sx={{ p: 1 }}
            >
              <Favorite sx={{ fontSize: 24 }} color={isLiked ? "error" : "disabled"} />
            </IconButton>
          </span>
        </Tooltip>
        <Typography variant="body1" fontWeight="bold">
          {likeCount} {likeCount === 1 ? "like" : "likes"}
        </Typography>

        <Tooltip title="Copy link">
          <IconButton onClick={handleShare} sx={{ p: 1 }}>
            <Share sx={{ fontSize: 24 }} />
          </IconButton>
        </Tooltip>
      </Stack>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message="Link copied to clipboard"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </>
  );
}
