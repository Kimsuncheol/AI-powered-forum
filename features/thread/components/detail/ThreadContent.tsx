import React, { useState } from "react";
import { Box, Typography, IconButton, Stack, Tooltip, Snackbar } from "@mui/material";
import { Link as LinkIcon, OpenInNew, VideoLibrary, Audiotrack, Favorite, Share } from "@mui/icons-material";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import dynamic from "next/dynamic";
import "react-h5-audio-player/lib/styles.css";
import { Thread } from "@/lib/db/threads";
import { useLike } from "@/features/thread/hooks/useLike";
import { useAuth } from "@/context/AuthContext";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false }) as React.ComponentType<{
  url: string;
  controls?: boolean;
  width?: string | number;
  height?: string | number;
  light?: boolean;
  playing?: boolean;
}>;
const AudioPlayer = dynamic(() => import("react-h5-audio-player").then(mod => mod.default), { ssr: false });

interface ThreadContentProps {
  thread: Thread;
  threadId: string;
}

export default function ThreadContent({ thread, threadId }: ThreadContentProps) {
  const { isLiked, likeCount, toggleLike } = useLike(threadId, thread.likesCount || 0);
  const { user } = useAuth();
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const isAuthenticated = !!user;

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setSnackbarOpen(true);
    });
  };

  return (
    <>
      {thread.type === 'link' && thread.linkUrl ? (
        <Box 
          component="div"
          onClick={(e) => {
             e.preventDefault();
             window.open(thread.linkUrl, '_blank', 'noopener,noreferrer');
          }}
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            p: 2, 
            bgcolor: 'action.hover', 
            borderRadius: 1,
            mb: 4,
            textDecoration: 'none',
            color: 'primary.main',
            border: 1,
            borderColor: 'divider',
            cursor: 'pointer',
            '&:hover': {
               bgcolor: 'action.selected',
               textDecoration: 'underline'
            }
          }}
        >
          <LinkIcon sx={{ mr: 1 }} />
          <Typography variant="body1" component="span" fontWeight="medium" sx={{ wordBreak: 'break-all', flex: 1 }}>
            {thread.linkUrl}
          </Typography>
          <OpenInNew fontSize="small" sx={{ ml: 1 }} />
        </Box>
      ) : thread.type === 'video' && thread.mediaUrl ? (
        <Box sx={{ mb: 4 }}>
           <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: 'text.secondary' }}>
             <VideoLibrary fontSize="small" sx={{ mr: 0.5 }} />
             <Typography variant="caption">Video</Typography>
           </Box>
           <Box sx={{ borderRadius: 2, overflow: 'hidden', border: 1, borderColor: 'divider', aspectRatio: '16/9' }}>
             <ReactPlayer 
               url={thread.mediaUrl} 
               controls 
               width="100%" 
               height="100%" 
             />
           </Box>
        </Box>
      ) : thread.type === 'audio' && thread.mediaUrl ? (
        <Box sx={{ mb: 4 }}>
           <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: 'text.secondary' }}>
             <Audiotrack fontSize="small" sx={{ mr: 0.5 }} />
             <Typography variant="caption">Audio</Typography>
           </Box>
           <AudioPlayer
             src={thread.mediaUrl}
             showJumpControls={false}
             layout="horizontal-reverse"
             customAdditionalControls={[]}
             style={{ borderRadius: '8px' }}
           />
        </Box>
      ) : thread.type === 'markdown' ? (
        <Box sx={{ "& .markdown-body": { fontSize: "1rem" }, mb: 4 }} className="markdown-body">
           <ReactMarkdown rehypePlugins={[rehypeSanitize]} remarkPlugins={[remarkGfm]}>
             {thread.content}
           </ReactMarkdown>
        </Box>
      ) : (
        <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", mb: 4 }}>
          {thread.content}
        </Typography>
      )}

      {/* Render text content below media if available (except for markdown/text types which are handled above) */}
      {(thread.type === 'video' || thread.type === 'audio' || thread.type === 'link') && thread.content && (
         <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", mb: 4 }}>
           {thread.content}
         </Typography>
      )}

      {/* Like/Actions Section */}
      <Stack direction="row" spacing={1} sx={{ mb: 3 }} alignItems="center">
        <Tooltip title={isAuthenticated ? "" : "Sign in to like"}>
          <span>
            <IconButton
              disabled={!isAuthenticated}
              onClick={(e) => {
                e.stopPropagation();
                toggleLike();
              }}
              sx={{ p: 1 }}
            >
              <Favorite sx={{ fontSize: 24 }} color={isLiked ? "error" : "disabled"} />
            </IconButton>
          </span>
        </Tooltip>
        <Typography variant="body1" fontWeight="bold">
          {likeCount} {likeCount === 1 ? "like" : "likes"}
        </Typography>

        <Tooltip title="Copy link">
          <IconButton onClick={handleShare} sx={{ p: 1 }}>
            <Share sx={{ fontSize: 24 }} />
          </IconButton>
        </Tooltip>
      </Stack>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message="Link copied to clipboard"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </>
  );
}
