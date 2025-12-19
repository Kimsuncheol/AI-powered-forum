import { Suspense } from "react";
import { SearchPage } from "@/features/search";
import { CircularProgress, Box } from "@mui/material";

export default function Page() {
  return (
    <Suspense
      fallback={
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      }
    >
      <SearchPage />
    </Suspense>
  );
}
