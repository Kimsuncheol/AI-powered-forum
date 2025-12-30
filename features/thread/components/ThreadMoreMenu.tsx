"use client";

import React, { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import MoreVertSharpIcon from "@mui/icons-material/MoreVertSharp";
import BookmarkSharpIcon from "@mui/icons-material/BookmarkSharp";
import BookmarkBorderSharpIcon from "@mui/icons-material/BookmarkBorderSharp";
import { Send, ContentCopy } from "@mui/icons-material";
import { useBookmark } from "@/features/collections";
import { useAuth } from "@/context/AuthContext";
import ForwardToChatModal from "./ForwardToChatModal";
import { toast } from "react-toastify";

interface ThreadMoreMenuProps {
  threadId: string;
  threadTitle: string;
  authorId: string;
}

export default function ThreadMoreMenu({
  threadId,
  threadTitle,
  authorId,
}: ThreadMoreMenuProps) {
  const { user } = useAuth();
  const { isBookmarked, isLoading: bookmarkLoading, toggleBookmark } = useBookmark(
    threadId,
    {
      threadTitle,
      threadAuthorId: authorId,
    }
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [forwardModalOpen, setForwardModalOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");


  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleBookmark = async () => {
    if (!user) {
      toast.error("Please sign in to save threads");
      handleClose();
      return;
    }

    await toggleBookmark();
    toast.success(isBookmarked ? "Removed from saved" : "Saved to collection");
    handleClose();
  };

  const handleForward = () => {
    if (!user) {
      toast.error("Please sign in to forward threads");
      handleClose();
      return;
    }

    setForwardModalOpen(true);
    handleClose();
  };

  const handleCopy = () => {
    const url = `${window.location.origin}/thread/${threadId}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Link copied to clipboard");
    });
    handleClose();
  };

  const handleForwardSuccess = () => {
    toast.success("Thread forwarded successfully");
    handleClose();
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{ p: 0.5 }}
        aria-label="More options"
      >
        <MoreVertSharpIcon sx={{ fontSize: 18 }} />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={(e) => e.stopPropagation()}
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
        <MenuItem onClick={handleBookmark} disabled={bookmarkLoading}>
          <ListItemIcon>
            {bookmarkLoading ? (
              <CircularProgress size={18} />
            ) : isBookmarked ? (
              <BookmarkSharpIcon fontSize="small" color="primary" />
            ) : (
              <BookmarkBorderSharpIcon fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText>{isBookmarked ? "Saved" : "Save"}</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleForward}>
          <ListItemIcon>
            <Send fontSize="small" />
          </ListItemIcon>
          <ListItemText>Forward to Chat</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleCopy}>
          <ListItemIcon>
            <ContentCopy fontSize="small" />
          </ListItemIcon>
          <ListItemText>Copy Link</ListItemText>
        </MenuItem>
      </Menu>

      <ForwardToChatModal
        open={forwardModalOpen}
        onClose={() => setForwardModalOpen(false)}
        threadId={threadId}
        threadTitle={threadTitle}
        onSuccess={handleForwardSuccess}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </>
  );
}
