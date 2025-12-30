"use client";

import React, { useState, useRef } from "react";
import {
  Card,
  CardActionArea,
  Avatar,
  Typography,
  Stack,
  Box,
} from "@mui/material";
import PushPinIcon from "@mui/icons-material/PushPin";
import { formatDistanceToNow } from "date-fns";
import { Timestamp } from "firebase/firestore";
import { ChatRoomWithParticipant } from "../types";
import { ChatRoomSettingsMenu } from "./ChatRoomSettingsMenu";

interface ChatRoomCardProps {
  room: ChatRoomWithParticipant;
  onClick: (room: ChatRoomWithParticipant) => void;
  isActive?: boolean;
  onRoomUpdated?: () => void;
  onRoomLeft?: () => void;
  currentUserId?: string;
}

const LONG_PRESS_DURATION = 500; // ms

export function ChatRoomCard({
  room,
  onClick,
  isActive = false,
  onRoomUpdated,
  onRoomLeft,
  currentUserId,
}: ChatRoomCardProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef(false);

  const timeAgo =
    room.lastMessageAt instanceof Timestamp
      ? formatDistanceToNow(room.lastMessageAt.toDate(), { addSuffix: true })
      : "";

  const displayName = room.roomName || room.participantName || "Unknown";
  const avatarLetter = displayName[0].toUpperCase();
  
  const unreadCount = currentUserId && room.unreadCount ? (room.unreadCount[currentUserId] || 0) : 0;
  const hasUnread = unreadCount > 0;

  const handleTouchStart = () => {
    isLongPress.current = false;
    longPressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      setSettingsOpen(true);
    }, LONG_PRESS_DURATION);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleClick = () => {
    if (!isLongPress.current) {
      onClick(room);
    }
    isLongPress.current = false;
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setSettingsOpen(true);
  };

  return (
    <>
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
        <CardActionArea
          onClick={handleClick}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          onContextMenu={handleContextMenu}
          sx={{ p: 1.5 }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            {/* Avatar */}
            <Avatar
              src={room.participantAvatar}
              alt={displayName}
              sx={{ width: 44, height: 44 }}
            >
              {avatarLetter}
            </Avatar>

            {/* Content */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" alignItems="center" spacing={0.5} sx={{ maxWidth: "70%" }}>
                  {room.isPinned && (
                    <PushPinIcon sx={{ fontSize: 14, color: "primary.main" }} />
                  )}
                  <Typography
                    variant="subtitle2"
                    fontWeight={hasUnread ? 700 : 500}
                    noWrap
                  >
                    {displayName}
                  </Typography>
                </Stack>
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

            {/* Unread Count */}
            {hasUnread && (
              <Box
                sx={{
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  minWidth: 20,
                  height: 20,
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  px: 0.75,
                  fontSize: "0.75rem",
                  fontWeight: 700,
                }}
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </Box>
            )}
          </Stack>
        </CardActionArea>
      </Card>

      {/* Settings Menu */}
      <ChatRoomSettingsMenu
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        room={room}
        showPinOption={true}
        onRoomUpdated={onRoomUpdated}
        onRoomLeft={onRoomLeft}
      />
    </>
  );
}

