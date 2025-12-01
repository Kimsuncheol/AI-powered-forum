import React, { useState } from "react";
import { Box, TextField, Button, Typography, Link, Alert } from "@mui/material";

interface ResetPasswordFormProps {
  onBack: () => void;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ onBack }) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!email) {
      setError("Email is required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Mock API call
    setError("");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Box sx={{ mt: 1, width: "100%", textAlign: "center" }}>
        <Alert severity="success" sx={{ mb: 2 }}>
          Check your email! We've sent a link to reset your password.
        </Alert>
        <Button onClick={onBack} variant="outlined" fullWidth>
          Back to Sign In
        </Button>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: "100%" }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Enter your email address and we'll send you a link to reset your
        password.
      </Typography>
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={!!error}
        helperText={error}
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Send Reset Link
      </Button>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Link
          component="button"
          type="button"
          variant="body2"
          onClick={onBack}
          underline="hover"
        >
          Back to Sign In
        </Link>
      </Box>
    </Box>
  );
};

export default ResetPasswordForm;
