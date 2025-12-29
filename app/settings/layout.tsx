import { Container, Box } from "@mui/material";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Box
        sx={{
          minHeight: "calc(100vh - 120px)",
        }}
      >
        {children}
      </Box>
    </Container>
  );
}
