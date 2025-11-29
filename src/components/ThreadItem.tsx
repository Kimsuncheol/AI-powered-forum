import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Button,
  Collapse,
  Box,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CommentIcon from "@mui/icons-material/Comment";
import ShareIcon from "@mui/icons-material/Share";
import Comments from "./Comments";

export interface ThreadData {
  id: string;
  author: string;
  avatarUrl?: string;
  content: string;
  likes: number;
  commentCount: number;
  timestamp: string;
}

interface ThreadItemProps {
  thread: ThreadData;
}

const ThreadItem: React.FC<ThreadItemProps> = ({ thread }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isHoveringFollow, setIsHoveringFollow] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(thread.likes);
  const [commentsOpen, setCommentsOpen] = useState(false);

  const handleFollowClick = () => {
    setIsFollowing(!isFollowing);
  };

  const handleLikeClick = () => {
    if (isLiked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setIsLiked(!isLiked);
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" src={thread.avatarUrl}>
            {thread.author[0]}
          </Avatar>
        }
        action={
          <Button
            variant={isFollowing ? "outlined" : "text"}
            color={isFollowing && isHoveringFollow ? "error" : "primary"}
            onClick={handleFollowClick}
            onMouseEnter={() => setIsHoveringFollow(true)}
            onMouseLeave={() => setIsHoveringFollow(false)}
            size="small"
          >
            {isFollowing
              ? isHoveringFollow
                ? "Unfollow"
                : "Following"
              : "Follow"}
          </Button>
        }
        title={thread.author}
        subheader={thread.timestamp}
      />
      <CardContent>
        <Typography variant="body1" color="text.secondary">
          {thread.content}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites" onClick={handleLikeClick}>
          {isLiked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
        </IconButton>
        <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
          {likeCount} likes
        </Typography>
        <IconButton
          aria-label="comment"
          onClick={() => setCommentsOpen(!commentsOpen)}
        >
          <CommentIcon />
        </IconButton>
        <Typography variant="body2" color="text.secondary">
          {thread.commentCount} comments
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
      </CardActions>
      <Collapse in={commentsOpen} timeout="auto" unmountOnExit>
        <CardContent>
          <Comments threadId={thread.id} />
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default ThreadItem;
