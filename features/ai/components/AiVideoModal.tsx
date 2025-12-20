"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  Box,
  TextField,
  Typography,
  CircularProgress,
  Stack,
  IconButton,
} from "@mui/material";
import { Close, VideoLibrary, Image } from "@mui/icons-material";
import { aiService, AiVideoResponse } from "../api/aiService";

interface AiVideoModalProps {
  open: boolean;
  onClose: () => void;
  onVideoSelect: (videoUrl: string) => void;
}

export function AiVideoModal({ open, onClose, onVideoSelect }: AiVideoModalProps) {
  const [tab, setTab] = useState(0);
  const [prompt, setPrompt] = useState("");
  const [sourceImage, setSourceImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<AiVideoResponse['status'] | null>(null);
  const [operationId, setOperationId] = useState<string | null>(null);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleReset = () => {
    setPrompt("");
    setSourceImage(null);
    setLoading(false);
    setStatus(null);
    setOperationId(null);
    setGeneratedVideo(null);
    setError(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  // Poll for status
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (operationId && (status === 'pending' || status === 'processing')) {
      interval = setInterval(async () => {
        try {
          const response = await aiService.getVideoStatus(operationId);
          setStatus(response.status);
          if (response.status === 'completed' && response.video_url) {
            setGeneratedVideo(response.video_url);
            setLoading(false);
            setOperationId(null);
          } else if (response.status === 'failed') {
            setError("Video generation failed.");
            setLoading(false);
            setOperationId(null);
          }
        } catch (e) {
          console.error(e);
          setError("Failed to check status.");
          setLoading(false);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [operationId, status]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setStatus('pending');
    try {
      let response: AiVideoResponse;
      if (tab === 0) {
        response = await aiService.generateVideo(prompt);
      } else {
        if (!sourceImage) return;
        response = await aiService.generateVideoFromImage(sourceImage, prompt);
      }
      setOperationId(response.operation_id);
      setStatus(response.status);
    } catch {
      setError("Failed to start generation.");
      setLoading(false);
      setStatus(null);
    }
  };

  const handleSourceImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSourceImage(e.target.files[0]);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        AI Video Studio (VEO)
        <IconButton onClick={handleClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Tabs value={tab} onChange={(_, v) => { setTab(v); handleReset(); }} sx={{ mb: 3 }}>
          <Tab icon={<VideoLibrary />} label="Text to Video" iconPosition="start" />
          <Tab icon={<Image />} label="Image to Video" iconPosition="start" />
        </Tabs>

        <Stack spacing={3}>
          {tab === 1 && (
            <Box>
              <Button variant="outlined" component="label">
                Upload Source Image
                <input type="file" hidden accept="image/*" onChange={handleSourceImageChange} />
              </Button>
              {sourceImage && <Typography variant="caption" sx={{ ml: 2 }}>{sourceImage.name}</Typography>}
            </Box>
          )}

          <TextField
            fullWidth
            multiline
            rows={3}
            label={tab === 0 ? "Describe the video..." : "Describe how to animate the image..."}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
            placeholder={tab === 0 ? "A cinematic drone shot of a coastline..." : "Make the water flow..."}
          />

          {error && <Typography color="error">{error}</Typography>}

          {(loading || generatedVideo) && (
            <Box sx={{ display: "flex", justifyContent: "center", minHeight: 300, bgcolor: "background.default", borderRadius: 2, alignItems: "center", position: "relative" }}>
               {loading ? (
                 <Stack alignItems="center" spacing={1}>
                   <CircularProgress />
                   <Typography variant="caption">Generating... Status: {status}</Typography>
                 </Stack>
               ) : (
                  <video src={generatedVideo!} controls style={{ maxWidth: '100%', maxHeight: 400 }} />
               )}
            </Box>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} disabled={loading}>Cancel</Button>
        {!generatedVideo ? (
           <Button
             data-testid="generate-video-btn"
             variant="contained"
             onClick={handleGenerate}
             disabled={loading || !prompt.trim() || (tab === 1 && !sourceImage)}
           >
             Generate Video
           </Button>
        ) : (
          <Button variant="contained" color="success" onClick={() => { onVideoSelect(generatedVideo!); handleClose(); }}>
            Add to Thread
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
