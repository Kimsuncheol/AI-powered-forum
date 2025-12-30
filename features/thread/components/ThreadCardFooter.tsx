import React from "react";
import { Box, Chip, Typography } from "@mui/material";

interface ThreadCardFooterProps {
  tagIds: string[];
  children: React.ReactNode;
}

export default function ThreadCardFooter({
  tagIds,
  children,
}: ThreadCardFooterProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 0.5,
          alignItems: "center",
        }}
      >
        {(tagIds || []).slice(0, 3).map((tag) => (
          <Chip
            key={tag}
            label={`#${tag}`}
            size="small"
            variant="outlined"
            sx={{
              borderRadius: 2,
              fontSize: "0.65rem",
              height: 18,
              cursor: "pointer",
              "& .MuiChip-label": { px: 0.75 },
            }}
            onClick={(e) => {
              e.stopPropagation(); /* TODO: Navigate to tag search */
            }}
          />
        ))}
        {(tagIds?.length || 0) > 3 && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: "0.65rem" }}
          >
            +{tagIds!.length - 3}
          </Typography>
        )}
      </Box>

      {/* Actions slot */}
      {children}
    </Box>
  );
}
