"use client";

import { Box, Typography } from "@mui/material";

export const AnswerSuggestions = () => {
  return (
    <Box sx={{ textAlign: 'center', mt: 8, opacity: 0.6 }}>
      <Typography variant="body2" color="text.secondary">
        Try asking about &quot;community rules&quot;, &quot;popular topics&quot;, or technical questions discussed in the forum.
      </Typography>
    </Box>
  );
};
