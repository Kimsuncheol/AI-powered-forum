"use client";

import React, { useRef, useEffect } from "react";
import {
  Box,
  Typography,
} from "@mui/material";
import { useChatRoom } from "../hooks/useChatRoom";
import { ChatMessageBubble } from "./ChatMessageBubble";
import { ChatMessageInput } from "./ChatMessageInput";
import { ChatHeader } from "./ChatHeader";
import { ChatLoading } from "./ChatLoading";
import { ChatError } from "./ChatError";
import { useAuth } from "@/context/AuthContext";
import { useMessageActions } from "../hooks/useMessageActions";

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

  // Message actions
  const {
    handleEdit,
    handleDelete,
    handleReaction,
    handleCopy,
  } = useMessageActions();

  const onEditMessage = (messageId: string, content: string) => {
    // You could populate an input field here or use a dialog
    const newContent = prompt("Edit message:", content);
    if (newContent && newContent.trim()) {
      handleEdit(messageId, newContent.trim(), roomId);
    }
  };

  const onDeleteMessage = (messageId: string) => {
    if (confirm("Delete this message?")) {
      handleDelete(messageId, roomId);
    }
  };

  const onReactionMessage = (messageId: string, emoji: string) => {
    handleReaction(messageId, emoji, roomId);
  };

  if (loading) {
    return <ChatLoading onBack={onBack} />;
  }

  if (error || !room) {
    return <ChatError error={error} onBack={onBack} />;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <ChatHeader
        participantName={room.participantName}
        participantAvatar={room.participantAvatar}
        participantEmail={room.participantEmail}
        onBack={onBack}
        room={room}
        onRoomUpdated={() => {
          // Room will auto-refresh via useChatRoom hook
        }}
        onRoomLeft={() => {
          // Navigate back to chat list
          onBack();
        }}
      />

      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 1.5,
          flexGrow: 1,
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
              currentUserId={user?.uid}
              onEdit={onEditMessage}
              onDelete={onDeleteMessage}
              onReaction={onReactionMessage}
              onCopy={handleCopy}
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
