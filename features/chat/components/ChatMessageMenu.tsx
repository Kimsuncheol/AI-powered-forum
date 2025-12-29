"use client";

import React from "react";
import {
  Popover,
  Box,
  IconButton,
  Tooltip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ForwardIcon from "@mui/icons-material/Forward";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

interface ChatMessageMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onForward?: () => void;
  onCopy?: () => void;
  onReaction?: (emoji: string) => void;
  isOwnMessage?: boolean;
}

const REACTION_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

export function ChatMessageMenu({
  anchorEl,
  open,
  onClose,
  onEdit,
  onDelete,
  onForward,
  onCopy,
  onReaction,
  isOwnMessage = false,
}: ChatMessageMenuProps) {
  const handleReaction = (emoji: string) => {
    onReaction?.(emoji);
    onClose();
  };

  const handleEdit = () => {
    onEdit?.();
    onClose();
  };

  const handleDelete = () => {
    onDelete?.();
    onClose();
  };

  const handleForward = () => {
    onForward?.();
    onClose();
  };

  const handleCopy = () => {
    onCopy?.();
    onClose();
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "center",
        horizontal: isOwnMessage ? "left" : "right",
      }}
      transformOrigin={{
        vertical: "center",
        horizontal: isOwnMessage ? "right" : "left",
      }}
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            boxShadow: 3,
            overflow: "visible",
          },
        },
      }}
    >
      <Box sx={{ p: 1 }}>
        {/* Reactions Row */}
        <Stack direction="row" spacing={0.5} sx={{ mb: 1 }}>
          {REACTION_EMOJIS.map((emoji) => (
            <Tooltip key={emoji} title={`React with ${emoji}`}>
              <IconButton
                size="small"
                onClick={() => handleReaction(emoji)}
                sx={{
                  fontSize: "1.25rem",
                  "&:hover": { transform: "scale(1.2)" },
                  transition: "transform 0.2s",
                }}
              >
                {emoji}
              </IconButton>
            </Tooltip>
          ))}
        </Stack>

        <Divider sx={{ my: 0.5 }} />

        {/* Action Buttons */}
        <Stack spacing={0.5} sx={{ minWidth: 150 }}>
          {isOwnMessage && onEdit && (
            <Box
              onClick={handleEdit}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 1,
                borderRadius: 1,
                cursor: "pointer",
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              <EditIcon fontSize="small" />
              <Typography variant="body2">Edit</Typography>
            </Box>
          )}

          {isOwnMessage && onDelete && (
            <Box
              onClick={handleDelete}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 1,
                borderRadius: 1,
                cursor: "pointer",
                color: "error.main",
                "&:hover": { bgcolor: "error.lighter", color: "error.dark" },
              }}
            >
              <DeleteIcon fontSize="small" />
              <Typography variant="body2">Delete</Typography>
            </Box>
          )}

          {onForward && (
            <Box
              onClick={handleForward}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 1,
                borderRadius: 1,
                cursor: "pointer",
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              <ForwardIcon fontSize="small" />
              <Typography variant="body2">Forward</Typography>
            </Box>
          )}

          {onCopy && (
            <Box
              onClick={handleCopy}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 1,
                borderRadius: 1,
                cursor: "pointer",
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              <ContentCopyIcon fontSize="small" />
              <Typography variant="body2">Copy</Typography>
            </Box>
          )}
        </Stack>
      </Box>
    </Popover>
  );
}
