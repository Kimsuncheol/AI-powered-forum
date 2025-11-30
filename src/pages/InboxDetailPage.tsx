import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  IconButton,
  Box,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InboxEntry, { InboxEntryProps } from "../components/InboxEntry";

interface NotificationDetail extends InboxEntryProps {
  id: string;
}

// Mock function to simulate fetching data
const fetchNotificationById = (
  id: string
): Promise<NotificationDetail | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Return mock data
      resolve({
        id,
        type: "system",
        title: `Notification Subject for ID: ${id}`,
        content: `This is the detailed content for notification ${id}. 
        
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
        date: "2023-10-27 10:30 AM",
        senderName: "System Admin",
      });
    }, 500);
  });
};

const InboxDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [notification, setNotification] = useState<NotificationDetail | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchNotificationById(id).then((data) => {
        setNotification(data);
        setLoading(false);
      });
    }
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <Container
        maxWidth="md"
        sx={{ py: 4, display: "flex", justifyContent: "center" }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (!notification) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h6" color="error">
          Notification not found.
        </Typography>
        <IconButton onClick={handleBack} sx={{ mt: 2 }}>
          <ArrowBackIcon /> Back
        </IconButton>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 4,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
        <IconButton onClick={handleBack} aria-label="back">
          <ArrowBackIcon />
        </IconButton>
      </Box>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ mb: 3 }}>
          <InboxEntry {...notification} />
        </Box>
      </Paper>
    </Container>
  );
};

export default InboxDetailPage;
