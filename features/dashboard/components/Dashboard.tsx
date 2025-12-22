"use client";

import { Typography, Box, Paper } from "@mui/material";
import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <Box sx={{ maxWidth: 800, mx: "auto" }}>
      {/* Welcome Header */}
      <Paper 
        sx={{ 
          p: 2, 
          mb: 2, 
          bgcolor: "background.paper",
          borderRadius: 1,
        }}
      >
        <Typography 
          variant="h5" 
          component="h1" 
          sx={{ fontWeight: 600, fontSize: "1.375rem", mb: 0.5 }}
        >
          Welcome to the Forum
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.875rem" }}>
          {user ? `Hello, ${user.email}!` : "Please log in to create posts and interact with the community."}
        </Typography>
      </Paper>

      {/* Feed Content Placeholder */}
      <Paper 
        sx={{ 
          p: 3, 
          bgcolor: "background.paper",
          borderRadius: 1,
          textAlign: "center",
        }}
      >
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: "0.875rem" }}>
          Thread feed coming soon...
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: "0.75rem" }}>
          This will display posts with Reddit-style voting and compact cards
        </Typography>
      </Paper>
    </Box>
  );
}
