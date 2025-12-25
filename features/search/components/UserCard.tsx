"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Stack,
  Box,
  Button,
  CircularProgress,
} from "@mui/material";
import { UserProfile } from "../types";
import { useFollowRelationship } from "@/features/follow/hooks/useFollowRelationship";
import { useAuth } from "@/context/AuthContext";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckIcon from "@mui/icons-material/Check";

interface UserCardProps {
  user: UserProfile;
}

export function UserCard({ user }: UserCardProps) {
  const { user: viewer } = useAuth();
  const { status, loading, requestFollow, cancelRequest, unfollow } =
    useFollowRelationship(viewer?.uid, user.uid);
  const [hovering, setHovering] = useState(false);

  const actionButton = () => {
    if (!viewer || status === "SELF") {
      return null;
    }

    if (status === "FOLLOWING") {
      return (
        <Button
          variant="outlined"
          size="small"
          onClick={unfollow}
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

    if (status === "REQUESTED") {
      return (
        <Button
          variant="outlined"
          size="small"
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

    return (
      <Button
        variant="outlined"
        size="small"
        onClick={requestFollow}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={16} /> : <PersonAddIcon />}
        color="primary"
        sx={{ textTransform: "none" }}
      >
        Follow
      </Button>
    );
  };

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            src={user.photoURL || undefined}
            alt={user.displayName || user.email || undefined}
            sx={{ width: 56, height: 56 }}
          >
            {(user.displayName || user.email || "?")[0].toUpperCase()}
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" noWrap>
              {user.displayName || user.email}
            </Typography>
            {user.bio && (
              <Typography variant="body2" color="text.secondary" noWrap>
                {user.bio}
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary">
              {user.email}
            </Typography>
          </Box>

          {actionButton()}
        </Stack>
      </CardContent>
    </Card>
  );
}
