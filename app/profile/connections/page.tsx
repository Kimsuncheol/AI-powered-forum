"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { ConnectionsPage } from "@/features/follow/components/ConnectionsPage";
import { Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";

export default function ConnectionsRoute() {
  const { user, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return null; // Redirecting
  }

  return <ConnectionsPage userId={user.uid} />;
}
