import React from "react";
import { Box, Typography } from "@mui/material";
import { Link as LinkIcon, OpenInNew } from "@mui/icons-material";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

interface ThreadCardContentProps {
  title: string;
  body: string;
  type: "text" | "markdown" | "link" | "video" | "audio";
  linkUrl?: string;
}

export default function ThreadCardContent({
  title,
  body,
  type,
  linkUrl,
}: ThreadCardContentProps) {
  return (
    <>
      {/* Title */}
      <Typography
        variant="h6"
        component="h2"
        gutterBottom
        sx={{
          fontWeight: 500,
          fontSize: { xs: "1rem", sm: "1.125rem" },
          lineHeight: 1.3,
          mb: 0.5,
        }}
      >
        {title}
      </Typography>

      {/* Content */}
      {type === "link" && linkUrl ? (
        <Box
          component="div"
          onClick={(e) => {
            e.preventDefault();
            window.open(linkUrl, "_blank", "noopener,noreferrer");
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            p: 2,
            bgcolor: "action.hover",
            borderRadius: 1,
            mb: 2,
            textDecoration: "none",
            color: "primary.main",
            border: 1,
            borderColor: "divider",
            "&:hover": {
              bgcolor: "action.selected",
              textDecoration: "underline",
            },
          }}
        >
          <LinkIcon sx={{ mr: 1 }} />
          <Typography
            variant="body1"
            component="span"
            fontWeight="medium"
            sx={{ wordBreak: "break-all", flex: 1 }}
          >
            {linkUrl}
          </Typography>
          <OpenInNew fontSize="small" sx={{ ml: 1 }} />
        </Box>
      ) : type === "markdown" ? (
        <Box
          sx={{
            mb: 2,
            "& p": { m: 0, mb: 1 },
            "& img": { maxWidth: "100%", height: "auto" },
          }}
        >
          <ReactMarkdown rehypePlugins={[rehypeSanitize]} remarkPlugins={[remarkGfm]}>
            {body}
          </ReactMarkdown>
        </Box>
      ) : (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            whiteSpace: "pre-wrap",
          }}
        >
          {body}
        </Typography>
      )}

      {/* Additional body text for media types */}
      {(type === "video" || type === "audio" || type === "link") && body && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {body}
        </Typography>
      )}
    </>
  );
}
