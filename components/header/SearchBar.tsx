"use client";

import React from "react";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import { Search as SearchIcon, AutoAwesome as AutoAwesomeIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";

interface SearchBarProps {
  onClick: () => void;
}

export default function SearchBar({ onClick }: SearchBarProps) {
  const router = useRouter();

  const handleAiClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push("/answers");
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        bgcolor: "action.hover",
        px: 1.5,
        py: 0.5,
        borderRadius: 1,
        cursor: "pointer",
        width: { xs: "auto", sm: 240 },
        flexGrow: 1,
        maxWidth: 600,
        border: "1px solid",
        borderColor: "divider",
        transition: "border-color 0.2s, background-color 0.2s",
        "&:hover": {
          borderColor: "primary.main",
          bgcolor: "background.paper",
        },
      }}
      onClick={onClick}
    >
      <SearchIcon sx={{ color: "text.secondary", mr: 1, fontSize: 20 }} />
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ fontSize: "0.875rem", flexGrow: 1 }}
      >
        Search
      </Typography>
      <Tooltip title="Ask AI">
        <IconButton
          size="small"
          onClick={handleAiClick}
          sx={{
            ml: 1,
            color: "primary.main",
            "&:hover": { bgcolor: "primary.light", color: "white" },
          }}
        >
          <AutoAwesomeIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
