import React from "react";
import {
  TextField,
  Box,
  Typography,
  Button,
} from "@mui/material";
import { AutoAwesome } from "@mui/icons-material";
import { MarkdownEditor } from "./MarkdownEditor";
import ReactPlayer from "react-player";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

type ThreadMode = "text" | "markdown" | "link" | "video" | "audio";

interface ContentInputProps {
  mode: ThreadMode;
  body: string;
  setBody: (value: string) => void;
  linkUrl: string;
  setLinkUrl: (value: string) => void;
  mediaUrl: string;
  setMediaUrl: (value: string) => void;
  loading: boolean;
  touched: { body: boolean; linkUrl: boolean; mediaUrl: boolean };
  errors: { body?: string; linkUrl?: string; mediaUrl?: string };
  onBlur: (field: string) => void;
  setVideoModalOpen: (open: boolean) => void;
  setMusicModalOpen: (open: boolean) => void;
}

export function ContentInput({
  mode,
  body,
  setBody,
  linkUrl,
  setLinkUrl,
  mediaUrl,
  setMediaUrl,
  loading,
  touched,
  errors,
  onBlur,
  setVideoModalOpen,
  setMusicModalOpen,
}: ContentInputProps) {
  return (
    <Box>
      {mode === "text" && (
        <TextField
          label="Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onBlur={() => onBlur("body")}
          error={touched.body && !!errors.body}
          helperText={touched.body && errors.body}
          required
          fullWidth
          multiline
          minRows={6}
          disabled={loading}
          placeholder="Elaborate on your topic..."
        />
      )}

      {mode === "markdown" && (
        <Box>
          <MarkdownEditor
            value={body}
            onChange={setBody}
            disabled={loading}
            placeholder="Elaborate on your topic using Markdown..."
            minHeight="300px"
          />
          {touched.body && !!errors.body && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
              {errors.body}
            </Typography>
          )}
        </Box>
      )}

      {mode === "link" && (
        <Box>
          <TextField
            label="URL"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onBlur={() => onBlur("linkUrl")}
            error={touched.linkUrl && !!errors.linkUrl}
            helperText={touched.linkUrl && errors.linkUrl}
            required
            fullWidth
            sx={{ mb: 2 }}
            disabled={loading}
            placeholder="https://example.com"
          />
          <TextField
            label="Description (Optional)"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            fullWidth
            multiline
            minRows={3}
            disabled={loading}
            placeholder="Add a short description..."
          />
        </Box>
      )}

      {(mode === "video" || mode === "audio") && (
        <Box>
          <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start", mb: 2 }}>
            <TextField
              label={mode === "video" ? "Video URL" : "Audio URL"}
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              onBlur={() => onBlur("mediaUrl")}
              error={touched.mediaUrl && !!errors.mediaUrl}
              helperText={
                (touched.mediaUrl && errors.mediaUrl) ||
                (mode === "video"
                  ? "Supports YouTube, Vimeo, and direct video URLs"
                  : "Supports MP3, WAV, and other audio formats")
              }
              required
              fullWidth
              disabled={loading}
              placeholder={
                mode === "video"
                  ? "https://youtube.com/watch?v=..."
                  : "https://example.com/audio.mp3"
              }
            />
            <Button
              startIcon={<AutoAwesome />}
              onClick={() =>
                mode === "video" ? setVideoModalOpen(true) : setMusicModalOpen(true)
              }
              variant="outlined"
              sx={{ height: 56, flexShrink: 0 }}
            >
              Generate
            </Button>
          </Box>

          {mode === "video" && mediaUrl && (
            <Box
              sx={{
                mt: 2,
                mb: 2,
                borderRadius: 2,
                overflow: "hidden",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              {/* @ts-expect-error ReactPlayer types compatibility issue */}
              <ReactPlayer url={mediaUrl} controls width="100%" />
            </Box>
          )}

          {mode === "audio" && mediaUrl && (
            <Box sx={{ mt: 2, mb: 2 }}>
              <AudioPlayer src={mediaUrl} />
            </Box>
          )}

          <TextField
            label="Description (Optional)"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            fullWidth
            multiline
            minRows={3}
            disabled={loading}
            placeholder="Add a short description..."
          />
        </Box>
      )}
    </Box>
  );
}
