import React from "react";
import { Box, Typography } from "@mui/material";
import { Link as LinkIcon, OpenInNew, VideoLibrary, Audiotrack } from "@mui/icons-material";
import dynamic from "next/dynamic";
import "react-h5-audio-player/lib/styles.css";
import { Thread } from "@/lib/db/threads";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false }) as React.ComponentType<{
  url: string;
  controls?: boolean;
  width?: string | number;
  height?: string | number;
  light?: boolean;
  playing?: boolean;
}>;

const AudioPlayer = dynamic(() => import("react-h5-audio-player").then(mod => mod.default), { ssr: false });

interface ThreadMediaSectionProps {
  thread: Thread;
}

export default function ThreadMediaSection({ thread }: ThreadMediaSectionProps) {
  if (thread.type === 'link' && thread.linkUrl) {
    return (
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
    );
  }

  if (thread.type === 'video' && thread.mediaUrl) {
    return (
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
    );
  }

  if (thread.type === 'audio' && thread.mediaUrl) {
    return (
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
    );
  }

  return null;
}
