"use client";

import React, { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckIcon from "@mui/icons-material/Check";
import { useFollowRequest } from "../hooks/useFollowRequest";
import { useAuth } from "@/context/AuthContext";
import { useFollow } from "../hooks/useFollow"; // Keep for unfollowing accepted follows

interface FollowButtonProps {
  targetUserId: string;
  variant?: "contained" | "outlined" | "text";
  size?: "small" | "medium" | "large";
}

export function FollowButton({
  targetUserId,
  variant = "outlined",
  size = "small",
}: FollowButtonProps) {
  const { user } = useAuth();
  const { status, loading: reqLoading, sendRequest, cancelRequest } = useFollowRequest(targetUserId);
  const { unfollow, loading: followLoading } = useFollow(targetUserId); // Use existing hook for unfollow
  const [hovering, setHovering] = useState(false);

  // Don't show for self or when not logged in
  if (!user || user.uid === targetUserId) {
    return null;
  }

  const loading = reqLoading || followLoading;

  if (status === "following") {
    return (
      <Button
        variant="outlined"
        size={size}
        onClick={unfollow} // Unfollow is immediate
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        disabled={loading}
        startIcon={
          loading ? (
            <CircularProgress size={16} />
          ) : hovering ? (
            <PersonRemoveIcon />
          ) : (
            <CheckIcon />
          )
        }
        color="inherit"
        sx={{ textTransform: "none" }}
      >
        {hovering ? "Unfollow" : "Following"}
      </Button>
    );
  }

  if (status === "pending") {
    return (
      <Button
        variant="outlined"
        size={size}
        onClick={cancelRequest}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={16} /> : <AccessTimeIcon />}
        color="secondary"
        sx={{ textTransform: "none" }}
      >
        Requested
      </Button>
    );
  }

  // Status is "none" or declined (treat as none)
  return (
    <Button
      variant={variant}
      size={size}
      onClick={sendRequest}
      disabled={loading}
      startIcon={loading ? <CircularProgress size={16} /> : <PersonAddIcon />}
      color="primary"
      sx={{ textTransform: "none" }}
    >
      Follow
    </Button>
  );
}
