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

  // Calculate total comment count including nested replies
  const totalCommentCount = React.useMemo(() => {
    return comments.reduce((total, comment) => {
      return total + 1 + (comment.replyCount || 0);
    }, 0);
  }, [comments]);

  return (
    <Box>
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1.5,
          mb: 3,
          pb: 2,
          borderBottom: '2px solid',
          borderColor: 'primary.main',
        }}
      >
        <Typography 
          variant="h5" 
          fontWeight="bold"
          sx={{
            color: 'primary.main',
          }}
        >
          Comments
        </Typography>
        <Box
          sx={{
            ml: 'auto',
            px: 1.5,
            py: 0.5,
            borderRadius: 2,
            bgcolor: 'primary.main',
            color: 'white',
            fontSize: '0.75rem',
            fontWeight: 'bold',
          }}
        >
          {totalCommentCount}
        </Box>
      </Box>

      {user ? (
        <Box 
          sx={{ 
            mb: 4,
            p: 2,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            transition: 'all 0.3s',
            '&:hover': {
              borderColor: 'primary.main',
              boxShadow: '0 2px 12px rgba(33, 150, 243, 0.1)',
            }
          }}
        >
          <CommentForm onSubmit={handlePostComment} />
        </Box>
      ) : (
        <Box
          sx={{
            mb: 4,
            p: 3,
            borderRadius: 3,
            border: '2px dashed',
            borderColor: 'divider',
            bgcolor: 'action.hover',
            textAlign: 'center',
          }}
        >
          <Typography 
            color="text.secondary"
            sx={{ fontSize: '0.95rem' }}
          >
            Please sign in to comment.
          </Typography>
        </Box>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress sx={{ color: 'primary.main' }} />
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
        </Stack>
      )}
    </Box>
  );
}


