"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Alert,
  Skeleton,
  Stack,
  Button,
  Tabs,
  Tab,
} from "@mui/material";
import { Refresh, Public, PeopleAlt } from "@mui/icons-material";
import VirtualThreadFeed from "./VirtualThreadFeed";
import { useInfiniteThreadFeed } from "@/features/thread/hooks/useInfiniteThreadFeed";
import { FollowingFeed } from "@/features/follow";
import { useAuth } from "@/context/AuthContext";
import { threadService } from "../api/thread.service";

type FeedTab = "global" | "following";

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<FeedTab>("global");

  const {
    threads,
    loadingInitial,
    loadingMore,
    error,
    hasMore,
    loadInitial,
    loadMore,
  } = useInfiniteThreadFeed();

  // Load initial data on mount and when switching to global tab
  useEffect(() => {
    if (activeTab === "global") {
      loadInitial();
    }
  }, [activeTab, loadInitial]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: FeedTab) => {
    setActiveTab(newValue);
  };

  // Handle manual seeding (for demo purposes)
  const handleSeedData = async () => {
    await threadService.seedData();
    loadInitial();
  };

  return (
    <Container sx={{ py: 2, height: "100vh", overflowY: "auto" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Discussions
      </Typography>

      {/* Feed Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="Feed tabs"
        >
          <Tab
            icon={<Public />}
            iconPosition="start"
            label="Global"
            value="global"
            sx={{ textTransform: "none" }}
          />
          <Tab
            icon={<PeopleAlt />}
            iconPosition="start"
            label="Following"
            value="following"
            disabled={!user}
            sx={{ textTransform: "none" }}
          />
        </Tabs>
      </Box>

      {/* Global Feed */}
      {activeTab === "global" && (
        <>
          {/* Error State */}
          {error && (
            <Alert
              severity="error"
              sx={{ mb: 2 }}
              action={
                <Button color="inherit" size="small" onClick={() => loadInitial()}>
                  Retry
                </Button>
              }
            >
              {error}
            </Alert>
          )}

          {/* Empty State */}
          {!loadingInitial && !error && threads.length === 0 && (
            <Box
              sx={{
                textAlign: "center",
                py: 8,
                backgroundColor: "background.paper",
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No threads found.
              </Typography>
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={handleSeedData}
                sx={{ mt: 2 }}
              >
                Seed Sample Data
              </Button>
            </Box>
          )}

          {/* Thread List (Virtualized) */}
          {!loadingInitial && threads.length > 0 && (
            <VirtualThreadFeed
              threads={threads}
              hasMore={hasMore}
              loading={loadingMore}
              onLoadMore={loadMore}
            />
          )}

          {/* Loading Skeletons (Initial Only) */}
          {loadingInitial && (
            <Stack spacing={2}>
              {[1, 2, 3].map((n) => (
                <Skeleton
                  key={n}
                  variant="rectangular"
                  height={160}
                  sx={{ borderRadius: 2 }}
                />
              ))}
            </Stack>
          )}
        </>
      )}

      {/* Following Feed */}
      {activeTab === "following" && <FollowingFeed />}
    </Container>
  );
}
