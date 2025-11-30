import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Paper,
  AvatarGroup,
  useTheme,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useParams, useNavigate } from "react-router-dom";
import ChatInput from "../components/ChatInput";

interface Message {
  id: number;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

// Mock data generator based on ID
const getMockMessages = (roomId: string): Message[] => {
  return [
    {
      id: 1,
      senderId: "other",
      senderName: "Alice Johnson",
      senderAvatar: "/static/images/avatar/1.jpg",
      text: "Hey there! How is it going?",
      timestamp: "10:00 AM",
      isMe: false,
    },
    {
      id: 2,
      senderId: "me",
      senderName: "Me",
      senderAvatar: "/static/images/avatar/2.jpg",
      text: "Hi Alice! I'm doing good, thanks. Working on the new features.",
      timestamp: "10:05 AM",
      isMe: true,
    },
    {
      id: 3,
      senderId: "other",
      senderName: "Alice Johnson",
      senderAvatar: "/static/images/avatar/1.jpg",
      text: "That sounds great! Can you show me a demo later?",
      timestamp: "10:06 AM",
      isMe: false,
    },
    {
      id: 4,
      senderId: "me",
      senderName: "Me",
      senderAvatar: "/static/images/avatar/2.jpg",
      text: "Sure thing. Let's meet at 2 PM.",
      timestamp: "10:10 AM",
      isMe: true,
    },
  ];
};

const ChatRoomPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      setMessages(getMockMessages(id));
    }
  }, [id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (text: string) => {
    const newMessage: Message = {
      id: messages.length + 1,
      senderId: "me",
      senderName: "Me",
      senderAvatar: "/static/images/avatar/2.jpg",
      text: text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isMe: true,
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          bgcolor: "background.paper",
        }}
      >
        <IconButton onClick={() => navigate("/chat")} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar src="/static/images/avatar/1.jpg" sx={{ mr: 1 }} />
          <Typography variant="subtitle1" fontWeight="bold">
            Alice Johnson
          </Typography>
        </Box>
      </Box>

      {/* Message Feed */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: "auto",
          p: 2,
          bgcolor: theme.palette.background.paper,
        }}
      >
        {messages.map((msg) => (
          <Box
            key={msg.id}
            sx={{
              display: "flex",
              justifyContent: msg.isMe ? "flex-end" : "flex-start",
              mb: 2,
            }}
          >
            {!msg.isMe && (
              <Avatar
                src={msg.senderAvatar}
                sx={{ width: 32, height: 32, mr: 1, mt: 0.5 }}
              />
            )}
            <Box sx={{ maxWidth: "70%" }}>
              <Paper
                elevation={1}
                sx={{
                  p: 1.5,
                  bgcolor: msg.isMe ? "primary.main" : "background.paper",
                  color: msg.isMe ? "primary.contrastText" : "text.primary",
                  borderRadius: 2,
                  borderTopLeftRadius: !msg.isMe ? 0 : 2,
                  borderTopRightRadius: msg.isMe ? 0 : 2,
                }}
              >
                <Typography variant="body1">{msg.text}</Typography>
              </Paper>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: "block",
                  mt: 0.5,
                  textAlign: msg.isMe ? "right" : "left",
                }}
              >
                {msg.timestamp}
              </Typography>
            </Box>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <ChatInput onSend={handleSendMessage} />
    </Box>
  );
};

export default ChatRoomPage;
