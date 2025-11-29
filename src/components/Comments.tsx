import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useAuth } from "../context/AuthContext";

interface Comment {
  id: string;
  author: string;
  avatarUrl?: string;
  content: string;
  likes: number;
  isLiked: boolean;
}

interface CommentsProps {
  threadId: string;
}

const Comments: React.FC<CommentsProps> = ({ threadId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: "Jane Doe",
      content: "Great post!",
      likes: 5,
      isLiked: false,
    },
    {
      id: "2",
      author: "John Smith",
      content: "Thanks for sharing.",
      likes: 2,
      isLiked: true,
    },
  ]);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: Date.now().toString(),
      author: user?.name || "Guest",
      avatarUrl: user?.avatarUrl,
      content: newComment,
      likes: 0,
      isLiked: false,
    };
    setComments([...comments, comment]);
    setNewComment("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  const toggleLike = (id: string) => {
    setComments(
      comments.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            isLiked: !c.isLiked,
            likes: c.isLiked ? c.likes - 1 : c.likes + 1,
          };
        }
        return c;
      })
    );
  };

  return (
    <Box sx={{ mt: 2 }}>
      <List>
        {comments.map((comment) => (
          <ListItem key={comment.id} alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt={comment.author} src={comment.avatarUrl} />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="subtitle2" component="span">
                    {comment.author}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="caption" sx={{ mr: 0.5 }}>
                      {comment.likes}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => toggleLike(comment.id)}
                    >
                      {comment.isLiked ? (
                        <FavoriteIcon fontSize="small" color="error" />
                      ) : (
                        <FavoriteBorderIcon fontSize="small" />
                      )}
                    </IconButton>
                  </Box>
                </Box>
              }
              secondary={
                <Typography variant="body2" color="text.primary">
                  {comment.content}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
      <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button
          variant="contained"
          onClick={handleAddComment}
          disabled={!newComment.trim()}
        >
          Leave
        </Button>
      </Box>
    </Box>
  );
};

export default Comments;
