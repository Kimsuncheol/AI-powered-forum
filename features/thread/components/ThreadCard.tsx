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
  Collapse,
  IconButton,
  Button,
} from "@mui/material";
import { Favorite, Comment, Warning, Visibility, Place } from "@mui/icons-material";
import { Thread } from "../types";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Timestamp } from "firebase/firestore";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { Link as LinkIcon, OpenInNew, VideoLibrary, Audiotrack } from "@mui/icons-material";
import "react-h5-audio-player/lib/styles.css";
import CommentSection from "./CommentSection";

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

import { useSettings } from "@/context/SettingsContext";
import { useLike } from "../hooks/useLike";

function ThreadCard({ thread, onClick }: ThreadCardProps) {
  const { autoPlayEnabled, nsfwFilterEnabled } = useSettings();
  const { isLiked, likeCount, toggleLike } = useLike(thread.id, thread.likesCount || 0);
  const [showComments, setShowComments] = React.useState(false);
  const [nsfwRevealed, setNsfwRevealed] = React.useState(false);
  
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

  const handleCommentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setShowComments(!showComments);
  };

  const handleRevealNSFW = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setNsfwRevealed(true);
  };

  // Check if content should be blurred
  const isNSFW = thread.isNSFW === true;
  const shouldBlur = isNSFW && nsfwFilterEnabled && !nsfwRevealed;

  return (
    <Card
      sx={{
        mb: 1.5,
        transition: "background-color 0.1s",
        "&:hover": {
          bgcolor: "action.hover",
        },
      }}
      onClick={onClick}
    >
      <CardActionArea component={Link} href={`/thread/${thread.id}`}>
            <CardContent sx={{ p: { xs: 1.5, sm: 2 }, pb: 1, "&:last-child": { pb: 1 } }}>
              {/* Header: Author & Date */}
              <Box sx={{ display: "flex", alignItems: "center", mb: 0.5, gap: 0.5, flexWrap: "wrap" }}>
                <Avatar sx={{ width: 20, height: 20, fontSize: "0.65rem" }}>
                  {(thread.authorId?.[0] || "?").toUpperCase()}
                </Avatar>
                <Typography variant="caption" color="text.secondary" fontWeight="600" sx={{ fontSize: "0.75rem" }}>
                  {thread.authorId || "Anonymous"}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
                  • {timeAgo}
                </Typography>
                {isNSFW && (
                  <Chip
                    icon={<Warning sx={{ fontSize: 12 }} />}
                    label="NSFW"
                    size="small"
                    color="error"
                    sx={{ height: 16, fontSize: "0.65rem", fontWeight: "bold", "& .MuiChip-label": { px: 0.5 } }}
                  />
                )}
                {thread.location && (
                   <Chip
                     icon={<Place sx={{ fontSize: 12 }} />}
                     label={thread.location.name || thread.location.address.split(',')[0]}
                     size="small"
                     variant="outlined"
                     sx={{ height: 16, fontSize: "0.65rem", "& .MuiChip-label": { px: 0.5 }, maxWidth: 120 }}
                   />
                )}
              </Box>

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
                {thread.title}
              </Typography>

          {/* Content with optional NSFW blur */}
          <Box sx={{ position: 'relative' }}>
            {shouldBlur && (
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  bgcolor: 'rgba(0, 0, 0, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                  borderRadius: 1,
                  minHeight: 100,
                }}
              >
                <Button
                  variant="contained"
                  startIcon={<Visibility />}
                  onClick={handleRevealNSFW}
                  sx={{ textTransform: 'none' }}
                >
                  Reveal NSFW Content
                </Button>
              </Box>
            )}

            <Box sx={{ filter: shouldBlur ? 'blur(10px)' : 'none', pointerEvents: shouldBlur ? 'none' : 'auto' }}>
              {/* Snippet */}
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
                '& p': { m: 0, mb: 1 },
                '& img': { maxWidth: '100%', height: 'auto' }
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
                  mb: 2,
                  whiteSpace: "pre-wrap",
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
                  playing={autoPlayEnabled}
                  width="100%" 
                  height="200px"
                  light={!autoPlayEnabled} // Use light mode if autoplay is off for better performance
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
                  autoPlay={autoPlayEnabled}
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
            </Box> {/* Close blur wrapper */}
          </Box>
        </CardContent>
      </CardActionArea>

      {/* Footer: Tags & Stats */}
          <CardContent sx={{ pt: 0, pb: 1, px: { xs: 1.5, sm: 2 }, "&:last-child": { pb: 1 } }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, alignItems: "center" }}>
                {(thread.tagIds || []).slice(0, 3).map((tag) => (
                  <Chip
                    key={tag}
                    label={`#${tag}`}
                    size="small"
                    variant="outlined"
                    sx={{ 
                      borderRadius: 2, 
                      fontSize: "0.65rem", 
                      height: 18,
                      cursor: "pointer",
                      "& .MuiChip-label": { px: 0.75 },
                    }}
                    onClick={(e) => { e.stopPropagation(); /* TODO: Navigate to tag search */ }}
                  />
                ))}
                {(thread.tagIds?.length || 0) > 3 && (
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.65rem" }}>
                    +{thread.tagIds!.length - 3}</Typography>
                )}
              </Box>

              {/* Actions */}
              <Stack direction="row" spacing={0.5} color="text.secondary" alignItems="center" sx={{ justifyContent: "flex-end" }}>
                <IconButton 
                  size="small" 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    e.preventDefault(); 
                    toggleLike();
                  }}
                  sx={{ p: 0.5 }}
                >
                  <Favorite 
                    fontSize="small" 
                    sx={{ fontSize: 16 }} 
                    color={isLiked ? "error" : "disabled"} 
                  />
                </IconButton>
                <Typography variant="caption" sx={{ fontSize: "0.7rem", fontWeight: 700 }}>
                  {likeCount}
                </Typography>
                
                <Button 
                  size="small" 
                  startIcon={<Comment sx={{ fontSize: 16 }} />}
                  sx={{ 
                    color: showComments ? "primary.main" : "text.secondary", 
                    minWidth: "auto",
                    px: 0.75,
                    py: 0.25,
                    fontSize: "0.75rem",
                    fontWeight: 700,
                  }}
                  onClick={handleCommentClick}
                >
                  {thread.commentsCount || 0}
                </Button>
              </Stack>
            </Box>
          </CardContent>

      
      {/* Comments Expansion */}
      <Collapse in={showComments} timeout="auto" unmountOnExit>
        <Box 
          sx={{ 
            px: { xs: 1.5, sm: 2 },
            py: 2,
            bgcolor: "background.default", 
            borderTop: 1, 
            borderColor: "divider" 
          }} 
          onClick={(e) => e.stopPropagation()}
        >
          <CommentSection threadId={thread.id} />
        </Box>
      </Collapse>
    </Card>
  );
}

export default memo(ThreadCard);
