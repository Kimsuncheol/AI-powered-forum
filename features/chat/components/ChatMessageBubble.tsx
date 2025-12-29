"use client";

import React, { useState, useRef, useEffect } from "react";
import { Box, Typography, Avatar, Chip, Stack } from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import { Timestamp } from "firebase/firestore";
import { ChatMessage } from "../types";
import { ChatMessageMenu } from "./ChatMessageMenu";

interface ChatMessageBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
  showAvatar?: boolean;
  senderName?: string;
  senderAvatar?: string;
  currentUserId?: string;
  onEdit?: (messageId: string, content: string) => void;
  onDelete?: (messageId: string) => void;
  onReaction?: (messageId: string, emoji: string) => void;
  onCopy?: (content: string) => void;
}

export function ChatMessageBubble({
  message,
  isOwn,
  showAvatar = true,
  senderName,
  senderAvatar,
  currentUserId,
  onEdit,
  onDelete,
  onReaction,
  onCopy,
}: ChatMessageBubbleProps) {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);

  const timeAgo =
    message.createdAt instanceof Timestamp
      ? formatDistanceToNow(message.createdAt.toDate(), { addSuffix: true })
      : "now";

  const avatarLetter = (senderName || "U")[0].toUpperCase();

  // Long-press handlers
  const handlePressStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    longPressTimer.current = setTimeout(() => {
      setMenuAnchor(bubbleRef.current);
    }, 500); // 500ms long press
  };

  const handlePressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, []);

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleEdit = () => {
    onEdit?.(message.id, message.content);
  };

  const handleDelete = () => {
    onDelete?.(message.id);
  };

  const handleReaction = (emoji: string) => {
    onReaction?.(message.id, emoji);
  };

  const handleCopy = () => {
    onCopy?.(message.content);
    navigator.clipboard.writeText(message.content);
  };

  const handleForward = () => {
    // Simple forward implementation - copy to clipboard
    navigator.clipboard.writeText(message.content);
  };

  // Check if current user reacted with specific emoji
  const hasUserReacted = (emoji: string) => {
    if (!currentUserId || !message.reactions) return false;
    const reaction = message.reactions.find((r) => r.emoji === emoji);
    return reaction?.userIds.includes(currentUserId) || false;
  };

  const toggleReaction = (emoji: string) => {
    onReaction?.(message.id, emoji);
  };

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
          ref={bubbleRef}
          onMouseDown={handlePressStart}
          onMouseUp={handlePressEnd}
          onMouseLeave={handlePressEnd}
          onTouchStart={handlePressStart}
          onTouchEnd={handlePressEnd}
          sx={{
            px: 2,
            py: 1,
            borderRadius: 2.5,
            bgcolor: isOwn ? "primary.main" : "action.hover",
            color: isOwn ? "primary.contrastText" : "text.primary",
            position: "relative",
            wordBreak: "break-word",
            cursor: "pointer",
            userSelect: "none",
            "&:active": {
              opacity: 0.9,
            },
          }}
        >
          <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
            {message.content}
          </Typography>
          {message.editedAt && (
            <Typography
              variant="caption"
              sx={{
                fontSize: "0.65rem",
                opacity: 0.7,
                fontStyle: "italic",
                display: "block",
                mt: 0.5,
              }}
            >
              (edited)
            </Typography>
          )}
        </Box>

        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <Stack
            direction="row"
            spacing={0.5}
            sx={{ mt: 0.5, flexWrap: "wrap", gap: 0.5 }}
          >
            {message.reactions.map((reaction) => (
              <Chip
                key={reaction.emoji}
                label={`${reaction.emoji} ${reaction.userIds.length}`}
                size="small"
                onClick={() => toggleReaction(reaction.emoji)}
                sx={{
                  height: 20,
                  fontSize: "0.75rem",
                  bgcolor: hasUserReacted(reaction.emoji)
                    ? "primary.light"
                    : "action.hover",
                  cursor: "pointer",
                  "&:hover": {
                    bgcolor: hasUserReacted(reaction.emoji)
                      ? "primary.main"
                      : "action.selected",
                  },
                }}
              />
            ))}
          </Stack>
        )}

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 0.5, px: 0.5 }}
        >
          {timeAgo}
        </Typography>
      </Box>

      {/* Message Menu */}
      <ChatMessageMenu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        onEdit={isOwn ? handleEdit : undefined}
        onDelete={isOwn ? handleDelete : undefined}
        onForward={handleForward}
        onCopy={handleCopy}
        onReaction={handleReaction}
        isOwnMessage={isOwn}
      />
    </Box>
  );
}
