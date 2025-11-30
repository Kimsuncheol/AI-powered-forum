import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Paper, Typography, Avatar, Button } from "@mui/material";

export interface InboxEntryProps {
  type: "system" | "feed_activity";
  title: string;
  senderName: string;
  date: string;
  content: string;
  feedId?: string;
}

const InboxEntry: React.FC<InboxEntryProps> = ({
  type,
  title,
  senderName,
  date,
  content,
  feedId,
}) => {
  const navigate = useNavigate();

  const handleDetailClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (feedId) {
      navigate(`/feed/${feedId}`);
    }
  };

  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        display: "flex",
        gap: 2,
        mb: 2,
        "&:hover": {
          bgcolor: "action.hover",
        },
      }}
    >
      {/* Left Section: Avatar */}
      <Box>
        <Avatar alt={senderName} src="/static/images/avatar/1.jpg">
          {senderName.charAt(0).toUpperCase()}
        </Avatar>
      </Box>

      {/* Right Section: Content */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        {/* Line 1: Title */}
        <Typography variant="subtitle1" fontWeight="bold" noWrap align="left">
          {title}
        </Typography>

        {/* Line 2: Sender */}
        <Typography
          variant="body2"
          color="text.secondary"
          gutterBottom
          align="left"
        >
          From: {senderName}
        </Typography>

        {/* Line 3: Date & Action */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {date}
          </Typography>

          {type === "feed_activity" && (
            <Button
              variant="text"
              size="small"
              onClick={handleDetailClick}
              sx={{
                textTransform: "lowercase",
                minWidth: "auto",
                p: 0.5,
              }}
            >
              detail
            </Button>
          )}
        </Box>

        {/* Content Body */}
        <Typography
          variant="body2"
          sx={{
            maxHeight: "80%",
            overflowY: "auto",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            p: 1,
            borderRadius: 1,
          }}
          align="left"
        >
          {content}
        </Typography>
      </Box>
    </Paper>
  );
};

export default InboxEntry;
