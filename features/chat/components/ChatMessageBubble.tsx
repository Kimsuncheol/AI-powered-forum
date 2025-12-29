"use client";

import React from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import { Timestamp } from "firebase/firestore";
import { ChatMessage } from "../types";

interface ChatMessageBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
  showAvatar?: boolean;
  senderName?: string;
  senderAvatar?: string;
}

export function ChatMessageBubble({
  message,
  isOwn,
  showAvatar = true,
  senderName,
  senderAvatar,
}: ChatMessageBubbleProps) {
  const timeAgo =
    message.createdAt instanceof Timestamp
      ? formatDistanceToNow(message.createdAt.toDate(), { addSuffix: true })
      : "now";

  const avatarLetter = (senderName || "U")[0].toUpperCase();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isOwn ? "row-reverse" : "row",
        alignItems: "flex-end",
        mb: 1.5,
        gap: 1,
      }}
    >
      {/* Avatar (only for other's messages) */}
      {!isOwn && showAvatar && (
        <Avatar
          src={senderAvatar}
          alt={senderName}
          sx={{ width: 28, height: 28, mb: 0.5 }}
        >
          {avatarLetter}
        </Avatar>
      )}

      {/* Message bubble */}
      <Box
        sx={{
          maxWidth: "75%",
          display: "flex",
          flexDirection: "column",
          alignItems: isOwn ? "flex-end" : "flex-start",
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1,
            borderRadius: 2.5,
            bgcolor: isOwn ? "primary.main" : "action.hover",
            color: isOwn ? "primary.contrastText" : "text.primary",
            position: "relative",
            wordBreak: "break-word",
          }}
        >
          <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
            {message.content}
          </Typography>
        </Box>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 0.5, px: 0.5 }}
        >
          {timeAgo}
        </Typography>
      </Box>
    </Box>
  );
}
