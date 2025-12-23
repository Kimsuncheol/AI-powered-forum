"use client";

import React from "react";
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Box,
} from "@mui/material";
import Link from "next/link";
import { FollowButton } from "./FollowButton";
import { UserProfile } from "@/features/profile/types";

interface UserListItemProps {
  user: UserProfile;
}

export function UserListItem({ user }: UserListItemProps) {
  return (
    <ListItem
      alignItems="center"
      sx={{
        px: 2,
        py: 1.5,
        borderBottom: "1px solid",
        borderColor: "divider",
        "&:last-child": {
          borderBottom: "none",
        },
      }}
    >
      <ListItemAvatar>
        <Link href={`/profile/${user.uid}`} style={{ textDecoration: "none" }}>
          <Avatar
            alt={user.displayName || "User"}
            src={user.photoURL || undefined}
            sx={{ width: 48, height: 48, mr: 1 }}
          >
            {user.displayName?.charAt(0).toUpperCase()}
          </Avatar>
        </Link>
      </ListItemAvatar>
      
      <ListItemText
        primary={
          <Link href={`/profile/${user.uid}`} style={{ textDecoration: "none", color: "inherit" }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {user.displayName || "Anonymous User"}
            </Typography>
          </Link>
        }
        secondary={
          user.bio && (
            <Typography
              variant="body2"
              color="text.secondary"
              noWrap
              sx={{ maxWidth: "300px" }}
            >
              {user.bio}
            </Typography>
          )
        }
      />

      <Box sx={{ ml: 2 }}>
        <FollowButton targetUserId={user.uid} />
      </Box>
    </ListItem>
  );
}
