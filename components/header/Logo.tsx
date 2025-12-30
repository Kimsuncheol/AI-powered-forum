"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import Link from "next/link";

export default function Logo() {
  return (
    <Box
      component={Link}
      href="/"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        textDecoration: "none",
        color: "primary.main",
      }}
    >
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          bgcolor: "primary.main",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: "1.125rem",
          color: "white",
        }}
      >
        F
      </Box>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          fontSize: "1.25rem",
          display: { xs: "none", sm: "block" },
        }}
      >
        Forum
      </Typography>
    </Box>
  );
}
