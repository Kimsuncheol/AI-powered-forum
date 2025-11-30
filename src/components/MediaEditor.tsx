import React, { useState, useCallback } from "react";
import {
  Box,
  Tabs,
  Tab,
  TextField,
  Button,
  Paper,
  Typography,
  IconButton,
  Grid,
  CircularProgress,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

interface MediaEditorProps {
  onPost: (data: {
    file?: File;
    generatedMedia?: string[];
    prompt?: string;
    caption: string;
  }) => void;
}

const MediaEditor: React.FC<MediaEditorProps> = ({ onPost }) => {
  const [tab, setTab] = useState(0); // 0: Upload, 1: Generate
  const [caption, setCaption] = useState("");

  // Upload State
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Generate State
  const [prompt, setPrompt] = useState("");
  const [generatedMedia, setGeneratedMedia] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  // Dropzone Logic
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
      "video/*": [],
    },
    multiple: false,
  });

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setPreview(null);
  };

  const handleGenerate = () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    // Mock generation delay
    setTimeout(() => {
      // Mock generated image
      const mockImage = `https://picsum.photos/seed/${Date.now()}/400/300`;
      setGeneratedMedia((prev) => [...prev, mockImage]);
      setIsGenerating(false);
      setPrompt(""); // Optional: clear prompt after generation or keep it?
      // Prompt usually kept in AI tools to refine, but user requirement says "Enter prompt for adding another one"
      // which implies the input remains available.
    }, 1500);
  };

  const handlePost = () => {
    if (tab === 0 && file) {
      onPost({ file, caption });
    } else if (tab === 1 && generatedMedia.length > 0) {
      onPost({ generatedMedia, caption, prompt }); // Sending prompt as metadata if needed
    }
  };

  const isPostDisabled = () => {
    if (tab === 0) return !file;
    if (tab === 1) return generatedMedia.length === 0;
    return true;
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Paper variant="outlined" sx={{ mb: 2 }}>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          aria-label="media editor tabs"
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="Upload" />
          <Tab label="Generate" icon={<AutoAwesomeIcon />} iconPosition="end" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {tab === 0 ? (
            // Upload Tab
            <Box>
              <Paper
                variant="outlined"
                sx={{
                  p: 4,
                  mb: 3,
                  borderStyle: "dashed",
                  borderColor: isDragActive ? "primary.main" : "grey.400",
                  bgcolor: isDragActive ? "action.hover" : "background.paper",
                  cursor: "pointer",
                  transition: "border-color 0.2s",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 200,
                  position: "relative",
                }}
                {...getRootProps()}
              >
                <input {...getInputProps()} />

                {preview ? (
                  <Box
                    sx={{
                      position: "relative",
                      maxWidth: "100%",
                      maxHeight: 300,
                    }}
                  >
                    <img
                      src={preview}
                      alt="Preview"
                      style={{
                        maxWidth: "100%",
                        maxHeight: 300,
                        borderRadius: 4,
                        objectFit: "contain",
                      }}
                    />
                    <IconButton
                      onClick={handleRemoveFile}
                      sx={{
                        position: "absolute",
                        top: -10,
                        right: -10,
                        bgcolor: "background.paper",
                        boxShadow: 1,
                        "&:hover": { bgcolor: "grey.200" },
                      }}
                      size="small"
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                    <Typography
                      variant="caption"
                      display="block"
                      align="center"
                      sx={{ mt: 1 }}
                    >
                      {file?.name}
                    </Typography>
                  </Box>
                ) : (
                  <>
                    <CloudUploadIcon
                      sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                    />
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      align="center"
                    >
                      {isDragActive
                        ? "Drop the file here"
                        : "Drag files here or click to upload"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      align="center"
                      sx={{ mt: 1 }}
                    >
                      Supports images and videos
                    </Typography>
                  </>
                )}
              </Paper>
            </Box>
          ) : (
            // Generate Tab
            <Box sx={{ mb: 3 }}>
              {/* 1. Generated Media Area */}
              {generatedMedia.length > 0 && (
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {generatedMedia.map((media, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                      <Box sx={{ position: "relative" }}>
                        <img
                          src={media}
                          alt={`Generated ${index + 1}`}
                          style={{
                            width: "100%",
                            borderRadius: 4,
                            display: "block",
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={() =>
                            setGeneratedMedia((prev) =>
                              prev.filter((_, i) => i !== index)
                            )
                          }
                          sx={{
                            position: "absolute",
                            top: 4,
                            right: 4,
                            bgcolor: "background.paper",
                            "&:hover": { bgcolor: "grey.200" },
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}

              {/* 2. Prompt Input */}
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "flex-start",
                  mb: 3,
                }}
              >
                <TextField
                  fullWidth
                  multiline
                  minRows={2}
                  label="Prompt"
                  placeholder="Describe the image you want to generate..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  variant="outlined"
                  helperText={
                    generatedMedia.length > 0
                      ? "Enter prompt for adding another one"
                      : "Enter prompt to generate"
                  }
                />
                <Button
                  variant="contained"
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating}
                  startIcon={
                    isGenerating ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <AutoAwesomeIcon />
                    )
                  }
                  sx={{ mt: 1, minWidth: 120 }}
                >
                  {isGenerating ? "Generating" : "Generate"}
                </Button>
              </Box>
            </Box>
          )}

          {/* 3. Caption Input (Shared) */}
          <TextField
            fullWidth
            multiline
            minRows={2}
            label="Caption"
            placeholder="Add a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            variant="outlined"
          />
        </Box>
      </Paper>

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          onClick={handlePost}
          disabled={isPostDisabled()}
        >
          Post
        </Button>
      </Box>
    </Box>
  );
};

export default MediaEditor;
