"use client";

import { Box, Skeleton, Stack, Divider } from "@mui/material";

export default function SettingsLoading() {
  return (
    <Box sx={{ maxWidth: "lg", mx: "auto" }}>
      <Skeleton variant="text" width="30%" height={48} sx={{ mb: 3 }} />
      
      <Stack spacing={3}>
        {/* Account section */}
        <Box>
          <Skeleton variant="text" width="20%" height={32} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={120} />
        </Box>
        
        <Divider />
        
        {/* Notifications section */}
        <Box>
          <Skeleton variant="text" width="20%" height={32} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={80} />
        </Box>
        
        <Divider />
        
        {/* Preferences section */}
        <Box>
          <Skeleton variant="text" width="20%" height={32} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={100} />
        </Box>
      </Stack>
    </Box>
  );
}
