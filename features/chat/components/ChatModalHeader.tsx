import React from "react";
import { Box, Typography } from "@mui/material";

interface ChatModalHeaderProps {
  title: React.ReactNode;
  startAction?: React.ReactNode;
  endAction?: React.ReactNode;
}

export function ChatModalHeader({
  title,
  startAction,
  endAction,
}: ChatModalHeaderProps) {
  return (
    <Box
      sx={{
        p: 2,
        borderBottom: 1,
        borderColor: "divider",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        bgcolor: "background.paper",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {startAction}
        {typeof title === "string" ? (
          <Typography variant="h6" fontWeight={700}>
            {title}
          </Typography>
        ) : (
          title
        )}
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {endAction}
      </Box>
    </Box>
  );
}
