import React from "react";
import { Box, ToggleButtonGroup, ToggleButton } from "@mui/material";
import {
  TextFields,
  Code,
  Link as LinkIcon,
  VideoLibrary,
  Audiotrack,
} from "@mui/icons-material";

type ThreadMode = "text" | "markdown" | "link" | "video" | "audio";

interface ContentTypeSelectorProps {
  mode: ThreadMode;
  setMode: (mode: ThreadMode) => void;
  disabled?: boolean;
}

export function ContentTypeSelector({
  mode,
  setMode,
  disabled,
}: ContentTypeSelectorProps) {
  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
      <ToggleButtonGroup
        value={mode}
        exclusive
        onChange={(_, newMode) => {
          if (newMode) setMode(newMode);
        }}
        aria-label="editor mode"
        size="small"
        disabled={disabled}
      >
        <ToggleButton value="text" aria-label="plain text" sx={{ px: 2 }}>
          <TextFields fontSize="small" sx={{ mr: 1 }} />
          Text
        </ToggleButton>
        <ToggleButton value="markdown" aria-label="markdown" sx={{ px: 2 }}>
          <Code fontSize="small" sx={{ mr: 1 }} />
          Markdown
        </ToggleButton>
        <ToggleButton value="link" aria-label="link" sx={{ px: 2 }}>
          <LinkIcon fontSize="small" sx={{ mr: 1 }} />
          Link
        </ToggleButton>
        <ToggleButton value="video" aria-label="video" sx={{ px: 2 }}>
          <VideoLibrary fontSize="small" sx={{ mr: 1 }} />
          Video
        </ToggleButton>
        <ToggleButton value="audio" aria-label="audio" sx={{ px: 2 }}>
          <Audiotrack fontSize="small" sx={{ mr: 1 }} />
          Audio
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}
