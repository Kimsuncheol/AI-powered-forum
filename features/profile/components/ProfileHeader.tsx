import React from "react";
import { Box, Avatar, Typography, Chip, Skeleton, Paper } from "@mui/material";
import { UserProfile } from "../types";
import { User } from "firebase/auth";

interface ProfileHeaderProps {
  user: User | null; // Auth user
  profile: UserProfile | null; // Firestore profile (optional/extra data)
  loading: boolean;
}

export default function ProfileHeader({ user, profile, loading }: ProfileHeaderProps) {
  if (loading) {
    return (
      <Paper elevation={0} sx={{ p: 4, mb: 4, display: "flex", gap: 3, alignItems: "center", bgcolor: "background.default" }}>
        <Skeleton variant="circular" width={80} height={80} />
        <Box>
          <Skeleton variant="text" width={200} height={40} />
          <Skeleton variant="text" width={150} />
        </Box>
      </Paper>
    );
  }

  if (!user) return null;

  return (
    <Box sx={{ p: 4, mb: 4, display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 3, alignItems: "center", bgcolor: "background.paper", borderRadius: 2, boxShadow: 1 }}>
      <Avatar
        src={user.photoURL || undefined}
        alt={user.displayName || "User"}
        sx={{ width: 80, height: 80, fontSize: "2rem" }}
      >
        {user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
      </Avatar>
      
      <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
        <Typography variant="h4" fontWeight="bold">
          {user.displayName || "Anonymous User"}
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          {user.email}
        </Typography>
        
        <Box sx={{ mt: 1, display: "flex", gap: 1, justifyContent: { xs: "center", sm: "flex-start" } }}>
          <Chip label={profile?.role || "User"} color="primary" size="small" variant="outlined" />
          <Chip label={`Joined ${user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : "N/A"}`} size="small" variant="outlined" />
        </Box>
      </Box>
    </Box>
  );
}
