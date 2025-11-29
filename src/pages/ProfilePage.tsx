import React, { useState, useCallback } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  Container,
  Grid,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const ProfilePage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "Demo User",
    email: "demo@example.com",
    country: "United States",
  });
  const [avatarUrl, setAvatarUrl] = useState<string>(
    "/static/images/avatar/2.jpg"
  );

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarUrl(reader.result as string);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    console.log("Stored in DB:", { ...formData, avatarUrl });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom align="center">
          Edit Profile
        </Typography>

        <Grid container spacing={4} alignItems="center">
          {/* Avatar Section */}
          <Grid
            size={{ xs: 12, md: 4 }}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              {...getRootProps()}
              sx={{
                border: "2px dashed",
                borderColor: isDragActive ? "primary.main" : "grey.400",
                borderRadius: "50%",
                p: 1,
                cursor: "pointer",
                transition: "border-color 0.2s",
                "&:hover": {
                  borderColor: "primary.main",
                },
                position: "relative",
              }}
            >
              <input {...getInputProps()} />
              <Avatar
                src={avatarUrl}
                alt="Profile"
                sx={{ width: 150, height: 150 }}
              />
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  bgcolor: "background.paper",
                  borderRadius: "50%",
                  p: 0.5,
                  boxShadow: 1,
                }}
              >
                <CloudUploadIcon color="primary" />
              </Box>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              {isDragActive ? "Drop image here" : "Click or drag to upload"}
            </Typography>
          </Grid>

          {/* User Details Section */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Box component="form" noValidate autoComplete="off">
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
              />

              <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                <Button variant="contained" size="large" onClick={handleSave}>
                  Save Changes
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProfilePage;
