"use client";

import React from "react";
import { Container, Box, Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useThreadFeed } from "../hooks/useThreadFeed";
import ThreadFeed from "./ThreadFeed";

export default function Dashboard() {
  const {
    threads,
    loading,
    loadingMore,
    error,
    hasMore,
    sortBy,
    setSortBy,
    loadMore,
    seedData,
  } = useThreadFeed();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Toolbar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Discussions
        </Typography>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value as "latest" | "popular")}
            >
              <MenuItem value="latest">Latest</MenuItem>
              <MenuItem value="popular">Popular</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Feed */}
      <ThreadFeed
        threads={threads}
        loading={loading}
        loadingMore={loadingMore}
        error={error}
        hasMore={hasMore}
        onLoadMore={loadMore}
        onSeedData={seedData}
      />
    </Container>
  );
}
