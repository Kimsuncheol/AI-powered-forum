import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

interface ResetPasswordRequestFormProps {
  onBack: () => void;
}

const ResetPasswordRequestForm: React.FC<ResetPasswordRequestFormProps> = ({
  onBack,
}) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email) {
      setError("Email is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // API call to request reset link
      await axios.post("/api/v1/auth/forgot-password", { email });
      setSubmitted(true);
    } catch (err) {
      setError("Failed to send reset link. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Box sx={{ mt: 1, width: "100%", textAlign: "center" }}>
        <Alert severity="success" sx={{ mb: 2 }}>
          Check your email for the confirmation link.
        </Alert>
        <Button onClick={onBack} variant="outlined" fullWidth>
          Back to Sign In
        </Button>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: "100%" }}>
      <Typography variant="h6" sx={{ mb: 1, textAlign: "center" }}>
        Forgot Password
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 2, textAlign: "center" }}
      >
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
        type="email"
        autoComplete="email"
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={!!error}
        helperText={error}
        disabled={loading}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : "Send Reset Link"}
      </Button>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Link
          component="button"
          type="button"
          variant="body2"
          onClick={onBack}
          underline="hover"
          disabled={loading}
        >
          Back to Sign In
        </Link>
      </Box>
    </Box>
  );
};

export default ResetPasswordRequestForm;
