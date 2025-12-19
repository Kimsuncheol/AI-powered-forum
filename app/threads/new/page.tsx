"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { CreateNewThreadPage } from "@/features/thread/create/components/CreateNewThreadPage";
import { CircularProgress, Box } from "@mui/material";

export default function NewThreadPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
    }
  }, [user, loading, router]);

  if (loading) {
// ... existing loading block
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return null;
  }

  return <CreateNewThreadPage />;
}
