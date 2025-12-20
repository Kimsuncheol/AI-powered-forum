"use client";
import React, { useState } from "react";
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
import { Close, Audiotrack, MusicNote } from "@mui/icons-material";
import { aiService } from "../api/aiService";

interface AiMusicModalProps {
  open: boolean;
  onClose: () => void;
  onMusicSelect: (audioUrl: string) => void;
}

export function AiMusicModal({ open, onClose, onMusicSelect }: AiMusicModalProps) {
  const [tab, setTab] = useState(0);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleReset = () => {
    setPrompt("");
    setLoading(false);
    setGeneratedAudio(null);
    setError(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await aiService.generateSimpleMusic(prompt);
      setGeneratedAudio(response.audio_url);
    } catch {
      setError("Failed to generate music.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        AI Music Studio (Lyria)
        <IconButton onClick={handleClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Tabs value={tab} onChange={(_, v) => { setTab(v); handleReset(); }} sx={{ mb: 3 }}>
          <Tab icon={<MusicNote />} label="Simple Generation" iconPosition="start" />
          {/* Future: Advanced configurable generation */}
        </Tabs>

        <Stack spacing={3}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Describe the music..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
            placeholder="Lo-fi hip hop beat for studying..."
          />

          {error && <Typography color="error">{error}</Typography>}

          {(loading || generatedAudio) && (
            <Box sx={{ display: "flex", justifyContent: "center", minHeight: 150, bgcolor: "background.default", borderRadius: 2, alignItems: "center", p: 3 }}>
               {loading ? (
                 <CircularProgress />
               ) : (
                 <audio src={generatedAudio!} controls style={{ width: '100%' }} />
               )}
            </Box>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} disabled={loading}>Cancel</Button>
        {!generatedAudio ? (
           <Button
             data-testid="generate-music-btn"
             variant="contained"
             onClick={handleGenerate}
             disabled={loading || !prompt.trim()}
             startIcon={<Audiotrack />}
           >
             Generate Music
           </Button>
        ) : (
          <Button variant="contained" color="success" onClick={() => { onMusicSelect(generatedAudio!); handleClose(); }}>
            Add to Thread
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
