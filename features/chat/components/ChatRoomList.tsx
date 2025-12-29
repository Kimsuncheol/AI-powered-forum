"use client";

import React from "react";
import {
  Box,
  List,
  ListItem,
  Typography,
  Alert,
  Skeleton,
} from "@mui/material";
import { useChatRooms } from "../hooks/useChatRooms";
import { ChatRoomCard } from "./ChatRoomCard";
import { ChatRoomWithParticipant } from "../types";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

interface ChatRoomListProps {
  onSelectRoom: (room: ChatRoomWithParticipant) => void;
  activeRoomId?: string;
}

export function ChatRoomList({ onSelectRoom, activeRoomId }: ChatRoomListProps) {
  const { rooms, loading, error } = useChatRooms();

  // Loading skeleton
  if (loading && rooms.length === 0) {
    return (
      <Box sx={{ p: 1 }}>
        {[1, 2, 3, 4].map((i) => (
          <Box key={i} sx={{ mb: 1 }}>
            <Skeleton variant="rounded" height={64} />
          </Box>
        ))}
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert severity="error" sx={{ m: 1 }}>
        {error}
      </Alert>
    );
  }

  // Empty state
  if (rooms.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 6,
          px: 2,
          color: "text.secondary",
        }}
      >
        <ChatBubbleOutlineIcon sx={{ fontSize: 56, mb: 2, opacity: 0.5 }} />
        <Typography variant="subtitle1" gutterBottom fontWeight={600}>
          No conversations yet
        </Typography>
        <Typography variant="body2" textAlign="center">
          Start chatting with other users to see your conversations here.
        </Typography>
      </Box>
    );
  }

  // List of rooms
  return (
    <List disablePadding sx={{ p: 1 }}>
      {rooms.map((room) => (
        <ListItem key={room.id} disablePadding sx={{ display: "block" }}>
          <ChatRoomCard
            room={room}
            onClick={onSelectRoom}
            isActive={room.id === activeRoomId}
          />
        </ListItem>
      ))}
    </List>
  );
}
