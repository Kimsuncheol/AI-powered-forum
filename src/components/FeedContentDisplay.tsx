import React from "react";
import { Box, Typography, Card, CardContent, Link } from "@mui/material";
import ReactMarkdown from "react-markdown";

interface FeedContentDisplayProps {
  type: "text" | "media" | "link";
  content: string;
  mediaUrl?: string;
  linkUrl?: string;
}

const FeedContentDisplay: React.FC<FeedContentDisplayProps> = ({
  type,
  content,
  mediaUrl,
  linkUrl,
}) => {
  const renderMarkdown = (text: string) => (
    <ReactMarkdown
      components={{
        p: ({ node, ...props }) => (
          <Typography variant="body1" paragraph {...props} />
        ),
        a: ({ node, ...props }) => (
          <Link {...props} target="_blank" rel="noopener noreferrer" />
        ),
        // Add more custom renderers as needed for MUI integration
      }}
    >
      {text}
    </ReactMarkdown>
  );

  if (type === "text") {
    return <Box>{renderMarkdown(content)}</Box>;
  }

  if (type === "media") {
    return (
      <Box>
        {mediaUrl && (
          <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
            {/* Simple check for video extension, in a real app might need more robust detection */}
            {mediaUrl.match(/\.(mp4|webm|ogg)$/i) ? (
              <video
                controls
                src={mediaUrl}
                style={{
                  maxWidth: "100%",
                  maxHeight: "500px",
                  borderRadius: "8px",
                }}
              />
            ) : (
              <img
                src={mediaUrl}
                alt="Post media"
                style={{
                  maxWidth: "100%",
                  maxHeight: "500px",
                  borderRadius: "8px",
                  objectFit: "contain",
                }}
              />
            )}
          </Box>
        )}
        <Box>{renderMarkdown(content)}</Box>
      </Box>
    );
  }

  if (type === "link") {
    return (
      <Box>
        {linkUrl && (
          <Card variant="outlined" sx={{ mb: 2, bgcolor: "action.hover" }}>
            <CardContent>
              <Link
                href={linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="h6"
                underline="hover"
                sx={{ display: "block", mb: 1, wordBreak: "break-all" }}
              >
                {linkUrl}
              </Link>
              {/* In a real app, you might fetch metadata (og:image, og:description) here */}
              <Typography variant="caption" color="text.secondary">
                External Link
              </Typography>
            </CardContent>
          </Card>
        )}
        <Box>{renderMarkdown(content)}</Box>
      </Box>
    );
  }

  return null;
};

export default FeedContentDisplay;
