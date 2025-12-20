import React, { useEffect, useState } from "react";
import { Box, Typography, Stack, CircularProgress } from "@mui/material";
import ThreadCard from "@/features/thread/components/ThreadCard";
import { profileService } from "../api/profile.service";
import { Thread } from "@/features/thread/types";

interface UserThreadsTabProps {
  uid: string;
}

export default function UserThreadsTab({ uid }: UserThreadsTabProps) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchThreads = async () => {
      setLoading(true);
      const data = await profileService.getUserThreads(uid);
      setThreads(data);
      setLoading(false);
    };

    if (uid) {
      fetchThreads();
    }
  }, [uid]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (threads.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: "center" }}>
        <Typography color="text.secondary">You haven&apos;t posted any threads yet.</Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={2} sx={{ mt: 2 }}>
      {threads.map((thread) => (
        <ThreadCard key={thread.id} thread={thread} />
      ))}
    </Stack>
  );
}
