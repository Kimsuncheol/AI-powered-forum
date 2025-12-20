"use client";
import React, { useState, useCallback } from "react";
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
import { Close, AutoAwesome, Edit } from "@mui/icons-material";
import { useDrop, DndProvider } from "react-dnd";
import { HTML5Backend, NativeTypes } from "react-dnd-html5-backend";
import { aiService } from "../api/aiService";

interface AiImageModalProps {
  open: boolean;
  onClose: () => void;
  onImageSelect: (imageUrl: string) => void;
}

interface SingleImageDropZoneProps {
  image: File | null;
  onDrop: (file: File) => void;
  disabled?: boolean;
}

function SingleImageDropZone({ image, onDrop, disabled }: SingleImageDropZoneProps) {
  const handleFileDrop = useCallback(
    (files: File[]) => {
      if (disabled) return;
      const file = files.find(f => f.type.startsWith("image/"));
      if (file) {
        onDrop(file);
      }
    },
    [onDrop, disabled]
  );

  const [{ isOver, canDrop }, dropRef] = useDrop(
    () => ({
      accept: NativeTypes.FILE,
      drop: (item: { files: File[] }) => {
        handleFileDrop(item.files);
      },
      canDrop: () => !disabled,
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [handleFileDrop, disabled]
  );

  const isActive = isOver && canDrop;

  return (
    <Box
      ref={dropRef as unknown as React.Ref<HTMLDivElement>}
      sx={{
        border: 2,
        borderStyle: "dashed",
        borderColor: isActive ? "primary.main" : "divider",
        borderRadius: 2,
        p: 3,
        textAlign: "center",
        bgcolor: isActive ? "action.hover" : "background.default",
        cursor: disabled ? "not-allowed" : "pointer",
        minHeight: 200,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s",
      }}
    >
      {image ? (
        <Box sx={{ position: "relative", width: "100%", height: "100%", maxHeight: 200 }}>
          <Box
            component="img"
            src={URL.createObjectURL(image)}
            alt="Upload preview"
            sx={{ width: "100%", height: "100%", maxHeight: 200, objectFit: "contain" }}
          />
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            {image.name}
          </Typography>
        </Box>
      ) : (
        <Typography color="text.secondary">
          Drag and drop an image here to edit
        </Typography>
      )}
    </Box>
  );
}

export function AiImageModal({ open, onClose, onImageSelect }: AiImageModalProps) {
  const [tab, setTab] = useState(0);
  const [prompt, setPrompt] = useState("");
  const [sourceImage, setSourceImage] = useState<File | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReset = () => {
    setPrompt("");
    setSourceImage(null);
    setGeneratedImage(null);
    setError(null);
    setLoading(false);
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
      const response = await aiService.generateImage(prompt);
      setGeneratedImage(`data:image/png;base64,${response.b64_json}`);
    } catch {
      setError("Failed to generate image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!prompt.trim() || !sourceImage) return;
    setLoading(true);
    setError(null);
    try {
      const response = await aiService.editImage(sourceImage, prompt);
      setGeneratedImage(`data:image/png;base64,${response.b64_json}`);
    } catch {
      setError("Failed to edit image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (generatedImage) {
      onImageSelect(generatedImage);
      handleClose();
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          AI Image Studio
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Tabs value={tab} onChange={(_, v) => { setTab(v); handleReset(); }} sx={{ mb: 3 }}>
            <Tab icon={<AutoAwesome />} label="Generate" iconPosition="start" />
            <Tab icon={<Edit />} label="Edit" iconPosition="start" />
          </Tabs>

          <Stack spacing={3}>
            {tab === 1 && (
              <SingleImageDropZone
                image={sourceImage}
                onDrop={setSourceImage}
                disabled={loading}
              />
            )}

            <TextField
              fullWidth
              multiline
              rows={3}
              label={tab === 0 ? "Describe the image you want to generate..." : "Describe how to edit the image..."}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
              placeholder={tab === 0 ? "A futuristic city with flying cars..." : "Make the sky purple..."}
            />

            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}

            {(loading || generatedImage) && (
              <Box sx={{ display: "flex", justifyContent: "center", minHeight: 300, bgcolor: "background.default", borderRadius: 2, alignItems: "center", position: "relative", overflow: "hidden" }}>
                {loading ? (
                  <CircularProgress />
                ) : (
                  <Box
                    component="img"
                    src={generatedImage!}
                    alt="AI Generated"
                    sx={{ maxWidth: "100%", maxHeight: 400, objectFit: "contain" }}
                  />
                )}
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          {!generatedImage ? (
            <Button
              data-testid="ai-action-button"
              variant="contained"
              onClick={tab === 0 ? handleGenerate : handleEdit}
              disabled={loading || !prompt.trim() || (tab === 1 && !sourceImage)}
              startIcon={tab === 0 ? <AutoAwesome /> : <Edit />}
            >
              {tab === 0 ? "Generate" : "Edit Image"}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleConfirm}
              color="success"
            >
              Add to Thread
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </DndProvider>
  );
}
