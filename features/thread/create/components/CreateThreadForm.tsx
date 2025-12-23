"use client";
import React, { useState } from "react";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Card,
  CardContent,
  CardActions,
  Stack,
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { TextFields, Code, Link as LinkIcon, VideoLibrary, Audiotrack, Warning, Place } from "@mui/icons-material";
import { ThreadCreateInput, LocationData } from "../../types";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/features/meta/categories";
import { ProgressiveTagInput } from "@/components/inputs/ProgressiveTagInput";
import { MarkdownEditor } from "./MarkdownEditor";
import { ImageDropZone } from "./ImageDropZone";
import { AiImageModal } from "../../../ai/components/AiImageModal";
import { AiVideoModal } from "../../../ai/components/AiVideoModal";
import { AiMusicModal } from "../../../ai/components/AiMusicModal";
import { AutoAwesome } from "@mui/icons-material";
import ReactPlayer from "react-player";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import LocationPicker from "@/features/location/components/LocationPicker";

interface CreateThreadFormProps {
  onSubmit: (data: ThreadCreateInput) => Promise<void>;
  loading: boolean;
  error: Error | null;
}

export function CreateThreadForm({ onSubmit, loading, error }: CreateThreadFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [mode, setMode] = useState<'text' | 'markdown' | 'link' | 'video' | 'audio'>('text');
  const [linkUrl, setLinkUrl] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [isNSFW, setIsNSFW] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [musicModalOpen, setMusicModalOpen] = useState(false);
  const [location, setLocation] = useState<LocationData | undefined>();
  const [locationOpen, setLocationOpen] = useState(false);
  
  const [touched, setTouched] = useState({ title: false, body: false, category: false, linkUrl: false, mediaUrl: false });

  const validate = () => {
    const errors: { title?: string; body?: string; category?: string; linkUrl?: string; mediaUrl?: string } = {};
    if (!title.trim()) errors.title = "Title is required";
    else if (title.length > 120) errors.title = "Title must be 120 characters or less";
    
    if (!['link', 'video', 'audio'].includes(mode) && !body.trim()) errors.body = "Body content is required";
    if (mode === 'link' && !linkUrl.trim()) errors.linkUrl = "URL is required";
    if (mode === 'link' && linkUrl.trim() && !/^https?:\/\/.+/.test(linkUrl)) errors.linkUrl = "URL must start with http:// or https://";
    if ((mode === 'video' || mode === 'audio') && !mediaUrl.trim()) errors.mediaUrl = "Media URL is required";
    if ((mode === 'video' || mode === 'audio') && mediaUrl.trim() && !/^https?:\/\/.+/.test(mediaUrl)) errors.mediaUrl = "URL must start with http:// or https://";
    if (!categoryId) errors.category = "Category is required";
    
    return errors;
  };

  const errors = validate();
  const isValid = Object.keys(errors).length === 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ title: true, body: true, category: true, linkUrl: true, mediaUrl: true });
    
    if (!isValid) return;

    // Defensive: sanitize tags before submit (already validated by ProgressiveTagInput)
    const sanitizedTags = tagIds.map(t => t.trim()).filter(t => t.length > 0);

    try {
      await onSubmit({
        title: title.trim(),
        body: body.trim(),
        categoryId,
        tagIds: sanitizedTags,
        type: mode,
        linkUrl: mode === 'link' ? linkUrl : undefined,
        mediaUrl: mode === 'video' || mode === 'audio' ? mediaUrl : undefined,
        imageUrls: images.length > 0 ? images : undefined,
        isNSFW,
        location,
      });
    } catch {
      // Error handled by parent
    }
  };

  return (
    <Card sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
      <form onSubmit={handleSubmit} noValidate>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
            Create a New Thread
          </Typography>

          <Stack spacing={3} sx={{ mt: 2 }}>
            {error && (
              <Alert severity="error">
                {error.message}
              </Alert>
            )}

            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setTouched(prev => ({ ...prev, title: true }))}
              error={touched.title && !!errors.title}
              helperText={(touched.title && errors.title) || `${title.length}/120`}
              required
              fullWidth
              disabled={loading}
              placeholder="What's on your mind?"
              slotProps={{ htmlInput: { maxLength: 120 } }}
            />

            <FormControl fullWidth required error={touched.category && !!errors.category}>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                value={categoryId}
                label="Category"
                onChange={(e) => setCategoryId(e.target.value)}
                onBlur={() => setTouched(prev => ({ ...prev, category: true }))}
                disabled={loading}
              >
                {CATEGORIES.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.label}
                  </MenuItem>
                ))}
              </Select>
              {touched.category && errors.category && (
                <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5, mx: 1.75 }}>
                  {errors.category}
                </Box>
              )}
            </FormControl>

            <ProgressiveTagInput
              value={tagIds}
              onChange={setTagIds}
              disabled={loading}
              maxTags={5}
            />

            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                <ToggleButtonGroup
                  value={mode}
                  exclusive
                  onChange={(_, newMode) => {
                    if (newMode) setMode(newMode);
                  }}
                  aria-label="editor mode"
                  size="small"
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

              {mode === 'text' && (
                <TextField
                  label="Body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  onBlur={() => setTouched(prev => ({ ...prev, body: true }))}
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

              {mode === 'markdown' && (
                <Box>
                  <MarkdownEditor
                    value={body}
                    onChange={setBody}
                    disabled={loading}
                    placeholder="Elaborate on your topic using Markdown..."
                    minHeight="300px"
                  />
                  {(touched.body && !!errors.body) && (
                     <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                       {errors.body}
                     </Typography>
                  )}
                </Box>
              )}

              {mode === 'link' && (
                <Box>
                  <TextField
                    label="URL"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    onBlur={() => setTouched(prev => ({ ...prev, linkUrl: true }))}
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

              {(mode === 'video' || mode === 'audio') && (
                <Box>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', mb: 2 }}>
                    <TextField
                      label={mode === 'video' ? "Video URL" : "Audio URL"}
                      value={mediaUrl}
                      onChange={(e) => setMediaUrl(e.target.value)}
                      onBlur={() => setTouched(prev => ({ ...prev, mediaUrl: true }))}
                      error={touched.mediaUrl && !!errors.mediaUrl}
                      helperText={(touched.mediaUrl && errors.mediaUrl) || (mode === 'video' ? "Supports YouTube, Vimeo, and direct video URLs" : "Supports MP3, WAV, and other audio formats")}
                      required
                      fullWidth
                      disabled={loading}
                      placeholder={mode === 'video' ? "https://youtube.com/watch?v=..." : "https://example.com/audio.mp3"}
                    />
                     <Button
                      startIcon={<AutoAwesome />}
                      onClick={() => mode === 'video' ? setVideoModalOpen(true) : setMusicModalOpen(true)}
                      variant="outlined"
                      sx={{ height: 56, flexShrink: 0 }}
                    >
                      Generate
                    </Button>
                  </Box>

                  {mode === 'video' && mediaUrl && (
                    <Box sx={{ mt: 2, mb: 2, borderRadius: 2, overflow: 'hidden', border: '1px solid config.borderColor' }}>
                      {/* @ts-expect-error ReactPlayer types compatibility issue */}
                      <ReactPlayer url={mediaUrl} controls width="100%" />
                    </Box>
                  )}

                  {mode === 'audio' && mediaUrl && (
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

            {/* NSFW Checkbox */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={isNSFW}
                  onChange={(e) => setIsNSFW(e.target.checked)}
                  disabled={loading}
                  icon={<Warning />}
                  checkedIcon={<Warning />}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    Mark as NSFW (Not Safe For Work)
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Check this if your content contains sensitive material
                  </Typography>
                </Box>
              }
            />

            {/* Image Drop Zone - Available in All Modes */}
            <ImageDropZone
              images={images}
              onChange={setImages}
              disabled={loading}
              maxImages={4}
            />

            <Button
              startIcon={<AutoAwesome />}
              onClick={() => setAiModalOpen(true)}
              variant="outlined"
              size="small"
              sx={{ alignSelf: "flex-start" }}
            >
              Generate with AI
            </Button>

            <AiImageModal
              open={aiModalOpen}
              onClose={() => setAiModalOpen(false)}
              onImageSelect={(imageUrl) => setImages(prev => [...prev, imageUrl])}
            />

            <AiVideoModal
              open={videoModalOpen}
              onClose={() => setVideoModalOpen(false)}
              onVideoSelect={setMediaUrl}
            />

            <AiMusicModal
              open={musicModalOpen}
              onClose={() => setMusicModalOpen(false)}
              onMusicSelect={setMediaUrl}
            />

            {/* Location Picker */}
            <Box>
              <Button
                startIcon={<Place />}
                onClick={() => setLocationOpen(!locationOpen)}
                variant={location ? "contained" : "outlined"}
                color={location ? "primary" : "inherit"}
                size="small"
                sx={{ mb: 1 }}
              >
                {location ? "Location Attached" : "Add Location"}
              </Button>
              
              {locationOpen && (
                <Box sx={{ mt: 1, p: 2, border: 1, borderColor: "divider", borderRadius: 1 }}>
                  <LocationPicker
                    value={location}
                    onChange={setLocation}
                  />
                  {location && (
                    <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
                      Selected: {location.address}
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          </Stack>
        </CardContent>
        <CardActions sx={{ px: 2, pb: 2, justifyContent: "flex-end", gap: 1 }}>
          <Button 
            variant="text" 
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !isValid}
            onClick={handleSubmit}
          >
            {loading ? "Publishing..." : "Publish"}
          </Button>
        </CardActions>
      </form>
    </Card>
  );
}
