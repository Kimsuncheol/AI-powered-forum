import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

type AuthView = "signin" | "signup";

const AuthModal: React.FC<AuthModalProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [view, setView] = useState<AuthView>("signin");

  const handleSwitchToSignUp = () => setView("signup");
  const handleSwitchToSignIn = () => setView("signin");

  // Reset view when modal closes
  const handleClose = () => {
    onClose();
    // Optional: reset view after transition
    setTimeout(() => setView("signin"), 300);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={fullScreen}
      maxWidth="xs"
      fullWidth
      aria-labelledby="auth-modal-title"
    >
      <DialogTitle
        id="auth-modal-title"
        sx={{ m: 0, p: 2, textAlign: "center", fontWeight: "bold" }}
      >
        {view === "signin" ? "SIGN IN" : "SIGN UP"}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {view === "signin" ? (
            <SignInForm onSwitchView={handleSwitchToSignUp} />
          ) : (
            <SignUpForm onSwitchView={handleSwitchToSignIn} />
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
