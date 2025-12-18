"use client";

import React, { useEffect } from "react";
import { Box, Typography, Stack, Skeleton, Card, CardContent } from "@mui/material";
import { useInfiniteCommentFeed } from "@/features/thread/hooks/useInfiniteCommentFeed";
import { Virtuoso } from "react-virtuoso";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface MyCommentsTabProps {
  uid: string;
}

export default function MyCommentsTab({ uid }: MyCommentsTabProps) {
  const {
    comments,
    loadingInitial,
    loadingMore,
    hasMore,
    loadInitial,
    loadMore,
  } = useInfiniteCommentFeed({
    filters: { authorId: uid },
  });

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  if (loadingInitial) {
    return (
      <Stack spacing={2} sx={{ mt: 2 }}>
        {[1, 2, 3].map((n) => (
          <Skeleton key={n} variant="rectangular" height={80} sx={{ borderRadius: 2 }} />
        ))}
      </Stack>
    );
  }

  if (comments.length === 0) {
    return (
      <Box sx={{ py: 8, textAlign: "center" }}>
        <Typography color="text.secondary">You haven&apos;t posted any comments yet.</Typography>
      </Box>
    );
  }

  return (
    <Virtuoso
      useWindowScroll
      data={comments}
      endReached={() => {
        if (hasMore && !loadingMore) {
          loadMore();
        }
      }}
      itemContent={(index, comment) => (
        <Box sx={{ pb: 2 }}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                On thread: <Link href={`/thread/${comment.threadId}`} style={{ color: 'inherit', textDecoration: 'underline' }}>{comment.threadId}</Link> • {formatDistanceToNow(comment.createdAt.toMillis(), { addSuffix: true })}
              </Typography>
              <Typography variant="body1">
                {comment.body}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      )}
      components={{
        Footer: () => hasMore ? (
          <Box sx={{ py: 2, display: "flex", justifyContent: "center" }}>
            <Skeleton variant="text" width={100} /> 
          </Box>
        ) : (
          <Box sx={{ py: 4, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">End of comments</Typography>
          </Box>
        )
      }}
    />
  );
}
