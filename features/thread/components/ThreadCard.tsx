import React, { memo } from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  CardActionArea,
  Avatar,
  Stack,
} from "@mui/material";
import { Favorite, Comment } from "@mui/icons-material";
import { Thread } from "../types";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Timestamp } from "firebase/firestore";

interface ThreadCardProps {
  thread: Thread;
  onClick?: () => void;
}

function ThreadCard({ thread, onClick }: ThreadCardProps) {
  // Safe date handling
  const createdAtFn = () => {
    if (thread.createdAt instanceof Timestamp) {
      return thread.createdAt.toMillis();
    }
    // Fallback for types that might not be Firestore Timestamps (e.g. if mocked improperly)
    return Date.now();
  };

  const timeAgo = formatDistanceToNow(createdAtFn(), { addSuffix: true });

  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 2,
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 4,
        },
      }}
      onClick={onClick}
    >
      <CardActionArea component={Link} href={`/thread/${thread.id}`}>
        <CardContent>
          {/* Header: Author & Date */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 1.5, gap: 1 }}>
            <Avatar sx={{ width: 24, height: 24, fontSize: "0.75rem" }}>
              {(thread.authorId?.[0] || "?").toUpperCase()}
            </Avatar>
            <Typography variant="caption" color="text.secondary" fontWeight="bold">
              {thread.authorId || "Anonymous"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              • {timeAgo}
            </Typography>
          </Box>

          {/* Title */}
          <Typography variant="h6" component="h2" gutterBottom fontWeight="bold" sx={{ lineHeight: 1.3 }}>
            {thread.title}
          </Typography>

          {/* Snippet */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              mb: 2,
              minHeight: "1.5em", // Prevent layout shift if empty
            }}
          >
            {thread.body}
          </Typography>

          {/* Footer: Tags & Stats */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: "auto",
            }}
          >
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {(thread.tagIds || []).slice(0, 3).map((tag) => (
                <Chip
                  key={tag}
                  label={`#${tag}`}
                  size="small"
                  variant="outlined"
                  sx={{ 
                    borderRadius: 1, 
                    fontSize: "0.7rem", 
                    height: 20 
                  }}
                />
              ))}
              {(thread.tagIds?.length || 0) > 3 && (
                <Typography variant="caption" color="text.secondary">
                  +{thread.tagIds!.length - 3} more
                </Typography>
              )}
            </Box>

            {/* Mock Stats (since they are not in the core type yet) */}
            <Stack direction="row" spacing={2} color="text.secondary">
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Favorite fontSize="small" sx={{ fontSize: 16 }} color="disabled" />
                <Typography variant="caption">0</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Comment fontSize="small" sx={{ fontSize: 16 }} color="disabled" />
                <Typography variant="caption">0</Typography>
              </Box>
            </Stack>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default memo(ThreadCard);
