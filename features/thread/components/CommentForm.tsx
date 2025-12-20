"use client";

import React, { useState } from "react";
import { Box, TextField, Button, Stack, Avatar } from "@mui/material";
import { useAuth } from "@/context/AuthContext";

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  placeholder?: string;
  autoFocus?: boolean;
  onCancel?: () => void;
  submitLabel?: string;
}

export default function CommentForm({
  onSubmit,
  placeholder = "Write a comment...",
  autoFocus = false,
  onCancel,
  submitLabel = "Comment",
}: CommentFormProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(content);
      setContent("");
      if (onCancel) onCancel(); // Close form on success if it's a reply
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", gap: 2 }}>
       <Avatar src={user?.photoURL || undefined} alt={user?.displayName || "User"} sx={{ width: 40, height: 40 }}/>
      <Stack spacing={1} sx={{ flexGrow: 1 }}>
        <TextField
          multiline
          minRows={2}
          maxRows={4}
          placeholder={placeholder}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isSubmitting}
          autoFocus={autoFocus}
          fullWidth
          size="small"
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          {onCancel && (
            <Button onClick={onCancel} disabled={isSubmitting} size="small">
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            disabled={!content.trim() || isSubmitting}
            size="small"
          >
            {isSubmitting ? "Posting..." : submitLabel}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
