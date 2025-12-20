"use client";

import React, { useState } from "react";
import { Box, Typography, Button, Avatar, Paper, Stack } from "@mui/material";
import { Comment } from "../types";
import { formatDistanceToNow } from "date-fns";
import CommentForm from "./CommentForm";
import { useAuth } from "@/context/AuthContext";
import { createComment, getReplies } from "../api/commentRepo";

interface CommentItemProps {
  comment: Comment;
  threadId: string;
}

export default function CommentItem({ comment, threadId }: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replies, setReplies] = useState<Comment[]>([]);
  const [repliesLoaded, setRepliesLoaded] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const { user } = useAuth();

  // Load replies only when requested
  const handleToggleReplies = async () => {
    if (showReplies) {
      setShowReplies(false);
      return;
    }

    setShowReplies(true);
    if (!repliesLoaded && (comment.replyCount || 0) > 0) {
      setLoadingReplies(true);
      try {
        const fetchedReplies = await getReplies(comment.id);
        setReplies(fetchedReplies);
        setRepliesLoaded(true);
      } catch (error) {
        console.error("Failed to load replies", error);
      } finally {
        setLoadingReplies(false);
      }
    }
  };

  const handleReplySubmit = async (content: string) => {
    if (!user) return;

    try {
      const newReply = await createComment({
        threadId,
        body: content,
        authorId: user.uid,
        userDisplayName: user.displayName || "User",
        userPhotoURL: user.photoURL || undefined,
        parentId: comment.id,
      });

      // Optimistically add reply
      setReplies((prev) => [...prev, newReply]);
      setRepliesLoaded(true); 
      setShowReplies(true); // Ensure replies are visible
      setIsReplying(false);
    } catch (error) {
      console.error("Failed to reply", error);
      alert("Failed to post reply. Please try again.");
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Paper elevation={0} sx={{ p: 2, bgcolor: "background.paper", border: "1px solid", borderColor: "divider" }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1, gap: 1 }}>
          <Avatar 
            src={comment.userPhotoURL} 
            alt={comment.userDisplayName || comment.authorId} 
            sx={{ width: 24, height: 24 }} 
          />
          <Typography variant="subtitle2" fontWeight="bold">
            {comment.userDisplayName || "User"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            • {formatDistanceToNow(comment.createdAt.toMillis())} ago
          </Typography>
        </Box>
        
        <Typography variant="body2" sx={{ mb: 1, whiteSpace: "pre-wrap" }}>
          {comment.body}
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center">
          <Button 
            size="small" 
            onClick={() => setIsReplying(!isReplying)}
            sx={{ color: "text.secondary", minWidth: 0, p: 0.5 }}
          >
            Reply
          </Button>
          {(comment.replyCount || 0) > 0 && (
             <Button 
                size="small" 
                onClick={handleToggleReplies}
                sx={{ color: "primary.main", minWidth: 0, p: 0.5 }}
             >
               {showReplies ? "Hide Replies" : `View ${comment.replyCount} Replies`}
             </Button>
          )}
        </Stack>

        {isReplying && (
          <Box sx={{ mt: 2, ml: 2 }}>
             <CommentForm 
                onSubmit={handleReplySubmit} 
                placeholder={`Reply to ${comment.userDisplayName || "user"}...`}
                autoFocus
                onCancel={() => setIsReplying(false)}
                submitLabel="Reply"
             />
          </Box>
        )}
      </Paper>

      {/* Nested Replies */}
      {showReplies && (
        <Box sx={{ pl: 3, mt: 1, borderLeft: "2px solid", borderColor: "divider" }}>
           {loadingReplies ? (
               <Typography variant="caption" sx={{ pl: 2 }}>Loading replies...</Typography>
           ) : (
               replies.map((reply) => (
                   <CommentItem key={reply.id} comment={reply} threadId={threadId} />
               ))
           )}
        </Box>
      )}
    </Box>
  );
}
