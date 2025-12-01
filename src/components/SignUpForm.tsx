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
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

interface SignUpFormProps {
  onSwitchView: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSwitchView }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordCriteria, setPasswordCriteria] = useState({
    minChar: false,
    hasNumber: false,
    hasSymbol: false,
  });

  const [passwordsMatch, setPasswordsMatch] = useState(false);

  useEffect(() => {
    const { password, confirmPassword } = formData;

    setPasswordCriteria({
      minChar: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });

    setPasswordsMatch(password === confirmPassword && password !== "");
  }, [formData]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isFormValid()) {
      // TODO: Implement actual sign-up logic here
      console.log("Sign up submitted", formData);
    }
  };

  const isFormValid = () => {
    return (
      passwordCriteria.minChar &&
      passwordCriteria.hasNumber &&
      passwordCriteria.hasSymbol &&
      passwordsMatch &&
      formData.name &&
      formData.email
    );
  };

  const renderCriteriaItem = (met: boolean, text: string) => (
    <ListItem sx={{ py: 0, px: 0 }}>
      <ListItemIcon sx={{ minWidth: 24 }}>
        {met ? (
          <CheckCircleIcon color="success" fontSize="small" />
        ) : (
          <RadioButtonUncheckedIcon color="disabled" fontSize="small" />
        )}
      </ListItemIcon>
      <ListItemText
        primary={text}
        primaryTypographyProps={{
          variant: "caption",
          color: met ? "success.main" : "text.secondary",
        }}
      />
    </ListItem>
  );

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: "100%" }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="name"
        label="Name"
        name="name"
        autoComplete="name"
        autoFocus
        value={formData.name}
        onChange={handleChange}
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

      {/* Password Validation Criteria */}
      <Box sx={{ ml: 1, mt: 1, mb: 1 }}>
        <List dense>
          {renderCriteriaItem(passwordCriteria.minChar, "Min 8 chars")}
          {renderCriteriaItem(passwordCriteria.hasNumber, "1 Number")}
          {renderCriteriaItem(passwordCriteria.hasSymbol, "1 Symbol")}
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
        autoComplete="new-password"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={formData.confirmPassword !== "" && !passwordsMatch}
        helperText={
          formData.confirmPassword !== "" && !passwordsMatch
            ? "Passwords do not match"
            : passwordsMatch
            ? "Passwords match"
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
        sx={{ mt: 3, mb: 2 }}
        disabled={!isFormValid()}
      >
        Sign Up
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
        >
          Sign in
        </Link>
      </Box>
    </Box>
  );
};

export default SignUpForm;
