"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Tabs,
  Tab,
  Box,
  Alert,
  Typography,
  Avatar,
  Chip,
  Paper,
  Skeleton,
  Button,
} from "@mui/material";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/features/profile/hooks/useUserProfile";
import { useFollowRelationship } from "@/features/follow/hooks/useFollowRelationship";
import MyThreadsTab from "@/features/profile/components/tabs/MyThreadsTab";
import MyCommentsTab from "@/features/profile/components/tabs/MyCommentsTab";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`user-profile-tabpanel-${index}`}
      aria-labelledby={`user-profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const { profile, loading, error } = useUserProfile(id);
  const [tabValue, setTabValue] = useState(0);

  // Follow relationship hook
  const {
    status: followStatus,
    loading: followLoading,
    requestFollow,
    cancelRequest,
    unfollow,
  } = useFollowRelationship(currentUser?.uid || null, id);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleFollowAction = () => {
    if (followStatus === "NONE") {
      requestFollow();
    } else if (followStatus === "REQUESTED") {
      cancelRequest();
    } else if (followStatus === "FOLLOWING") {
      unfollow();
    }
  };

  const getFollowButtonText = () => {
    switch (followStatus) {
      case "FOLLOWING":
        return "Following";
      case "REQUESTED":
        return "Requested";
      default:
        return "Follow";
    }
  };

  const isOwnProfile = currentUser?.uid === id;

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={0} sx={{ p: 4, mb: 4, display: "flex", gap: 3, alignItems: "center", bgcolor: "background.default" }}>
          <Skeleton variant="circular" width={80} height={80} />
          <Box>
            <Skeleton variant="text" width={200} height={40} />
            <Skeleton variant="text" width={150} />
          </Box>
        </Paper>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">User not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Profile Header */}
      <Box
        sx={{
          p: 4,
          mb: 4,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 3,
          alignItems: "center",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <Avatar
          src={profile.photoURL || undefined}
          alt={profile.displayName || "User"}
          sx={{ width: 80, height: 80, fontSize: "2rem" }}
        >
          {profile.displayName?.[0]?.toUpperCase() || profile.email?.[0]?.toUpperCase()}
        </Avatar>

        <Box sx={{ textAlign: { xs: "center", sm: "left" }, flex: 1 }}>
          <Typography variant="h4" fontWeight="bold">
            {profile.displayName || "Anonymous User"}
          </Typography>
          {profile.bio && (
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
              {profile.bio}
            </Typography>
          )}

          <Box sx={{ mt: 1, display: "flex", gap: 1, justifyContent: { xs: "center", sm: "flex-start" } }}>
            <Chip label={profile.role || "User"} color="primary" size="small" variant="outlined" />
            <Chip
              label={`Joined ${new Date(profile.createdAt).toLocaleDateString()}`}
              size="small"
              variant="outlined"
            />
          </Box>

          <Box sx={{ mt: 2, display: "flex", gap: 3, justifyContent: { xs: "center", sm: "flex-start" } }}>
            <Typography variant="body2">
              <strong>{profile.followingCount || 0}</strong> Following
            </Typography>
            <Typography variant="body2">
              <strong>{profile.followersCount || 0}</strong> Followers
            </Typography>
          </Box>
        </Box>

        {/* Follow Button (only show for other users) */}
        {currentUser && !isOwnProfile && (
          <Button
            variant={followStatus === "FOLLOWING" ? "outlined" : "contained"}
            color={followStatus === "REQUESTED" ? "warning" : "primary"}
            onClick={handleFollowAction}
            disabled={followLoading}
            sx={{ textTransform: "none", minWidth: 100 }}
          >
            {getFollowButtonText()}
          </Button>
        )}
      </Box>

      {/* Tabs for Threads and Comments */}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="user profile tabs">
          <Tab label="Threads" />
          <Tab label="Comments" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <MyThreadsTab uid={id} />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <MyCommentsTab uid={id} />
      </TabPanel>
    </Container>
  );
}
