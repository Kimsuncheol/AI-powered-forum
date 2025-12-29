"use client";

import React, { useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Skeleton,
  Stack,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useChatRoom } from "../hooks/useChatRoom";
import { ChatMessageBubble } from "./ChatMessageBubble";
import { ChatMessageInput } from "./ChatMessageInput";
import { useAuth } from "@/context/AuthContext";

interface ChatViewProps {
  roomId: string;
  onBack: () => void;
}

export function ChatView({ roomId, onBack }: ChatViewProps) {
  const { user } = useAuth();
  const { room, messages, loading, sending, error, sendMessage } = useChatRoom(roomId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (content: string) => {
    sendMessage({ content });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Header skeleton */}
        <Box sx={{ p: 1.5, borderBottom: 1, borderColor: "divider" }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Skeleton variant="circular" width={36} height={36} />
            <Skeleton variant="text" width={120} height={24} />
          </Stack>
        </Box>
        {/* Messages skeleton */}
        <Box sx={{ flex: 1, p: 2 }}>
          {[1, 2, 3].map((i) => (
            <Box
              key={i}
              sx={{ display: "flex", mb: 2, justifyContent: i % 2 ? "flex-start" : "flex-end" }}
            >
              <Skeleton variant="rounded" width={200} height={40} />
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  if (error || !room) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography color="error">{error || "Chat not found"}</Typography>
        <IconButton onClick={onBack} sx={{ mt: 2 }}>
          <ArrowBackIcon />
        </IconButton>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <Box
        sx={{
          p: 1.5,
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <IconButton onClick={onBack} size="small" sx={{ mr: 0.5 }}>
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <Avatar
            src={room.participantAvatar}
            alt={room.participantName}
            sx={{ width: 36, height: 36 }}
          >
            {(room.participantName || "U")[0].toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" fontWeight={600}>
              {room.participantName}
            </Typography>
            {room.participantEmail && (
              <Typography variant="caption" color="text.secondary">
                {room.participantEmail}
              </Typography>
            )}
          </Box>
        </Stack>
      </Box>

      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          bgcolor: "background.default",
        }}
      >
        {messages.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "text.secondary",
            }}
          >
            <Typography variant="body2">
              Start the conversation!
            </Typography>
          </Box>
        ) : (
          messages.map((msg) => (
            <ChatMessageBubble
              key={msg.id}
              message={msg}
              isOwn={msg.senderId === user?.uid}
              senderName={msg.senderId === user?.uid ? "You" : room.participantName}
              senderAvatar={msg.senderId === user?.uid ? user?.photoURL || undefined : room.participantAvatar}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input */}
      <ChatMessageInput onSend={handleSend} sending={sending} />
    </Box>
  );
}
