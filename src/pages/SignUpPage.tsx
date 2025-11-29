import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const SignUpPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordRules, setPasswordRules] = useState({
    length: false,
    number: false,
    symbol: false,
  });

  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const { password, confirmPassword } = formData;

    // Check password rules
    const newRules = {
      length: password.length >= 8,
      number: /\d/.test(password),
      symbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    setPasswordRules(newRules);

    // Check matching
    const match = password === confirmPassword && password !== "";
    setPasswordsMatch(match);

    // Check overall validity
    setIsFormValid(
      Object.values(newRules).every(Boolean) &&
        match &&
        formData.email !== "" &&
        formData.name !== ""
    );
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      console.log("Sign up with:", formData);
      // Add actual sign-up logic here
    }
  };

  const RuleItem = ({ valid, text }: { valid: boolean; text: string }) => (
    <ListItem dense sx={{ py: 0 }}>
      <ListItemIcon sx={{ minWidth: 30 }}>
        {valid ? (
          <CheckCircleIcon color="success" fontSize="small" />
        ) : (
          <CancelIcon color="error" fontSize="small" />
        )}
      </ListItemIcon>
      <ListItemText
        primary={text}
        primaryTypographyProps={{
          variant: "caption",
          color: valid ? "success.main" : "text.secondary",
        }}
      />
    </ListItem>
  );

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h4" fontWeight="bold" gutterBottom>
          THREADS
        </Typography>
        <Paper
          elevation={3}
          sx={{ p: 4, width: "100%", mt: 2, borderRadius: 2 }}
        >
          <Typography component="h2" variant="h5" align="center" gutterBottom>
            Sign up
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Full Name"
              name="name"
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
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
            />

            <Box sx={{ mt: 1, mb: 2 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ ml: 2 }}
              >
                Password Requirements:
              </Typography>
              <List dense>
                <RuleItem
                  valid={passwordRules.length}
                  text="At least 8 characters"
                />
                <RuleItem
                  valid={passwordRules.number}
                  text="Contains a number"
                />
                <RuleItem
                  valid={passwordRules.symbol}
                  text="Contains a symbol"
                />
              </List>
            </Box>

            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={formData.confirmPassword !== "" && !passwordsMatch}
              helperText={
                formData.confirmPassword !== ""
                  ? passwordsMatch
                    ? "Passwords match"
                    : "Passwords do not match"
                  : ""
              }
              FormHelperTextProps={{
                sx: { color: passwordsMatch ? "success.main" : "error.main" },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={!isFormValid}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              Sign Up
            </Button>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Link component={RouterLink} to="/signin" variant="body2">
                "Have signed-up? Sign-in"
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default SignUpPage;
