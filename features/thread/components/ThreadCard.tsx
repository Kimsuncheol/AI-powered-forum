"use client";
import React, { memo } from "react";
import {
  Card,
  CardContent,
  CardActionArea,
  Collapse,
  Box,
  Snackbar,
} from "@mui/material";
import { Thread } from "../types";
import Link from "next/link";
import CommentSection from "./CommentSection";
import { useSettings } from "@/context/SettingsContext";
import { useLike } from "../hooks/useLike";
import { useAuth } from "@/context/AuthContext";
import ThreadCardHeader from "./ThreadCardHeader";
import ThreadCardContent from "./ThreadCardContent";
import ThreadMediaContent from "./ThreadMediaContent";
import NSFWOverlay from "./NSFWOverlay";
import ThreadCardFooter from "./ThreadCardFooter";
import ThreadCardActions from "./ThreadCardActions";

interface ThreadCardProps {
  thread: Thread;
  onClick?: () => void;
}

function ThreadCard({ thread, onClick }: ThreadCardProps) {
  const { autoPlayEnabled, nsfwFilterEnabled } = useSettings();
  const { isLiked, likeCount, toggleLike } = useLike(
    thread.id,
    thread.likesCount || 0,
    {
      threadAuthorId: thread.authorId,
      threadTitle: thread.title,
    }
  );
  const { user } = useAuth();
  const [showComments, setShowComments] = React.useState(false);
  const [nsfwRevealed, setNsfwRevealed] = React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);

  const isAuthenticated = !!user;

  const handleCommentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setShowComments(!showComments);
  };

  const handleRevealNSFW = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setNsfwRevealed(true);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const url = `${window.location.origin}/thread/${thread.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setSnackbarOpen(true);
    });
  };

  // Check if content should be blurred
  const isNSFW = thread.isNSFW === true;
  const shouldBlur = isNSFW && nsfwFilterEnabled && !nsfwRevealed;

  return (
    <Card
      sx={{
        mb: 1.5,
        transition: "background-color 0.1s",
        "&:hover": {
          bgcolor: "action.hover",
        },
      }}
      onClick={onClick}
    >
      <CardActionArea component={Link} href={`/thread/${thread.id}`}>
        <CardContent
          sx={{ p: { xs: 1.5, sm: 2 }, pb: 1, "&:last-child": { pb: 1 } }}
        >
          <ThreadCardHeader
            authorId={thread.authorId}
            createdAt={thread.createdAt}
            isNSFW={isNSFW}
            location={thread.location}
          />

          <NSFWOverlay shouldBlur={shouldBlur} onReveal={handleRevealNSFW}>
            <ThreadCardContent
              title={thread.title}
              body={thread.body || ""}
              type={thread.type || "text"}
              linkUrl={thread.linkUrl}
            />
            <ThreadMediaContent
              imageUrls={thread.imageUrls}
              mediaUrl={thread.mediaUrl}
              type={thread.type || "text"}
              autoPlayEnabled={autoPlayEnabled}
            />
          </NSFWOverlay>
        </CardContent>
      </CardActionArea>

      {/* Footer: Tags & Stats */}
      <CardContent
        sx={{ pt: 0, pb: 1, px: { xs: 1.5, sm: 2 }, "&:last-child": { pb: 1 } }}
      >
        <ThreadCardFooter tagIds={thread.tagIds || []}>
          <ThreadCardActions
            threadId={thread.id}
            isLiked={isLiked}
            likeCount={likeCount}
            commentsCount={thread.commentsCount || 0}
            showComments={showComments}
            isAuthenticated={isAuthenticated}
            onToggleLike={toggleLike}
            onCommentClick={handleCommentClick}
            onShare={handleShare}
          />
        </ThreadCardFooter>
      </CardContent>

      {/* Comments Expansion */}
      <Collapse in={showComments} timeout="auto" unmountOnExit>
        <Box
          sx={{
            px: { xs: 1.5, sm: 2 },
            py: 2,
            bgcolor: "background.default",
            borderTop: 1,
            borderColor: "divider",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <CommentSection
            threadId={thread.id}
            threadAuthorId={thread.authorId}
            threadTitle={thread.title}
          />
        </Box>
      </Collapse>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message="Link copied to clipboard"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Card>
  );
}

export default memo(ThreadCard);
