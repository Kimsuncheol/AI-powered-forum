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
import authApi from "../services/authApi";
import { useAuth } from "../context/AuthContext";

interface SignInFormProps {
  onSwitchView: (view: "signup" | "reset") => void;
  onClose: () => void;
}

const SignInForm: React.FC<SignInFormProps> = ({ onSwitchView, onClose }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const tokenData = await authApi.login({ email, password });
      localStorage.setItem("token", tokenData.access_token);

      const user = await authApi.getMe(tokenData.access_token);
      login(user);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: "100%" }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
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
        disabled={loading}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
      />
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Link
          component="button"
          type="button"
          variant="body2"
          onClick={() => onSwitchView("reset")}
          underline="hover"
          disabled={loading}
        >
          Forgot password?
        </Link>
      </Box>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : "Sign In"}
      </Button>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Haven't signed up yet?
        </Typography>
        <Link
          component="button"
          type="button"
          variant="body2"
          onClick={() => onSwitchView("signup")}
          underline="hover"
          disabled={loading}
        >
          Sign up
        </Link>
      </Box>
    </Box>
  );
};

export default SignInForm;
