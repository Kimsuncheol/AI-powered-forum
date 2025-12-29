"use client";

import React, { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { ChatRoomList } from "./ChatRoomList";
import { ChatView } from "./ChatView";
import { ChatRoomWithParticipant } from "../types";

interface ChatModalProps {
  open: boolean;
  onClose: () => void;
}

export function ChatModal({ open, onClose }: ChatModalProps) {
  const [selectedRoom, setSelectedRoom] = useState<ChatRoomWithParticipant | null>(null);
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

  return (
    <Drawer
      anchor={isMobile ? "bottom" : "right"}
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: isMobile ? "100%" : 380,
          height: isMobile ? "85vh" : "100%",
          borderTopLeftRadius: isMobile ? 16 : 0,
          borderTopRightRadius: isMobile ? 16 : 0,
          display: "flex",
          flexDirection: "column",
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
        {/* Show room list or chat view */}
        {selectedRoom ? (
          <ChatView roomId={selectedRoom.id} onBack={handleBack} />
        ) : (
          <>
            {/* Header */}
            <Box
              sx={{
                p: 2,
                borderBottom: 1,
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                bgcolor: "background.paper",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <ChatBubbleOutlineIcon color="primary" />
                <Typography variant="h6" fontWeight={700}>
                  Chats
                </Typography>
              </Box>
              <IconButton onClick={handleClose} size="small">
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            {/* Room list */}
            <Box sx={{ flex: 1, overflow: "auto" }}>
              <ChatRoomList
                onSelectRoom={handleSelectRoom}
              />
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
}
