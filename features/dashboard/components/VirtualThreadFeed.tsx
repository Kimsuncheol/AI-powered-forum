"use client";

import React from "react";
import { Virtuoso } from "react-virtuoso";
import { Box, CircularProgress, Typography } from "@mui/material";
import ThreadItem from "./ThreadItem";
import { Thread } from "@/features/thread/types";

interface VirtualThreadFeedProps {
  threads: Thread[];
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
}

export default function VirtualThreadFeed({
  threads,
  hasMore,
  loading,
  onLoadMore,
}: VirtualThreadFeedProps) {
  // Footer content for the virtual list (loader)
  const Footer = () => {
    if (!hasMore) {
      return (
        <Box sx={{ py: 4, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            No more threads.
          </Typography>
        </Box>
      );
    }
    return (
      <Box sx={{ py: 4, display: "flex", justifyContent: "center" }}>
        {loading && <CircularProgress size={24} />}
      </Box>
    );
  };

  return (
    <Virtuoso
      useWindowScroll
      data={threads}
      endReached={() => {
        if (hasMore && !loading) {
          onLoadMore();
        }
      }}
      itemContent={(index, thread) => (
        <Box sx={{ pb: 2 }}>{/* Box wrapper for margin handling in virtual lists */}
          <ThreadItem thread={thread} />
        </Box>
      )}
      components={{
        Footer: Footer,
      }}
    />
  );
}
