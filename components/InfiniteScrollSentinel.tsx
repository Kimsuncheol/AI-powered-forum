"use client";

import React, { useEffect, useRef } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

interface InfiniteScrollSentinelProps {
  onLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
  disabled?: boolean; // Optional override to pause scrolling
}

export default function InfiniteScrollSentinel({
  onLoadMore,
  hasMore,
  loading,
  disabled = false,
}: InfiniteScrollSentinelProps) {
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = observerTarget.current;
    if (!element || !hasMore || loading || disabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
            onLoadMore();
        }
      },
      { threshold: 0.1, rootMargin: "100px" } // Load slightly before reaching bottom
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, loading, disabled, onLoadMore]);

  if (!hasMore) {
    return (
      <Box sx={{ py: 4, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          No more threads to load.
        </Typography>
      </Box>
    );
  }

  return (
    <Box ref={observerTarget} sx={{ py: 4, display: "flex", justifyContent: "center" }}>
      {loading && <CircularProgress size={24} />}
    </Box>
  );
}
