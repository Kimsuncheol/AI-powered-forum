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
  Stack,
  Alert,
} from "@mui/material";
import { authService } from "@/features/auth/services/auth.service";
import { toast } from "react-toastify";

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

export function ChangePasswordModal({ open, onClose }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1); // 1: Verify current, 2: Set new
  const [error, setError] = useState<string | null>(null);

  const handleVerifyCurrent = async () => {
    setError(null);
    setLoading(true);
    try {
      await authService.reauthenticate(currentPassword);
      setStep(2);
    } catch (err: unknown) {
      console.error("Reauthentication failed", err);
      setError("Incorrect password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    setError(null);
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await authService.updatePassword(newPassword);
      toast.success("Password updated successfully");
      handleClose();
    } catch (err: unknown) {
      console.error("Update password failed", err);
      const message = err instanceof Error ? err.message : "Failed to update password.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset state after transition
    setTimeout(() => {
      setStep(1);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setError(null);
    }, 300);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Change Password</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
          
          {step === 1 && (
            <>
              <Typography variant="body2" color="text.secondary">
                Please enter your current password to verify your identity.
              </Typography>
              <TextField
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                fullWidth
                required
                autoFocus
              />
            </>
          )}

          {step === 2 && (
            <>
              <Typography variant="body2" color="text.secondary">
                Enter your new password below.
              </Typography>
              <TextField
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                fullWidth
                required
                autoFocus
                helperText="At least 6 characters"
              />
              <TextField
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                required
              />
            </>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        {step === 1 ? (
          <Button 
            onClick={handleVerifyCurrent} 
            variant="contained" 
            disabled={!currentPassword || loading}
          >
            {loading ? "Verifying..." : "Next"}
          </Button>
        ) : (
          <Button 
            onClick={handleUpdatePassword} 
            variant="contained" 
            disabled={!newPassword || !confirmPassword || loading}
          >
            {loading ? "Updating..." : "Update Password"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
