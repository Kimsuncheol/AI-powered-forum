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
        position: 'relative',
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        px: 2,
        py: 1,
        borderRadius: 3,
        cursor: "pointer",
        width: { xs: "auto", sm: 260 },
        flexGrow: 1,
        maxWidth: 640,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          borderColor: "primary.main",
          boxShadow: "0 4px 16px rgba(33, 150, 243, 0.15)",
          background: "linear-gradient(135deg, rgba(33, 150, 243, 0.08) 0%, rgba(33, 150, 243, 0.04) 100%)",
          transform: "translateY(-1px)",
        },
        "&:active": {
          transform: "translateY(0)",
        },
      }}
      onClick={onClick}
    >
      <SearchIcon 
        sx={{ 
          color: "text.secondary", 
          mr: 1.5, 
          fontSize: 22,
          transition: "color 0.3s",
          ".MuiBox-root:hover &": {
            color: "primary.main",
          }
        }} 
      />
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ 
          fontSize: "0.9rem", 
          flexGrow: 1,
          fontWeight: 400,
          letterSpacing: "0.01em",
        }}
      >
        Search threads...
      </Typography>
      <Tooltip 
        title="Ask Community AI" 
        arrow
        placement="bottom"
      >
        <IconButton
          size="small"
          onClick={handleAiClick}
          sx={{
            ml: 1,
            bgcolor: "primary.main",            color: "white",
            boxShadow: "0 2px 8px rgba(33, 150, 243, 0.3)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": { 
              bgcolor: "primary.main",
              boxShadow: "0 4px 12px rgba(33, 150, 243, 0.4)",
              transform: "scale(1.05) rotate(5deg)",
            },
            "&:active": {
              transform: "scale(0.98)",
            }
          }}
        >
          <AutoAwesomeIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
