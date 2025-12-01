import React from "react";
import { Container, Paper, Box } from "@mui/material";
import NewPasswordForm from "../components/NewPasswordForm";

const NewPasswordPage: React.FC = () => {
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
        <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
          <NewPasswordForm />
        </Paper>
      </Box>
    </Container>
  );
};

export default NewPasswordPage;
