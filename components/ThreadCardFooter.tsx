import React from "react";
import { Box, Chip, Stack, Typography } from "@mui/material";
import { Favorite, Comment } from "@mui/icons-material";

interface ThreadCardFooterProps {
  tags: string[];
  likes: number;
  commentsCount: number;
}

export default function ThreadCardFooter({
  tags,
  likes,
  commentsCount,
}: ThreadCardFooterProps) {
  return (
    <Box
      sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
    >
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
        {tags.map((tag) => (
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
          <Typography variant="body2">{likes}</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Comment fontSize="small" color="action" />
          <Typography variant="body2">{commentsCount}</Typography>
        </Box>
      </Stack>
    </Box>
  );
}
