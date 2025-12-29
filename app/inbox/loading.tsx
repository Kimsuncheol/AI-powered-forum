"use client";

import { Box, Skeleton, Stack, Tabs, Tab } from "@mui/material";

export default function InboxLoading() {
  return (
    <Box sx={{ maxWidth: "lg", mx: "auto" }}>
      {/* Header */}
      <Skeleton variant="text" width="30%" height={48} sx={{ mb: 3 }} />
      
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={0}>
          <Tab label={<Skeleton width={80} />} />
          <Tab label={<Skeleton width={80} />} />
        </Tabs>
      </Box>
      
      {/* Inbox items */}
      <Stack spacing={2}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Box 
            key={i} 
            sx={{ 
              display: "flex", 
              gap: 2, 
              p: 2, 
              border: 1, 
              borderColor: "divider", 
              borderRadius: 1 
            }}
          >
            <Skeleton variant="circular" width={48} height={48} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="80%" height={24} />
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="30%" />
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
