"use client";

import React from "react";
import { Menu, MenuItem, ListItemIcon, ListItemText, Divider } from "@mui/material";
import { Send, ContentCopy } from "@mui/icons-material";

interface ThreadActionsMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onForwardToChat: () => void;
  onCopy: () => void;
}

export default function ThreadActionsMenu({
  anchorEl,
  open,
  onClose,
  onForwardToChat,
  onCopy,
}: ThreadActionsMenuProps) {
  const handleForwardToChat = () => {
    onForwardToChat();
    onClose();
  };

  const handleCopy = () => {
    onCopy();
    onClose();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      slotProps={{
        paper: {
          sx: {
            minWidth: 180,
            boxShadow: 3,
          },
        },
      }}
    >
      <MenuItem onClick={handleForwardToChat}>
        <ListItemIcon>
          <Send fontSize="small" />
        </ListItemIcon>
        <ListItemText>Forward to Chat</ListItemText>
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleCopy}>
        <ListItemIcon>
          <ContentCopy fontSize="small" />
        </ListItemIcon>
        <ListItemText>Copy Link</ListItemText>
      </MenuItem>
    </Menu>
  );
}
