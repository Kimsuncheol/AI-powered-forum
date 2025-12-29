"use client";

import React from "react";
import { Container, Typography, Box, Divider } from "@mui/material";
import { InboxList } from "./InboxList";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

export function InboxPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <NotificationsActiveIcon color="primary" />
          <Typography variant="h4" component="h1" fontWeight="bold">
            Inbox
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Manage your follow requests and notifications
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Inbox List */}
      <InboxList />
    </Container>
  );
}
