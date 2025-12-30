import React from "react";
import dynamic from "next/dynamic";
import { Box, Typography } from "@mui/material";
import { VideoLibrary, Audiotrack } from "@mui/icons-material";
import "react-h5-audio-player/lib/styles.css";

// Dynamic imports for SSR safety
const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
}) as React.ComponentType<{
  url: string;
  controls?: boolean;
  width?: string | number;
  height?: string | number;
  light?: boolean;
  playing?: boolean;
}>;
const AudioPlayer = dynamic(
  () => import("react-h5-audio-player").then((mod) => mod.default),
  { ssr: false }
);

interface ThreadMediaContentProps {
  imageUrls?: string[];
  mediaUrl?: string;
  type: "text" | "markdown" | "link" | "video" | "audio";
  autoPlayEnabled: boolean;
}

export default function ThreadMediaContent({
  imageUrls,
  mediaUrl,
  type,
  autoPlayEnabled,
}: ThreadMediaContentProps) {
  return (
    <>
      {/* Video Player */}
      {type === "video" && mediaUrl && (
        <Box
          sx={{ mb: 2, borderRadius: 1, overflow: "hidden" }}
          onClick={(e) => e.stopPropagation()}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 1,
              color: "text.secondary",
            }}
          >
            <VideoLibrary fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="caption">Video</Typography>
          </Box>
          <ReactPlayer
            url={mediaUrl}
            controls
            playing={autoPlayEnabled}
            width="100%"
            height="200px"
            light={!autoPlayEnabled}
          />
        </Box>
      )}

      {/* Audio Player */}
      {type === "audio" && mediaUrl && (
        <Box sx={{ mb: 2 }} onClick={(e) => e.stopPropagation()}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 1,
              color: "text.secondary",
            }}
          >
            <Audiotrack fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="caption">Audio</Typography>
          </Box>
          <AudioPlayer
            src={mediaUrl}
            autoPlay={autoPlayEnabled}
            showJumpControls={false}
            layout="horizontal-reverse"
            customVolumeControls={[]}
            customAdditionalControls={[]}
            style={{ borderRadius: "8px" }}
          />
        </Box>
      )}

      {/* Image Grid */}
      {imageUrls && imageUrls.length > 0 && (
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
          {imageUrls.slice(0, 4).map((url, index) => (
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
              {index === 3 && imageUrls && imageUrls.length > 4 && (
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
                    +{imageUrls.length - 4}
                  </Typography>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      )}
    </>
  );
}
