"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

export function ChatRoomListHeader() {
  return (
    <Box
      sx={{
        p: 2,
        borderBottom: 1,
        borderColor: "divider",
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      <ChatBubbleOutlineIcon color="primary" />
      <Typography variant="h6" fontWeight={600}>
        Messages
      </Typography>
    </Box>
  );
}
