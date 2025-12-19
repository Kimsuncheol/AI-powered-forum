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
} from "@mui/material";
import { TextFields, Code, Link as LinkIcon, VideoLibrary, Audiotrack } from "@mui/icons-material";
import { ThreadCreateInput } from "../../types";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/features/meta/categories";
import { ProgressiveTagInput } from "@/components/inputs/ProgressiveTagInput";
import { MarkdownEditor } from "./MarkdownEditor";
import { ImageDropZone } from "./ImageDropZone";

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
        mediaUrl: (mode === 'video' || mode === 'audio') ? mediaUrl : undefined,
        imageUrls: images.length > 0 ? images : undefined,
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
                  <TextField
                    label={mode === 'video' ? "Video URL" : "Audio URL"}
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    onBlur={() => setTouched(prev => ({ ...prev, mediaUrl: true }))}
                    error={touched.mediaUrl && !!errors.mediaUrl}
                    helperText={(touched.mediaUrl && errors.mediaUrl) || (mode === 'video' ? "Supports YouTube, Vimeo, and direct video URLs" : "Supports MP3, WAV, and other audio formats")}
                    required
                    fullWidth
                    sx={{ mb: 2 }}
                    disabled={loading}
                    placeholder={mode === 'video' ? "https://youtube.com/watch?v=..." : "https://example.com/audio.mp3"}
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
            </Box>

            {/* Image Drop Zone - Available in All Modes */}
            <ImageDropZone
              images={images}
              onChange={setImages}
              disabled={loading}
              maxImages={4}
            />
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
          >
            {loading ? "Publishing..." : "Publish"}
          </Button>
        </CardActions>
      </form>
    </Card>
  );
}
