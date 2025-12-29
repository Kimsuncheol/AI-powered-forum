"use client";

import React from "react";
import {
  Card,
  CardActionArea,
  Avatar,
  Typography,
  Stack,
  Box,
  Badge,
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import { Timestamp } from "firebase/firestore";
import { ChatRoomWithParticipant } from "../types";

interface ChatRoomCardProps {
  room: ChatRoomWithParticipant;
  onClick: (room: ChatRoomWithParticipant) => void;
  isActive?: boolean;
}

export function ChatRoomCard({ room, onClick, isActive = false }: ChatRoomCardProps) {
  const timeAgo =
    room.lastMessageAt instanceof Timestamp
      ? formatDistanceToNow(room.lastMessageAt.toDate(), { addSuffix: true })
      : "";

  const avatarLetter = (room.participantName || "U")[0].toUpperCase();
  const hasUnread = (room.unreadCount ?? 0) > 0;

  return (
    <Card
      variant="outlined"
      sx={{
        mb: 1,
        transition: "all 0.2s",
        bgcolor: isActive ? "action.selected" : "background.paper",
        "&:hover": { 
          boxShadow: 2,
          bgcolor: isActive ? "action.selected" : "action.hover",
        },
      }}
    >
      <CardActionArea onClick={() => onClick(room)} sx={{ p: 1.5 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          {/* Avatar with unread badge */}
          <Badge
            color="primary"
            variant="dot"
            invisible={!hasUnread}
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <Avatar
              src={room.participantAvatar}
              alt={room.participantName}
              sx={{ width: 44, height: 44 }}
            >
              {avatarLetter}
            </Avatar>
          </Badge>

          {/* Content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography
                variant="subtitle2"
                fontWeight={hasUnread ? 700 : 500}
                noWrap
                sx={{ maxWidth: "70%" }}
              >
                {room.participantName}
              </Typography>
              {timeAgo && (
                <Typography variant="caption" color="text.secondary">
                  {timeAgo}
                </Typography>
              )}
            </Stack>
            <Typography
              variant="body2"
              color={hasUnread ? "text.primary" : "text.secondary"}
              fontWeight={hasUnread ? 600 : 400}
              noWrap
              sx={{ mt: 0.25 }}
            >
              {room.lastMessage || "No messages yet"}
            </Typography>
          </Box>
        </Stack>
      </CardActionArea>
    </Card>
  );
}
