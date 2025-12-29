"use client";

import React from "react";
import { Box, Skeleton } from "@mui/material";
import { ChatHeader } from "./ChatHeader";

interface ChatLoadingProps {
  onBack: () => void;
}

export function ChatLoading({ onBack }: ChatLoadingProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header skeleton */}
      <ChatHeader onBack={onBack} loading={true} />
      {/* Messages skeleton */}
      <Box sx={{ flex: 1, p: 2 }}>
        {[1, 2, 3].map((i) => (
          <Box
            key={i}
            sx={{
              display: "flex",
              mb: 2,
              justifyContent: i % 2 ? "flex-start" : "flex-end",
            }}
          >
            <Skeleton variant="rounded" width={200} height={40} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
