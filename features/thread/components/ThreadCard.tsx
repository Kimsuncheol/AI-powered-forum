"use client";
import React, { memo } from "react";
import dynamic from "next/dynamic";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  CardActionArea,
  Avatar,
  Stack,
} from "@mui/material";
import { Favorite, Comment } from "@mui/icons-material";
import { Thread } from "../types";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Timestamp } from "firebase/firestore";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { Link as LinkIcon, OpenInNew, VideoLibrary, Audiotrack } from "@mui/icons-material";
import "react-h5-audio-player/lib/styles.css";

// Dynamic imports for SSR safety
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false }) as React.ComponentType<{
  url: string;
  controls?: boolean;
  width?: string | number;
  height?: string | number;
  light?: boolean;
  playing?: boolean;
}>;
const AudioPlayer = dynamic(() => import("react-h5-audio-player").then(mod => mod.default), { ssr: false });

interface ThreadCardProps {
  thread: Thread;
  onClick?: () => void;
}

function ThreadCard({ thread, onClick }: ThreadCardProps) {
  // Safe date handling - use a stable fallback
  const getCreatedAtMillis = () => {
    if (thread.createdAt instanceof Timestamp) {
      return thread.createdAt.toMillis();
    }
    // Fallback for types that might not be Firestore Timestamps
    // Use a fixed old date rather than Date.now() to avoid impure function
    return new Date('2020-01-01').getTime();
  };

  const timeAgo = formatDistanceToNow(getCreatedAtMillis(), { addSuffix: true });

  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 2,
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 4,
        },
      }}
      onClick={onClick}
    >
      <CardActionArea component={Link} href={`/thread/${thread.id}`}>
        <CardContent>
          {/* Header: Author & Date */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 1.5, gap: 1 }}>
            <Avatar sx={{ width: 24, height: 24, fontSize: "0.75rem" }}>
              {(thread.authorId?.[0] || "?").toUpperCase()}
            </Avatar>
            <Typography variant="caption" color="text.secondary" fontWeight="bold">
              {thread.authorId || "Anonymous"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              • {timeAgo}
            </Typography>
          </Box>

          {/* Title */}
          <Typography variant="h6" component="h2" gutterBottom fontWeight="bold" sx={{ lineHeight: 1.3 }}>
            {thread.title}
          </Typography>

          {/* Snippet */}
            {thread.type === 'link' && thread.linkUrl ? (
              <Box 
                component="a" 
                href={thread.linkUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  p: 2, 
                  bgcolor: 'action.hover', 
                  borderRadius: 1,
                  mb: 2,
                  textDecoration: 'none',
                  color: 'primary.main',
                  border: 1,
                  borderColor: 'divider',
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
            ) : thread.type === 'markdown' ? (
              <Box sx={{ 
                mb: 2, 
                maxHeight: '200px', 
                overflow: 'hidden', 
                position: 'relative',
                maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                '& p': { m: 0, mb: 1 },
                img: { maxWidth: '100%', height: 'auto' }
               }}>
                <ReactMarkdown rehypePlugins={[rehypeSanitize]} remarkPlugins={[remarkGfm]}>
                  {thread.body}
                </ReactMarkdown>
              </Box>
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  mb: 2,
                  minHeight: "1.5em",
                }}
              >
                {thread.body}
              </Typography>
            )}
            
            {thread.type === 'video' && thread.mediaUrl && (
              <Box 
                sx={{ mb: 2, borderRadius: 1, overflow: 'hidden' }}
                onClick={(e) => e.stopPropagation()}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: 'text.secondary' }}>
                  <VideoLibrary fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="caption">Video</Typography>
                </Box>
                <ReactPlayer 
                  url={thread.mediaUrl} 
                  controls 
                  width="100%" 
                  height="200px"
                  light
                />
              </Box>
            )}

            {thread.type === 'audio' && thread.mediaUrl && (
              <Box 
                sx={{ mb: 2 }}
                onClick={(e) => e.stopPropagation()}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: 'text.secondary' }}>
                  <Audiotrack fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="caption">Audio</Typography>
                </Box>
                <AudioPlayer
                  src={thread.mediaUrl}
                  showJumpControls={false}
                  layout="horizontal-reverse"
                  customVolumeControls={[]}
                  customAdditionalControls={[]}
                  style={{ borderRadius: '8px' }}
                />
              </Box>
            )}

            {(thread.type === 'video' || thread.type === 'audio') && thread.body && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {thread.body}
              </Typography>
            )}
            
            {thread.type === 'link' && thread.body && (
               <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                 {thread.body}
               </Typography>
            )}

            {/* Image Grid */}
            {thread.imageUrls && thread.imageUrls.length > 0 && (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "repeat(2, 1fr)",
                    sm: "repeat(3, 1fr)",
                  },
                  gap: 1,
                  mb: 2,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {thread.imageUrls.slice(0, 4).map((url, index) => (
                  <Box
                    key={index}
                    sx={{
                      position: "relative",
                      borderRadius: 1,
                      overflow: "hidden",
                      aspectRatio: "1",
                      bgcolor: "action.hover",
                    }}
                  >
                    <Box
                      component="img"
                      src={url}
                      alt={`Image ${index + 1}`}
                      loading="lazy"
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    {index === 3 && thread.imageUrls && thread.imageUrls.length > 4 && (
                      <Box
                        sx={{
                          position: "absolute",
                          inset: 0,
                          bgcolor: "rgba(0,0,0,0.6)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography variant="h6" color="white">
                          +{thread.imageUrls.length - 4}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
            )}

          {/* Footer: Tags & Stats */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: "auto",
            }}
          >
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {(thread.tagIds || []).slice(0, 3).map((tag) => (
                <Chip
                  key={tag}
                  label={`#${tag}`}
                  size="small"
                  variant="outlined"
                  sx={{ 
                    borderRadius: 1, 
                    fontSize: "0.7rem", 
                    height: 20 
                  }}
                />
              ))}
              {(thread.tagIds?.length || 0) > 3 && (
                <Typography variant="caption" color="text.secondary">
                  +{thread.tagIds!.length - 3} more
                </Typography>
              )}
            </Box>

            {/* Mock Stats (since they are not in the core type yet) */}
            <Stack direction="row" spacing={2} color="text.secondary">
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Favorite fontSize="small" sx={{ fontSize: 16 }} color="disabled" />
                <Typography variant="caption">0</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Comment fontSize="small" sx={{ fontSize: 16 }} color="disabled" />
                <Typography variant="caption">0</Typography>
              </Box>
            </Stack>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default memo(ThreadCard);
