import React from "react";
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
import { Thread } from "@/lib/db/threads";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface ThreadCardProps {
  thread: Thread;
}

export default function ThreadCard({ thread }: ThreadCardProps) {
  return (
    <Card
      elevation={2}
      sx={{
        mb: 2,
        borderRadius: 2,
        transition: "transform 0.2s",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 4,
        },
      }}
    >
      <CardActionArea component={Link} href={`/thread/${thread.id}`}>
        <CardContent>
          {/* Header: Author & Date */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 1, gap: 1 }}>
            <Avatar
              sx={{ width: 24, height: 24, fontSize: "0.75rem" }}
            >
              {thread.authorName[0].toUpperCase()}
            </Avatar>
            <Typography variant="caption" color="text.secondary" fontWeight="bold">
              {thread.authorName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              • {formatDistanceToNow(thread.createdAt)} ago
            </Typography>
          </Box>

          {/* Title & Content */}
          <Typography variant="h6" component="h2" gutterBottom fontWeight="bold">
            {thread.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              mb: 2,
            }}
          >
            {thread.content}
          </Typography>

          {/* Footer: Tags & Stats */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {thread.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={`#${tag}`}
                  size="small"
                  variant="outlined"
                  sx={{ borderRadius: 1 }}
                />
              ))}
            </Box>

            <Stack direction="row" spacing={2} color="text.secondary">
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Favorite fontSize="small" color="action" />
                <Typography variant="body2">{thread.likes}</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Comment fontSize="small" color="action" />
                <Typography variant="body2">{thread.commentsCount}</Typography>
              </Box>
            </Stack>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
