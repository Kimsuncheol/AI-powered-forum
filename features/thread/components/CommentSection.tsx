"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, Stack, CircularProgress } from "@mui/material";
import { Comment } from "../types";
import { getCommentsForThread, createComment } from "../api/commentRepo";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import { useAuth } from "@/context/AuthContext";
import { notifyComment } from "@/lib/notifications/notificationService";

interface CommentSectionProps {
  threadId: string;
  threadAuthorId?: string;
  threadTitle?: string;
}

export default function CommentSection({ threadId, threadAuthorId, threadTitle }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function loadComments() {
      try {
        const fetched = await getCommentsForThread(threadId);
        setComments(fetched);
      } catch (error) {
        console.error("Failed to load comments", error);
      } finally {
        setLoading(false);
      }
    }
    loadComments();
  }, [threadId]);

  const handlePostComment = async (content: string) => {
    if (!user) return;
    try {
      const newComment = await createComment({
        threadId,
        body: content,
        authorId: user.uid,
        userDisplayName: user.displayName || "User",
        userPhotoURL: user.photoURL || undefined,
        parentId: null, // Top-level
      });
      setComments((prev) => [newComment, ...prev]);

      // Send email notification to thread author
      if (threadAuthorId && threadTitle && threadAuthorId !== user.uid) {
        // Fire and forget - don't block on email
        notifyComment(
          threadAuthorId,
          user.displayName || "Someone",
          threadTitle,
          content
        ).catch(console.error);
      }
    } catch (error) {
      console.error("Failed to post comment", error);
      alert("Failed to post comment. Please try again.");
    }
  };

  const handleUpdateComment = (commentId: string, newBody: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, body: newBody } : c))
    );
  };

  const handleDeleteComment = (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Comments
      </Typography>

      {user ? (
        <Box sx={{ mb: 4 }}>
          <CommentForm onSubmit={handlePostComment} />
        </Box>
      ) : (
        <Typography color="text.secondary" sx={{ mb: 4 }}>
            Please sign in to comment.
        </Typography>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Stack spacing={2}>
          {comments.map((comment) => (
            <CommentItem 
              key={comment.id} 
              comment={comment} 
              threadId={threadId}
              onUpdate={handleUpdateComment}
              onDelete={handleDeleteComment}
            />
          ))}
          {comments.length === 0 && (
              <Typography color="text.secondary">No comments yet. Be the first to share your thoughts!</Typography>
          )}
        </Stack>
      )}
    </Box>
  );
}


