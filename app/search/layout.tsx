import { Container, Box } from "@mui/material";

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
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
