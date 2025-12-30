import React from "react";
import { Box, Button } from "@mui/material";
import { Visibility } from "@mui/icons-material";

interface NSFWOverlayProps {
  shouldBlur: boolean;
  onReveal: (e: React.MouseEvent) => void;
  children: React.ReactNode;
}

export default function NSFWOverlay({
  shouldBlur,
  onReveal,
  children,
}: NSFWOverlayProps) {
  return (
    <Box sx={{ position: "relative" }}>
      {shouldBlur && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            bgcolor: "rgba(0, 0, 0, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
            borderRadius: 1,
            minHeight: 100,
          }}
        >
          <Button
            variant="contained"
            startIcon={<Visibility />}
            onClick={onReveal}
            sx={{ textTransform: "none" }}
          >
            Reveal NSFW Content
          </Button>
        </Box>
      )}
      <Box
        sx={{
          filter: shouldBlur ? "blur(10px)" : "none",
          pointerEvents: shouldBlur ? "none" : "auto",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
