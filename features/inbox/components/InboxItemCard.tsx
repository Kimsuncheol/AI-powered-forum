"use client";

import React from "react";
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Button,
  Stack,
  Box,
  Chip,
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import { Timestamp } from "firebase/firestore";
import { InboxItem } from "../types";

interface InboxItemCardProps {
  item: InboxItem;
  onAccept: (item: InboxItem) => void;
  onDecline: (item: InboxItem) => void;
  loading?: boolean;
}

export function InboxItemCard({
  item,
  onAccept,
  onDecline,
  loading = false,
}: InboxItemCardProps) {
  const timeAgo =
    item.createdAt instanceof Timestamp
      ? formatDistanceToNow(item.createdAt.toDate(), { addSuffix: true })
      : "just now";

  // Display name: use enriched data or fallback to UID
  const displayName = item.requesterName || item.fromUid.slice(0, 8) + "...";
  const avatarLetter = (item.requesterName || item.fromUid)[0].toUpperCase();

  return (
    <Card 
      variant="outlined" 
      sx={{ 
        mb: 2,
        transition: "box-shadow 0.2s",
        "&:hover": { boxShadow: 2 },
      }}
    >
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          {/* Avatar */}
          <Avatar 
            src={item.requesterAvatar} 
            alt={displayName}
            sx={{ width: 48, height: 48 }}
          >
            {avatarLetter}
          </Avatar>

          {/* Content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
              <Typography variant="subtitle1" fontWeight="bold" noWrap>
                {displayName}
              </Typography>
              <Chip 
                label="Follow Request" 
                size="small" 
                color="primary" 
                variant="outlined"
              />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              wants to follow you • {timeAgo}
            </Typography>
          </Box>

          {/* Actions */}
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => onAccept(item)}
              disabled={loading}
              sx={{ textTransform: "none" }}
            >
              Accept
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => onDecline(item)}
              disabled={loading}
              sx={{ textTransform: "none" }}
            >
              Decline
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
