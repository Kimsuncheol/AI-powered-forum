"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  Paper,
  Stack,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Edit, Delete, Check, Close } from "@mui/icons-material";
import { Comment } from "../types";
import { formatDistanceToNow } from "date-fns";
import CommentForm from "./CommentForm";
import { useAuth } from "@/context/AuthContext";
import { createComment, getReplies, updateComment, deleteComment } from "../api/commentRepo";

interface CommentItemProps {
  comment: Comment;
  threadId: string;
  onUpdate?: (commentId: string, newBody: string) => void;
  onDelete?: (commentId: string) => void;
}

export default function CommentItem({ comment, threadId, onUpdate, onDelete }: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editBody, setEditBody] = useState(comment.body);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [replies, setReplies] = useState<Comment[]>([]);
  const [repliesLoaded, setRepliesLoaded] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();

  const isOwner = user?.uid === comment.authorId;

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

  const handleSaveEdit = async () => {
    if (!user || !editBody.trim()) return;
    
    setSaving(true);
    try {
      const result = await updateComment(comment.id, editBody.trim(), user.uid);
      if (result.success) {
        setIsEditing(false);
        onUpdate?.(comment.id, editBody.trim());
      } else {
        alert(result.error || "Failed to update comment");
      }
    } catch (error) {
      console.error("Failed to update comment", error);
      alert("Failed to update comment. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditBody(comment.body);
    setIsEditing(false);
  };

  const handleConfirmDelete = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const result = await deleteComment(comment.id, user.uid);
      if (result.success) {
        setDeleteDialogOpen(false);
        onDelete?.(comment.id);
      } else {
        alert(result.error || "Failed to delete comment");
      }
    } catch (error) {
      console.error("Failed to delete comment", error);
      alert("Failed to delete comment. Please try again.");
    } finally {
      setSaving(false);
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
          
          {/* Edit/Delete buttons for owner */}
          {isOwner && !isEditing && (
            <Box sx={{ ml: "auto", display: "flex", gap: 0.5 }}>
              <IconButton 
                size="small" 
                onClick={() => setIsEditing(true)}
                sx={{ p: 0.5 }}
                title="Edit"
              >
                <Edit sx={{ fontSize: 16 }} />
              </IconButton>
              <IconButton 
                size="small" 
                onClick={() => setDeleteDialogOpen(true)}
                sx={{ p: 0.5 }}
                color="error"
                title="Delete"
              >
                <Delete sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          )}
        </Box>
        
        {isEditing ? (
          <Box sx={{ mb: 1 }}>
            <TextField
              fullWidth
              multiline
              minRows={2}
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              disabled={saving}
              size="small"
            />
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Button
                size="small"
                variant="contained"
                startIcon={<Check />}
                onClick={handleSaveEdit}
                disabled={saving || !editBody.trim()}
              >
                Save
              </Button>
              <Button
                size="small"
                variant="outlined"
                startIcon={<Close />}
                onClick={handleCancelEdit}
                disabled={saving}
              >
                Cancel
              </Button>
            </Stack>
          </Box>
        ) : (
          <Typography variant="body2" sx={{ mb: 1, whiteSpace: "pre-wrap" }}>
            {comment.body}
          </Typography>
        )}

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
                   <CommentItem 
                     key={reply.id} 
                     comment={reply} 
                     threadId={threadId}
                     onUpdate={onUpdate}
                     onDelete={(replyId) => {
                       setReplies(prev => prev.filter(r => r.id !== replyId));
                     }}
                   />
               ))
           )}
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Comment?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this comment? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" disabled={saving}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

