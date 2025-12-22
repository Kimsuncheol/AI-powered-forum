"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Checkbox,
  FormControlLabel,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Warning } from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";
import { deleteUserAccount } from "../services/accountDeletion.service";

interface DeleteAccountModalProps {
  open: boolean;
  onClose: () => void;
}

export default function DeleteAccountModal({ open, onClose }: DeleteAccountModalProps) {
  const { user } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [understood, setUnderstood] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEmailPasswordUser = user?.providerData[0]?.providerId === 'password';
  const canDelete = understood && confirmText === "DELETE" && (isEmailPasswordUser ? password.length > 0 : true);

  const handleDelete = async () => {
    if (!user || !canDelete) return;

    setLoading(true);
    setError(null);

    try {
      await deleteUserAccount(user.uid, isEmailPasswordUser ? password : undefined);
      // Account deleted successfully - user will be redirected by auth state change
    } catch (err: any) {
      console.error("Error deleting account:", err);
      setError(err.message || "Failed to delete account. Please try again.");
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setPassword("");
    setConfirmText("");
    setUnderstood(false);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <Warning color="error" />
          <Typography variant="h6">Delete Account</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Alert severity="error" sx={{ mb: 2 }}>
          This action cannot be undone. All your data will be permanently deleted.
        </Alert>

        <Typography variant="body2" color="text.secondary" paragraph>
          Deleting your account will permanently remove:
        </Typography>
        <Box component="ul" sx={{ pl: 2, mb: 2 }}>
          <Typography component="li" variant="body2" color="text.secondary">
            All your threads and posts
          </Typography>
          <Typography component="li" variant="body2" color="text.secondary">
            All your comments
          </Typography>
          <Typography component="li" variant="body2" color="text.secondary">
            Your profile and settings
          </Typography>
          <Typography component="li" variant="body2" color="text.secondary">
            AI usage history and quota
          </Typography>
        </Box>

        {isEmailPasswordUser && (
          <TextField
            fullWidth
            type="password"
            label="Enter your password to confirm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            sx={{ mb: 2 }}
          />
        )}

        <TextField
          fullWidth
          label='Type "DELETE" to confirm'
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          disabled={loading}
          sx={{ mb: 2 }}
          helperText="Please type DELETE in capital letters"
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={understood}
              onChange={(e) => setUnderstood(e.target.checked)}
              disabled={loading}
            />
          }
          label="I understand this action is permanent and cannot be undone"
        />

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          color="error"
          variant="contained"
          disabled={!canDelete || loading}
          startIcon={loading && <CircularProgress size={16} />}
        >
          {loading ? "Deleting..." : "Delete Account"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
