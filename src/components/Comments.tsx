import React, { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  TextField,
  Button,
  Divider,
  IconButton,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

interface Comment {
  id: number;
  author: string;
  avatar: string;
  content: string;
  likes: number;
  liked: boolean;
}

interface CommentsProps {
  threadId: number;
}

const Comments: React.FC<CommentsProps> = ({ threadId }) => {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: "Alice",
      avatar: "/static/images/avatar/3.jpg",
      content: "Great post! Thanks for sharing.",
      likes: 5,
      liked: false,
    },
    {
      id: 2,
      author: "Bob",
      avatar: "/static/images/avatar/4.jpg",
      content: "I agree, very insightful.",
      likes: 2,
      liked: true,
    },
  ]);
  const [newComment, setNewComment] = useState("");

  const handleLikeComment = (id: number) => {
    setComments(
      comments.map((comment) => {
        if (comment.id === id) {
          return {
            ...comment,
            liked: !comment.liked,
            likes: comment.liked ? comment.likes - 1 : comment.likes + 1,
          };
        }
        return comment;
      })
    );
  };

  const handleSubmit = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now(),
        author: "Demo User",
        avatar: "/static/images/avatar/2.jpg",
        content: newComment,
        likes: 0,
        liked: false,
      };
      setComments([...comments, comment]);
      setNewComment("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="subtitle2" sx={{ mb: 2 }}>
        Comments ({comments.length})
      </Typography>

      <List sx={{ width: "100%", bgcolor: "background.paper", mb: 2 }}>
        {comments.map((comment, index) => (
          <React.Fragment key={comment.id}>
            <ListItem
              alignItems="flex-start"
              secondaryAction={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton
                    edge="end"
                    aria-label="like"
                    onClick={() => handleLikeComment(comment.id)}
                    size="small"
                  >
                    {comment.liked ? (
                      <FavoriteIcon fontSize="small" color="error" />
                    ) : (
                      <FavoriteBorderIcon fontSize="small" />
                    )}
                  </IconButton>
                  <Typography variant="caption" sx={{ ml: 0.5, minWidth: 15 }}>
                    {comment.likes}
                  </Typography>
                </Box>
              }
            >
              <ListItemAvatar>
                <Avatar
                  alt={comment.author}
                  src={comment.avatar}
                  sx={{ width: 32, height: 32 }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="subtitle2" component="span">
                    {comment.author}
                  </Typography>
                }
                secondary={
                  <Typography
                    variant="body2"
                    color="text.primary"
                    component="span"
                    sx={{ display: "block" }}
                  >
                    {comment.content}
                  </Typography>
                }
              />
            </ListItem>
            {index < comments.length - 1 && (
              <Divider variant="inset" component="li" />
            )}
          </React.Fragment>
        ))}
      </List>

      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={handleKeyDown}
          multiline
          maxRows={4}
        />
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!newComment.trim()}
        >
          Leave
        </Button>
      </Box>
    </Box>
  );
};

export default Comments;
