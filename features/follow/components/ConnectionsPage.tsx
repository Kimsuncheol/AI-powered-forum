"use client";

import React, { useState } from "react";
import {
  Box,
  Container,
  Tab,
  Tabs,
  TextField,
  InputAdornment,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { UserList } from "./UserList";
import { useFollowers } from "../hooks/useFollowers";
import { useFollowing } from "../hooks/useFollowing";
import { useRouter, useSearchParams } from "next/navigation";

interface ConnectionsPageProps {
  userId: string;
}

export function ConnectionsPage({ userId }: ConnectionsPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialType = searchParams.get("type") === "following" ? 1 : 0;

  const [tabValue, setTabValue] = useState(initialType);
  const [searchQuery, setSearchQuery] = useState("");

  const { followers, loading: followersLoading } = useFollowers(userId);
  const { following, loading: followingLoading } = useFollowing(userId);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setSearchQuery(""); // Clear search on tab switch
    // Optional: update URL
    const type = newValue === 0 ? "followers" : "following";
    router.replace(`/profile/connections?type=${type}`);
  };

  // Filter lists based on search
  const filteredFollowers = followers.filter((u) =>
    (u.displayName || "").toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredFollowing = following.filter((u) =>
    (u.displayName || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
        Connections
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="connections tabs">
          <Tab label={`Followers (${followers.length})`} />
          <Tab label={`Following (${following.length})`} />
        </Tabs>
      </Box>

      <TextField
        fullWidth
        placeholder="Search users..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
        variant="outlined"
        size="small"
      />

      {tabValue === 0 && (
        <UserList
          users={filteredFollowers}
          loading={followersLoading}
          emptyMessage={
            searchQuery ? "No followers match your search." : "No followers yet."
          }
        />
      )}

      {tabValue === 1 && (
        <UserList
          users={filteredFollowing}
          loading={followingLoading}
          emptyMessage={
            searchQuery
              ? "No following matches your search."
              : "Not following anyone yet."
          }
        />
      )}
    </Container>
  );
}
