"use client";

import React, { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Avatar,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { ChatRoomList } from "./ChatRoomList";
import { ChatView } from "./ChatView";
import { ChatModalHeader } from "./ChatModalHeader";
import { ChatRoomWithParticipant } from "../types";
import { useAuth } from "@/context/AuthContext";
import { markAsRead } from "../repositories/chatRepository";

interface ChatModalProps {
  open: boolean;
  onClose: () => void;
}

export function ChatModal({ open, onClose }: ChatModalProps) {
  const { user } = useAuth();
  const [selectedRoom, setSelectedRoom] =
    useState<ChatRoomWithParticipant | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSelectRoom = (room: ChatRoomWithParticipant) => {
    setSelectedRoom(room);
  };

  const handleBack = () => {
    setSelectedRoom(null);
  };

  const handleClose = () => {
    setSelectedRoom(null);
    onClose();
  };

  const handleMarkAllRead = async () => {
    if (!selectedRoom || !user?.uid) return;
    try {
      await markAsRead(selectedRoom.id, user.uid);
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  return (
    <Drawer
      anchor={isMobile ? "bottom" : "right"}
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: isMobile ? "100%" : 380,
          height: isMobile ? "40vh" : "60vh",
          borderRadius: isMobile ? "16px 16px 0 0" : 3,
          bottom: isMobile ? 0 : 20,
          right: isMobile ? 0 : 20,
          top: "auto",
          m: isMobile ? 0 : 2,
          display: "flex",
          flexDirection: "column",
          boxShadow: theme.shadows[10],
          overflow: "hidden",
        },
      }}
      data-testid="chat-modal"
    >
      {/* Main container */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <ChatModalHeader
          title={
            selectedRoom ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Avatar
                  src={selectedRoom.participantAvatar}
                  sx={{ width: 32, height: 32 }}
                />
                <Typography variant="subtitle1" fontWeight={700}>
                  {selectedRoom.roomName || selectedRoom.participantName}
                </Typography>
              </Box>
            ) : (
              "Chats"
            )
          }
          startAction={
            selectedRoom ? (
              <IconButton onClick={handleBack} size="small">
                <ArrowBackIcon fontSize="small" />
              </IconButton>
            ) : (
              <ChatBubbleOutlineIcon color="primary" />
            )
          }
          endAction={
            !selectedRoom && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Tooltip title="Mark all as read">
                  <IconButton
                    onClick={handleMarkAllRead}
                    size="small"
                    color="primary"
                  >
                    <DoneAllIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Close">
                  <IconButton onClick={handleClose} size="small">
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            )
          }
        />

        {/* Content */}
        <Box sx={{ flex: 1, overflow: "hidden" }}>
          {selectedRoom ? (
            <ChatView roomId={selectedRoom.id} onBack={handleBack} />
          ) : (
            <Box sx={{ flex: 1, overflow: "auto", height: "100%" }}>
              <ChatRoomList onSelectRoom={handleSelectRoom} />
            </Box>
          )}
        </Box>
      </Box>
    </Drawer>
  );
}
