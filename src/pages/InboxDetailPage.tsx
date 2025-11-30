import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Avatar,
  Divider,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// Mock data - ideally this should be shared or fetched from a service
interface Message {
  id: number;
  sender: string;
  avatar: string;
  subject: string;
  preview: string;
  content: string; // Added full content
  date: string;
}

const mockMessages: Message[] = [
  {
    id: 1,
    sender: "Alice Johnson",
    avatar: "/static/images/avatar/1.jpg",
    subject: "Project Update",
    preview: "Hey, just wanted to share the latest updates on the project...",
    content:
      "Hey, just wanted to share the latest updates on the project. We have completed the initial phase and are moving on to the next steps. Please review the attached documents and let me know if you have any feedback.",
    date: "10:30 AM",
  },
  {
    id: 2,
    sender: "Bob Smith",
    avatar: "/static/images/avatar/2.jpg",
    subject: "Meeting Reminder",
    preview: "Don't forget about our meeting tomorrow at 2 PM.",
    content:
      "Don't forget about our meeting tomorrow at 2 PM. We will be discussing the quarterly goals and assigning new tasks. See you there!",
    date: "Yesterday",
  },
  {
    id: 3,
    sender: "Charlie Brown",
    avatar: "/static/images/avatar/3.jpg",
    subject: "Question about the design",
    preview: "I have a few questions regarding the new design mockups...",
    content:
      "I have a few questions regarding the new design mockups. Specifically, I am not sure about the color scheme for the dashboard. Can we schedule a quick call to discuss this?",
    date: "Oct 25",
  },
  {
    id: 4,
    sender: "Diana Prince",
    avatar: "/static/images/avatar/4.jpg",
    subject: "Welcome to the team!",
    preview:
      "We're so excited to have you join us. Let me know if you need anything.",
    content:
      "We're so excited to have you join us. Let me know if you need anything to get settled in. We have a team lunch planned for Friday!",
    date: "Oct 24",
  },
  {
    id: 5,
    sender: "Ethan Hunt",
    avatar: "/static/images/avatar/5.jpg",
    subject: "Mission Details",
    preview: "Your mission, should you choose to accept it...",
    content:
      "Your mission, should you choose to accept it, involves retrieving a stolen artifact from a secure facility. This message will self-destruct in 5 seconds.",
    date: "Oct 20",
  },
];

const InboxDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [message, setMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    const fetchMessage = () => {
      const foundMessage = mockMessages.find((msg) => msg.id === Number(id));
      setMessage(foundMessage || null);
      setLoading(false);
    };

    fetchMessage();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!message) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h6" color="error">
          Message not found
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/inbox")}
          sx={{ mt: 2 }}
        >
          Back to Inbox
        </Button>
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
        justifyContent: "start",
        alignItems: "left",
      }}
    >
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/inbox")}
        sx={{ mb: 2, width: "fit-content" }}
      >
        Back
      </Button>
      <Paper elevation={0} sx={{ p: 4, bgcolor: "background.paper" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "left",
            justifyContent: "left",
            mb: 3,
          }}
        >
          <Avatar
            src={message.avatar}
            alt={message.sender}
            sx={{ width: 56, height: 56, mr: 2 }}
          />
          <Box>
            <Typography variant="h5" fontWeight="bold" textAlign={"left"}>
              {message.subject}
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              textAlign={"left"}
            >
              From: {message.sender}
            </Typography>
            <Typography fontSize={12} color="text.secondary" textAlign={"left"}>
              {message.date}
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ mb: 3 }} />
        <Typography
          variant="body1"
          sx={{ lineHeight: 1.8, textAlign: "left", ml: 2 }}
        >
          {message.content}
        </Typography>
      </Paper>
    </Container>
  );
};

export default InboxDetailPage;
