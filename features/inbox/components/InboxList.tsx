"use client";

import React from "react";
import {
  Box,
  List,
  ListItem,
  Typography,
  Alert,
  Skeleton,
} from "@mui/material";
import { useInbox } from "../hooks/useInbox";
import { InboxItemCard } from "./InboxItemCard";
import InboxIcon from "@mui/icons-material/Inbox";

export function InboxList() {
  const { items, loading, error, accept, decline } = useInbox();

  // Loading skeleton
  if (loading && items.length === 0) {
    return (
      <Box>
        {[1, 2, 3].map((i) => (
          <Box key={i} sx={{ mb: 2 }}>
            <Skeleton variant="rounded" height={80} />
          </Box>
        ))}
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  // Empty state
  if (items.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 8,
          color: "text.secondary",
        }}
      >
        <InboxIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
        <Typography variant="h6" gutterBottom>
          All caught up!
        </Typography>
        <Typography variant="body2">
          No pending follow requests.
        </Typography>
      </Box>
    );
  }

  // List of items
  return (
    <List disablePadding>
      {items.map((item) => (
        <ListItem key={item.id} disablePadding sx={{ display: "block" }}>
          <InboxItemCard
            item={item}
            onAccept={accept}
            onDecline={decline}
            loading={loading}
          />
        </ListItem>
      ))}
    </List>
  );
}
