"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Box,
} from "@mui/material";
import { Download } from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";
import { exportUserData } from "../services/dataExport.service";

interface DataExportModalProps {
  open: boolean;
  onClose: () => void;
}

export default function DataExportModal({ open, onClose }: DataExportModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleExport = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const data = await exportUserData(user.uid);
      
      // Create and download JSON file
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `forum-data-${user.uid}-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setSuccess(true);
    } catch (err: any) {
      console.error("Error exporting data:", err);
      setError(err.message || "Failed to export data");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setError(null);
    setSuccess(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Export Your Data</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" paragraph>
          Download a JSON file containing all your data including:
        </Typography>
        <Box component="ul" sx={{ pl: 2, mb: 2 }}>
          <Typography component="li" variant="body2" color="text.secondary">
            Profile information
          </Typography>
          <Typography component="li" variant="body2" color="text.secondary">
            All threads you've created
          </Typography>
          <Typography component="li" variant="body2" color="text.secondary">
            All comments you've made
          </Typography>
          <Typography component="li" variant="body2" color="text.secondary">
            AI usage history and quota information
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Data exported successfully! Check your downloads folder.
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          {success ? "Close" : "Cancel"}
        </Button>
        <Button
          onClick={handleExport}
          variant="contained"
          disabled={loading || success}
          startIcon={loading ? <CircularProgress size={16} /> : <Download />}
        >
          {loading ? "Exporting..." : "Export Data"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
