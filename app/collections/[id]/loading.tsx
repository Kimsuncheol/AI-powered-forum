import { Box, CircularProgress, Typography } from "@mui/material";

export default function CollectionsLoading() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        gap: 2,
      }}
    >
      <CircularProgress />
      <Typography color="text.secondary">Loading collection...</Typography>
    </Box>
  );
}
