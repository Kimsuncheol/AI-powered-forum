import React, { useState, useCallback } from "react";
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import { useAuth } from "../../context/AuthContext";

const ProfilePage = () => {
  const { user } = useAuth();
  const [username, setUsername] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [country, setCountry] = useState("USA");
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
    user?.avatarUrl
  );

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    multiple: false,
  });

  const handleSave = () => {
    console.log("Stored in DB:", { username, email, country, avatarPreview });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Edit Profile
        </Typography>

        <Box
          {...getRootProps()}
          sx={{
            mb: 3,
            p: 1,
            border: "2px dashed",
            borderColor: isDragActive ? "primary.main" : "grey.300",
            borderRadius: "50%",
            cursor: "pointer",
            transition: "border-color 0.2s",
            "&:hover": {
              borderColor: "primary.main",
            },
          }}
        >
          <input {...getInputProps()} />
          <Avatar
            src={avatarPreview}
            alt={username}
            sx={{ width: 100, height: 100 }}
          />
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 3 }}>
          {isDragActive
            ? "Drop image here"
            : "Drag & drop or click to upload avatar"}
        </Typography>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <TextField
            label="Username"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Country"
            fullWidth
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </Box>

        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleSave}
          sx={{ mt: 4 }}
        >
          Save
        </Button>
      </Paper>
    </Container>
  );
};

export default ProfilePage;
