import React from "react";
import { Box, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { Thread } from "@/lib/db/threads";

interface ThreadMainBodyProps {
  thread: Thread;
}

export default function ThreadMainBody({ thread }: ThreadMainBodyProps) {
  if (thread.type === 'markdown') {
    return (
      <Box sx={{ "& .markdown-body": { fontSize: "1rem" }, mb: 4 }} className="markdown-body">
         <ReactMarkdown rehypePlugins={[rehypeSanitize]} remarkPlugins={[remarkGfm]}>
           {thread.content}
         </ReactMarkdown>
      </Box>
    );
  }

  return (
    <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", mb: 4 }}>
      {thread.content}
    </Typography>
  );
}
