import React from "react";
import { Typography } from "@mui/material";

interface ThreadCardContentProps {
  title: string;
  content: string;
}

export default function ThreadCardContent({
  title,
  content,
}: ThreadCardContentProps) {
  return (
    <>
      <Typography variant="h6" component="h2" gutterBottom fontWeight="bold">
        {title}
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
        {content}
      </Typography>
    </>
  );
}
