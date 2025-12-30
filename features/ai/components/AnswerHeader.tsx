"use client";

import { Box, Typography } from "@mui/material";
import { AutoAwesome } from "@mui/icons-material";

export const AnswerHeader = () => {
  return (
    <Box sx={{ textAlign: 'center', mb: 6, height: '50%' }}>
      <Box sx={{ height: '80%' }} />
      <Typography 
        variant="h3" 
        fontWeight="800" 
        gutterBottom 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: 2, 
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', 
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent' 
        }}
      >
        <AutoAwesome color="primary" sx={{ color: '#2196F3' }} fontSize="inherit" />
        Ask Community AI
      </Typography>
      <Typography variant="h6" color="text.secondary">
        Get instant answers based on community discussions
      </Typography>
    </Box>
  );
};
