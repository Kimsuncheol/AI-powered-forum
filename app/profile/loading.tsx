import {
  Container,
  Box,
  Skeleton,
  Paper,
} from "@mui/material";

export default function ProfileLoading() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Profile Header Skeleton */}
      <Paper elevation={0} sx={{ p: 4, mb: 4, display: "flex", gap: 3, alignItems: "center", bgcolor: "background.default" }}>
        <Skeleton variant="circular" width={80} height={80} />
        <Box>
          <Skeleton variant="text" width={200} height={40} />
          <Skeleton variant="text" width={150} />
          <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
            <Skeleton variant="rounded" width={60} height={24} />
            <Skeleton variant="rounded" width={100} height={24} />
          </Box>
        </Box>
      </Paper>

      {/* Tabs Skeleton */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Skeleton variant="rounded" width={100} height={36} />
          <Skeleton variant="rounded" width={100} height={36} />
          <Skeleton variant="rounded" width={100} height={36} />
        </Box>
      </Box>

      {/* Content Skeleton */}
      <Box sx={{ mt: 2 }}>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} variant="rounded" height={100} sx={{ mb: 2 }} />
        ))}
      </Box>
    </Container>
  );
}
