import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link as MuiLink,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const [passwordRules, setPasswordRules] = useState({
    length: false,
    number: false,
    symbol: false,
  });

  const [passwordsMatch, setPasswordsMatch] = useState(false);

  useEffect(() => {
    setPasswordRules({
      length: password.length >= 8,
      number: /\d/.test(password),
      symbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  }, [password]);

  useEffect(() => {
    setPasswordsMatch(password === confirmPassword && password !== "");
  }, [password, confirmPassword]);

  const isFormValid =
    Object.values(passwordRules).every(Boolean) &&
    passwordsMatch &&
    email &&
    name;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      // Mock signup logic
      console.log("Signed up:", { email, name, password });
      navigate("/sign-in");
    }
  };

  const RuleItem = ({
    satisfied,
    text,
  }: {
    satisfied: boolean;
    text: string;
  }) => (
    <ListItem dense>
      <ListItemIcon sx={{ minWidth: 30 }}>
        {satisfied ? (
          <CheckCircleIcon color="success" fontSize="small" />
        ) : (
          <CancelIcon color="disabled" fontSize="small" />
        )}
      </ListItemIcon>
      <ListItemText
        primary={text}
        primaryTypographyProps={{
          color: satisfied ? "success.main" : "text.secondary",
        }}
      />
    </ListItem>
  );

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Sign Up
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 1, width: "100%" }}
        >
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
            sx={{ mb: 2 }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="subtitle2">Password Constraints:</Typography>
            <List dense disablePadding>
              <RuleItem satisfied={passwordRules.length} text="Min 8 chars" />
              <RuleItem
                satisfied={passwordRules.number}
                text="At least 1 number"
              />
              <RuleItem
                satisfied={passwordRules.symbol}
                text="At least 1 symbol"
              />
            </List>

            {confirmPassword && (
              <Typography
                variant="body2"
                color={passwordsMatch ? "success.main" : "error.main"}
                sx={{ mt: 1, fontWeight: "bold" }}
              >
                {passwordsMatch ? "Passwords match" : "Passwords do not match"}
              </Typography>
            )}
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={!isFormValid}
            sx={{ mt: 2, mb: 2 }}
          >
            Sign Up
          </Button>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <MuiLink component={Link} to="/sign-in" variant="body2">
              "Have signed-up? Sign-in"
            </MuiLink>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default SignUpPage;
