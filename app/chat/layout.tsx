"use client";

import { Container, Box } from "@mui/material";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Box
        sx={{
          height: "calc(100vh - 120px)",
          bgcolor: "background.paper",
          scrollbarWidth: "none",
          scrollbarColor: "transparent transparent",
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: 1,
        }}
      >
        {children}
      </Box>
    </Container>
  );
}
