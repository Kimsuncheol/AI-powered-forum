import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  CircularProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import authApi from "../services/authApi";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

interface SignUpFormProps {
  onSwitchView: () => void;
  onClose: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSwitchView, onClose }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const [validation, setValidation] = useState({
    minLength: false,
    hasNumber: false,
    hasSymbol: false,
    match: false,
  });

  useEffect(() => {
    const { password, confirmPassword } = formData;
    setValidation({
      minLength: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      match: password === confirmPassword && password !== "",
    });
  }, [formData]);

  const isValid =
    Object.values(validation).every(Boolean) && formData.name && formData.email;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setApiError(""); // Clear API error on input change
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isValid) return;

    setLoading(true);
    setApiError("");

    try {
      // 1. Signup
      await authApi.signup({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      });

      // 2. Auto-login
      const tokenData = await authApi.login({
        email: formData.email,
        password: formData.password,
      });
      localStorage.setItem("token", tokenData.access_token);

      // 3. Get User Profile
      const user = await authApi.getMe(tokenData.access_token);
      login(user);
      onClose();
    } catch (err) {
      console.error(err);
      if (axios.isAxiosError(err) && err.response?.status === 422) {
        // Check if it's an email exists error (this depends on backend response structure, assuming generic 422 for now or checking message)
        // For now, we'll display a generic error or specific if available
        const msg =
          err.response.data?.detail || "Registration failed. Please try again.";
        if (JSON.stringify(msg).toLowerCase().includes("email")) {
          setApiError("Email already exists");
        } else {
          setApiError("Registration failed. Please check your inputs.");
        }
      } else {
        setApiError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: "100%" }}>
      {apiError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {apiError}
        </Alert>
      )}
      <TextField
        margin="normal"
        required
        fullWidth
        id="name"
        label="Full Name"
        name="name"
        autoComplete="name"
        autoFocus
        value={formData.name}
        onChange={handleChange}
        disabled={loading}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        value={formData.email}
        onChange={handleChange}
        error={apiError === "Email already exists"}
        helperText={apiError === "Email already exists" ? apiError : ""}
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
        autoComplete="new-password"
        value={formData.password}
        onChange={handleChange}
        disabled={loading}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="confirmPassword"
        label="Confirm Password"
        type="password"
        id="confirmPassword"
        autoComplete="new-password"
        value={formData.confirmPassword}
        onChange={handleChange}
        disabled={loading}
      />

      <List dense>
        <ListItem>
          <ListItemIcon>
            {validation.minLength ? (
              <CheckCircleIcon color="success" />
            ) : (
              <RadioButtonUncheckedIcon color="disabled" />
            )}
          </ListItemIcon>
          <ListItemText
            primary="At least 8 characters"
            primaryTypographyProps={{
              color: validation.minLength ? "text.primary" : "text.secondary",
            }}
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            {validation.hasNumber ? (
              <CheckCircleIcon color="success" />
            ) : (
              <RadioButtonUncheckedIcon color="disabled" />
            )}
          </ListItemIcon>
          <ListItemText
            primary="Contains at least 1 number"
            primaryTypographyProps={{
              color: validation.hasNumber ? "text.primary" : "text.secondary",
            }}
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            {validation.hasSymbol ? (
              <CheckCircleIcon color="success" />
            ) : (
              <RadioButtonUncheckedIcon color="disabled" />
            )}
          </ListItemIcon>
          <ListItemText
            primary="Contains at least 1 symbol"
            primaryTypographyProps={{
              color: validation.hasSymbol ? "text.primary" : "text.secondary",
            }}
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            {validation.match ? (
              <CheckCircleIcon color="success" />
            ) : (
              <RadioButtonUncheckedIcon color="disabled" />
            )}
          </ListItemIcon>
          <ListItemText
            primary={
              !formData.confirmPassword
                ? "Passwords must match"
                : validation.match
                ? "Passwords match"
                : "Passwords do not match"
            }
            primaryTypographyProps={{
              color: !formData.confirmPassword
                ? "text.secondary"
                : validation.match
                ? "success.main"
                : "error.main",
            }}
          />
        </ListItem>
      </List>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={!isValid || loading}
      >
        {loading ? <CircularProgress size={24} /> : "Sign Up"}
      </Button>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Already have an account?
        </Typography>
        <Link
          component="button"
          type="button"
          variant="body2"
          onClick={onSwitchView}
          underline="hover"
          disabled={loading}
        >
          Sign in
        </Link>
      </Box>
    </Box>
  );
};

export default SignUpForm;
