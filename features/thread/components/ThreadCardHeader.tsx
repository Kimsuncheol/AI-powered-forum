"use client";

import React from "react";
import { Box, Avatar, Typography, Chip } from "@mui/material";
import { Warning, Place } from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";
import { Timestamp } from "firebase/firestore";
import ThreadMoreMenu from "./ThreadMoreMenu";

interface ThreadCardHeaderProps {
  authorId: string;
  createdAt: Date | Timestamp | number;
  isNSFW?: boolean;
  location?: { name?: string; address: string };
  threadId: string;
  threadTitle: string;
}

export default function ThreadCardHeader({
  authorId,
  createdAt,
  isNSFW,
  location,
  threadId,
  threadTitle,
}: ThreadCardHeaderProps) {
  // Safe date handling - use a stable fallback
  const getCreatedAtMillis = () => {
    if (createdAt instanceof Timestamp) {
      return createdAt.toMillis();
    }
    if (typeof createdAt === "number") {
      return createdAt;
    }
    // Fallback for Date objects or invalid types
    return new Date("2020-01-01").getTime();
  };

  const timeAgo = formatDistanceToNow(getCreatedAtMillis(), {
    addSuffix: true,
  });

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        mb: 0.5,
        gap: 0.5,
        flexWrap: "wrap",
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          flexWrap: "wrap",
          flex: 1,
        }}
      >
        <Avatar sx={{ width: 20, height: 20, fontSize: "0.65rem" }}>
          {(authorId?.[0] || "?").toUpperCase()}
        </Avatar>
        <Typography
          variant="caption"
          color="text.secondary"
          fontWeight="600"
          sx={{ fontSize: "0.75rem" }}
        >
          {authorId || "Anonymous"}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontSize: "0.7rem" }}
        >
          • {timeAgo}
        </Typography>
        {isNSFW && (
          <Chip
            icon={<Warning sx={{ fontSize: 12 }} />}
            label="NSFW"
            size="small"
            color="error"
            sx={{
              height: 16,
              fontSize: "0.65rem",
              fontWeight: "bold",
              "& .MuiChip-label": { px: 0.5 },
            }}
          />
        )}
        {location && (
          <Chip
            icon={<Place sx={{ fontSize: 12 }} />}
            label={location.name || location.address.split(",")[0]}
            size="small"
            variant="outlined"
            sx={{
              height: 16,
              fontSize: "0.65rem",
              "& .MuiChip-label": { px: 0.5 },
              maxWidth: 120,
            }}
          />
        )}
      </Box>

      <ThreadMoreMenu
        threadId={threadId}
        threadTitle={threadTitle}
        authorId={authorId}
      />
    </Box>
  );
}
