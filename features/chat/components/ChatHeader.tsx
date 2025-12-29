"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Stack,
  Skeleton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MoreVertSharpIcon from "@mui/icons-material/MoreVertSharp";
import { ChatRoomSettingsMenu } from "./ChatRoomSettingsMenu";
import { ChatRoomWithParticipant } from "../types";

interface ChatHeaderProps {
  participantName?: string;
  participantAvatar?: string;
  participantEmail?: string;
  onBack: () => void;
  loading?: boolean;
  room?: ChatRoomWithParticipant;
  onRoomUpdated?: () => void;
  onRoomLeft?: () => void;
}

export function ChatHeader({
  participantName,
  participantAvatar,
  participantEmail,
  onBack,
  loading = false,
  room,
  onRoomUpdated,
  onRoomLeft,
}: ChatHeaderProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  if (loading) {
    return (
      <Box sx={{ p: 1.5, borderBottom: 1, borderColor: "divider" }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Skeleton variant="circular" width={28} height={28} /> {/* Back button space */}
          <Skeleton variant="circular" width={36} height={36} />
          <Skeleton variant="text" width={120} height={24} />
        </Stack>
      </Box>
    );
  }

  const displayName = room?.roomName || participantName;

  return (
    <>
      <Box
        sx={{
          p: 1.5,
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <IconButton onClick={onBack} size="small" sx={{ mr: 0.5 }}>
              <ArrowBackIcon fontSize="small" />
            </IconButton>
            <Avatar
              src={participantAvatar}
              alt={displayName}
              sx={{ width: 36, height: 36 }}
            >
              {(displayName || "U")[0].toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" fontWeight={600}>
                {displayName}
              </Typography>
              {participantEmail && (
                <Typography variant="caption" color="text.secondary">
                  {participantEmail}
                </Typography>
              )}
            </Box>
          </Stack>
          
          {/* Settings Trigger */}
          {room && (
            <IconButton onClick={() => setSettingsOpen(true)} size="small">
              <MoreVertSharpIcon fontSize="small" />
            </IconButton>
          )}
        </Stack>
      </Box>

      {/* Settings Menu (no pin option in chat view) */}
      {room && (
        <ChatRoomSettingsMenu
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          room={room}
          showPinOption={false}
          onRoomUpdated={onRoomUpdated}
          onRoomLeft={onRoomLeft}
        />
      )}
    </>
  );
}

