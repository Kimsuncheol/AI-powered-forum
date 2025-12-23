"use client";

import React from "react";
import { List, Typography, Box, CircularProgress } from "@mui/material";
import { UserListItem } from "./UserListItem";
import { UserProfile } from "@/features/profile/types";

interface UserListProps {
  users: UserProfile[];
  loading: boolean;
  emptyMessage?: string;
}

export function UserList({
  users,
  loading,
  emptyMessage = "No users found.",
}: UserListProps) {
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (users.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          {emptyMessage}
        </Typography>
      </Box>
    );
  }

  return (
    <List disablePadding>
      {users.map((user) => (
        <UserListItem key={user.uid} user={user} />
      ))}
    </List>
  );
}
