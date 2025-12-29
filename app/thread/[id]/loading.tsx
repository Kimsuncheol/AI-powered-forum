"use client";

import { Box, Skeleton, Stack } from "@mui/material";

export default function ThreadLoading() {
  return (
    <Box sx={{ maxWidth: 800, mx: "auto" }}>
      <Stack spacing={2}>
        {/* Thread header skeleton */}
        <Skeleton variant="text" width="60%" height={40} />
        <Skeleton variant="text" width="40%" height={20} />
        
        {/* Thread content skeleton */}
        <Skeleton variant="rectangular" height={200} />
        
        {/* Comments skeleton */}
        {[1, 2, 3].map((i) => (
          <Box key={i} sx={{ display: "flex", gap: 2 }}>
            <Skeleton variant="circular" width={40} height={40} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="30%" />
              <Skeleton variant="text" width="100%" />
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
