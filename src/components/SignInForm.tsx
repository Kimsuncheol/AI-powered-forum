import React from "react";
import { Box, TextField, Button, Typography, Link } from "@mui/material";

interface SignInFormProps {
  onSwitchView: () => void;
}

const SignInForm: React.FC<SignInFormProps> = ({ onSwitchView }) => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // TODO: Implement actual sign-in logic here
    console.log("Sign in submitted");
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: "100%" }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
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
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Sign In
      </Button>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Haven't signed up yet?
        </Typography>
        <Link
          component="button"
          type="button"
          variant="body2"
          onClick={onSwitchView}
          underline="hover"
        >
          Sign up
        </Link>
      </Box>
    </Box>
  );
};

export default SignInForm;
