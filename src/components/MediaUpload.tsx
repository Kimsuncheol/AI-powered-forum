import React, { useState, useCallback } from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { useDropzone } from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

interface MediaUploadProps {
  onPost: (file: File) => void;
}

const MediaUpload: React.FC<MediaUploadProps> = ({ onPost }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      if (uploadedFile.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(uploadedFile);
      } else {
        setPreview(null);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  const handlePost = () => {
    if (file) {
      onPost(file);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Paper
        {...getRootProps()}
        variant="outlined"
        sx={{
          p: 4,
          border: "2px dashed",
          borderColor: isDragActive ? "primary.main" : "grey.300",
          bgcolor: isDragActive ? "action.hover" : "background.paper",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 200,
          transition: "border-color 0.2s",
        }}
      >
        <input {...getInputProps()} />
        {preview ? (
          <Box
            component="img"
            src={preview}
            alt="Preview"
            sx={{ maxWidth: "100%", maxHeight: 300, objectFit: "contain" }}
          />
        ) : file ? (
          <Box sx={{ textAlign: "center" }}>
            <CloudUploadIcon
              sx={{ fontSize: 48, color: "text.secondary", mb: 1 }}
            />
            <Typography variant="h6">{file.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </Typography>
          </Box>
        ) : (
          <Box sx={{ textAlign: "center" }}>
            <CloudUploadIcon
              sx={{ fontSize: 48, color: "text.secondary", mb: 1 }}
            />
            <Typography variant="h6">
              Drag files here or click to upload
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Support for images, videos, and documents
            </Typography>
          </Box>
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
