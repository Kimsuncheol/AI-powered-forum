import React from "react";
import { useRouter } from "next/navigation";
import { CreateThreadForm } from "./CreateThreadForm";
import { useCreateThread } from "../hooks/useCreateThread";
import { Container } from "@mui/material";
import { toast } from "react-toastify";
import { ThreadCreateInput } from "../../types";

export function ThreadCreatePage() {
  const router = useRouter();
  const { create, loading, error } = useCreateThread();

  const handleCreate = async (data: ThreadCreateInput) => {
    try {
      const threadId = await create(data);
      router.push(`/threads/${threadId}`);
    } catch (err) {
      console.error("Failed to create thread", err);
      toast.error("Failed to create thread", {
        autoClose: 5000,
        position: "top-right",
      });
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <CreateThreadForm onSubmit={handleCreate} loading={loading} error={error} />
    </Container>
  );
}
