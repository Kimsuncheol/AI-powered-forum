import { Skeleton, Stack } from "@mui/material";

export default function Loading() {
  return (
    <Stack spacing={2}>
       <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
       <Skeleton variant="text" height={40} width="60%" />
       <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 3 }} />
    </Stack>
  );
}
