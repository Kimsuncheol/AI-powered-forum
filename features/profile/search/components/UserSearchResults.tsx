"use client";

import { Alert, Box, Button, Skeleton, Stack, Typography } from "@mui/material";
import { useUserSearch } from "../hooks/useUserSearch";
import { UserCard } from "@/features/search/components/UserCard";

interface UserSearchResultsProps {
  query: string;
  pageSize?: number;
}

const SKELETON_COUNT = 3;

export function UserSearchResults({
  query,
  pageSize = 12,
}: UserSearchResultsProps) {
  const { users, loading, error, hasMore, loadMore } = useUserSearch(
    query,
    pageSize
  );

  const showPrompt = !query.trim() && !loading;
  const showEmpty = !loading && !error && !!query.trim() && users.length === 0;

  return (
    <Stack spacing={2}>
      {showPrompt && <Alert severity="info">Type a name to search users.</Alert>}

      {error && <Alert severity="error">{error}</Alert>}

      {loading && (
        <Stack spacing={2}>
          {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
            <Box key={`user-search-skeleton-${index}`}>
              <Skeleton variant="rectangular" height={88} />
            </Box>
          ))}
        </Stack>
      )}

      {showEmpty && (
        <Alert severity="warning">
          No users matched &quot;{query.trim()}&quot;.
        </Alert>
      )}

      {!loading && !error && users.length > 0 && (
        <Stack spacing={2}>
          {users.map((user) => (
            <UserCard key={user.uid} user={user} />
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

      {!loading && !error && users.length > 0 && !hasMore && (
        <Typography variant="caption" color="text.secondary" textAlign="center">
          End of results
        </Typography>
      )}
    </Stack>
  );
}
