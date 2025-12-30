"use client";

import React from "react";
import { Box, IconButton, Button } from "@mui/material";
import Link from "next/link";
import { AddCircleOutlineOutlined, ChatBubbleOutline } from "@mui/icons-material";
import InboxRoundedIcon from "@mui/icons-material/InboxRounded";
import { useRouter } from "next/navigation";

interface UserActionsProps {
  isMobile: boolean;
}

export default function UserActions({ isMobile }: UserActionsProps) {
  const router = useRouter();

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <IconButton
        component={Link}
        href="/inbox"
        size="small"
        sx={{ p: 0.75 }}
      >
        <InboxRoundedIcon sx={{ fontSize: 20 }} />
      </IconButton>
      <IconButton
        onClick={() => router.push("/chat")}
        size="small"
        sx={{ p: 0.75 }}
        data-testid="chat-trigger-button"
      >
        <ChatBubbleOutline sx={{ fontSize: 20 }} />
      </IconButton>
      {isMobile ? (
        <IconButton
          component={Link}
          href="/threads/new"
          size="small"
          color="primary"
        >
          <AddCircleOutlineOutlined sx={{ fontSize: 24 }} />
        </IconButton>
      ) : (
        <Button
          component={Link}
          href="/threads/new"
          variant="outlined"
          color="primary"
          startIcon={<AddCircleOutlineOutlined sx={{ fontSize: 18 }} />}
          sx={{
            textTransform: "none",
            borderRadius: 20,
            fontSize: "0.875rem",
            px: 2,
            py: 0.5,
            fontWeight: 700,
          }}
        >
          Create
        </Button>
      )}
    </Box>
  );
}
