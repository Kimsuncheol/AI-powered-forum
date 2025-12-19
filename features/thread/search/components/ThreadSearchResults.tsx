"use client";

import { Box, Button, Alert, Skeleton, Stack, Typography } from "@mui/material";
import ThreadCard from "../../components/ThreadCard";
import { useThreadSearch } from "../hooks/useThreadSearch";

interface ThreadSearchResultsProps {
  query: string;
  pageSize?: number;
}

const SKELETON_COUNT = 3;

export function ThreadSearchResults({
  query,
  pageSize = 12,
}: ThreadSearchResultsProps) {
  const { threads, loading, error, hasMore, loadMore } = useThreadSearch(
    query,
    pageSize
  );

  const showPrompt = !query.trim() && !loading;
  const showEmpty = !loading && !error && !!query.trim() && threads.length === 0;

  return (
    <Stack spacing={2}>
      {showPrompt && (
        <Alert severity="info">Type a keyword to search threads.</Alert>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {loading && (
        <Stack spacing={2}>
          {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
            <Box key={`thread-search-skeleton-${index}`}>
              <Skeleton variant="rectangular" height={120} />
            </Box>
          ))}
        </Stack>
      )}

      {showEmpty && (
        <Alert severity="warning">
          No threads matched &quot;{query.trim()}&quot;.
        </Alert>
      )}

      {!loading && !error && threads.length > 0 && (
        <Stack spacing={2}>
          {threads.map((thread) => (
            <ThreadCard key={thread.id} thread={thread} />
          ))}
        </Stack>
      )}

      {hasMore && !loading && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button variant="outlined" onClick={loadMore}>
            Load more
          </Button>
        </Box>
      )}

      {!loading && !error && threads.length > 0 && !hasMore && (
        <Typography variant="caption" color="text.secondary" textAlign="center">
          End of results
        </Typography>
      )}
    </Stack>
  );
}
