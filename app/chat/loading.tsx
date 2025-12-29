import { Box, Skeleton } from "@mui/material";

export default function ChatLoading() {
  return (
    <Box sx={{ p: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Box key={i} sx={{ mb: 1.5 }}>
          <Skeleton variant="rounded" height={72} />
        </Box>
      ))}
    </Box>
  );
}
