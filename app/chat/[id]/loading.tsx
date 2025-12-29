import { Box, Skeleton, Stack } from "@mui/material";

export default function ChatRoomLoading() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header skeleton */}
      <Box sx={{ p: 1.5, borderBottom: 1, borderColor: "divider" }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Skeleton variant="circular" width={36} height={36} />
          <Skeleton variant="text" width={120} height={24} />
        </Stack>
      </Box>
      {/* Messages skeleton */}
      <Box sx={{ flex: 1, p: 2 }}>
        {[1, 2, 3].map((i) => (
          <Box
            key={i}
            sx={{ display: "flex", mb: 2, justifyContent: i % 2 ? "flex-start" : "flex-end" }}
          >
            <Skeleton variant="rounded" width={200} height={40} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
