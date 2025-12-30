"use client";

import React from "react";
import { Button } from "@mui/material";

interface AuthButtonsProps {
  onOpenSignIn: () => void;
}

export default function AuthButtons({ onOpenSignIn }: AuthButtonsProps) {
  return (
    <Button
      color="primary"
      variant="contained"
      onClick={onOpenSignIn}
      sx={{
        textTransform: "none",
        borderRadius: 20,
        px: 3,
        py: 0.5,
        fontSize: "0.875rem",
        fontWeight: 700,
      }}
    >
      Log In
    </Button>
  );
}
