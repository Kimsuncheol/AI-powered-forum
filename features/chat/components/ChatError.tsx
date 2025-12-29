"use client";

import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface ChatErrorProps {
  error?: string | null;
  onBack: () => void;
}

export function ChatError({ error, onBack }: ChatErrorProps) {
  return (
    <Box sx={{ p: 3, textAlign: "center" }}>
      <Typography color="error">{error || "Chat not found"}</Typography>
      <IconButton onClick={onBack} sx={{ mt: 2 }}>
        <ArrowBackIcon />
      </IconButton>
    </Box>
  );
}
