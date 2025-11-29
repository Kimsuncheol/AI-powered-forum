import React, { useState, useCallback } from "react";
import { Box, Typography, Button, Paper, IconButton } from "@mui/material";
import { useDropzone } from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";

interface MediaUploadProps {
  onPost: (file: File) => void;
}

const MediaUpload: React.FC<MediaUploadProps> = ({ onPost }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

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

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setPreview(null);
  };

  const handlePost = () => {
    if (file) {
      onPost(file);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Paper
        variant="outlined"
        sx={{
          p: 4,
          mb: 2,
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
          <Box sx={{ position: "relative", maxWidth: "100%", maxHeight: 300 }}>
            <img
              src={preview}
              alt="Preview"
              style={{ maxWidth: "100%", maxHeight: 300, borderRadius: 4 }}
            />
            <IconButton
              onClick={handleRemove}
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
            <Typography variant="h6" color="text.secondary" align="center">
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

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" onClick={handlePost} disabled={!file}>
          Post
        </Button>
      </Box>
    </Box>
  );
};

export default MediaUpload;
