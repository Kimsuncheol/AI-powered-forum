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
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Comments from "./Comments"; // We will create this next

interface ThreadItemProps {
  id: number;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  initialLikes: number;
  initialComments: number;
}

const ThreadItem: React.FC<ThreadItemProps> = ({
  id,
  author,
  content,
  initialLikes,
  initialComments,
}) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isHoveringFollow, setIsHoveringFollow] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [expanded, setExpanded] = useState(false);

  const handleFollowClick = () => {
    setIsFollowing(!isFollowing);
    setIsHoveringFollow(false); // Reset hover state on click
  };

  const handleLikeClick = () => {
    setLiked(!liked);
    setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const getFollowButtonText = () => {
    if (isFollowing) {
      return isHoveringFollow ? "Unfollow" : "Following";
    }
    return "Follow";
  };

  return (
    <Card sx={{ maxWidth: 600, width: "100%", mb: 2 }}>
      <CardHeader
        avatar={
          <Avatar src={author.avatar} aria-label="recipe">
            {author.name[0]}
          </Avatar>
        }
        action={
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button
              variant={isFollowing ? "outlined" : "text"}
              color={isFollowing ? "secondary" : "primary"}
              onClick={handleFollowClick}
              onMouseEnter={() => setIsHoveringFollow(true)}
              onMouseLeave={() => setIsHoveringFollow(false)}
              sx={{ mr: 1, minWidth: 100 }}
            >
              {getFollowButtonText()}
            </Button>
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          </Box>
        }
        title={author.name}
        subheader="2 hours ago" // Mock timestamp
      />
      <CardContent>
        <Typography variant="body1" color="text.primary">
          {content}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton
          aria-label="add to favorites"
          onClick={handleLikeClick}
          color={liked ? "error" : "default"}
        >
          {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
        <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
          {likesCount} likes
        </Typography>

        <IconButton aria-label="comment" onClick={handleExpandClick}>
          <ChatBubbleOutlineIcon />
        </IconButton>
        <Typography variant="body2" color="text.secondary">
          {initialComments} comments
        </Typography>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {/* Placeholder for Comments component */}
          <Comments threadId={id} />
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default ThreadItem;
