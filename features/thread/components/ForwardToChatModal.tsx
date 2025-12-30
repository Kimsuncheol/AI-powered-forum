"use client";

import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  CircularProgress,
  Box,
  IconButton,
} from "@mui/material";
import { Close, Forum } from "@mui/icons-material";
import { useForwardThread } from "../hooks/useForwardThread";

interface ForwardToChatModalProps {
  open: boolean;
  onClose: () => void;
  threadId: string;
  threadTitle: string;
  onSuccess?: () => void;
}

export default function ForwardToChatModal({
  open,
  onClose,
  threadId,
  threadTitle,
  onSuccess,
}: ForwardToChatModalProps) {
  const { chatRooms, isLoading, error, fetchChatRooms, forwardThread } =
    useForwardThread();

  useEffect(() => {
    if (open) {
      fetchChatRooms();
    }
  }, [open, fetchChatRooms]);

  const handleSelectRoom = async (roomId: string) => {
    const success = await forwardThread(roomId, threadId, threadTitle);
    if (success) {
      onSuccess?.();
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" component="span">
          Forward to Chat
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0 }}>
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 4,
            }}
          >
            <CircularProgress size={32} />
          </Box>
        ) : error ? (
          <Box sx={{ py: 4, textAlign: "center" }}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : chatRooms.length === 0 ? (
          <Box sx={{ py: 4, textAlign: "center" }}>
            <Forum sx={{ fontSize: 48, color: "text.secondary", mb: 1 }} />
            <Typography color="text.secondary">No chat rooms found</Typography>
            <Typography variant="body2" color="text.secondary">
              Start a conversation to forward threads
            </Typography>
          </Box>
        ) : (
          <List sx={{ py: 0 }}>
            {chatRooms.map((room) => (
              <ListItemButton
                key={room.id}
                onClick={() => handleSelectRoom(room.id)}
                sx={{ py: 1.5 }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "primary.main" }}>
                    {room.roomName?.[0]?.toUpperCase() ||
                      room.participants[0]?.[0]?.toUpperCase() ||
                      "?"}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    room.roomName ||
                    room.participants.filter((p) => p !== room.participants[0]).join(", ") ||
                    "Chat Room"
                  }
                  secondary={room.lastMessage || "No messages yet"}
                  primaryTypographyProps={{ fontWeight: 500 }}
                  secondaryTypographyProps={{
                    noWrap: true,
                    sx: { maxWidth: 200 },
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
}
