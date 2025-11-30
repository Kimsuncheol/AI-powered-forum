import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  IconButton,
  Paper,
  Button,
  Avatar,
  ListItemAvatar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";

interface Message {
  id: number;
  sender: string;
  avatar: string;
  subject: string;
  preview: string;
  date: string;
}

const initialMessages: Message[] = [
  {
    id: 1,
    sender: "Alice Johnson",
    avatar: "/static/images/avatar/1.jpg",
    subject: "Project Update",
    preview: "Hey, just wanted to share the latest updates on the project...",
    date: "10:30 AM",
  },
  {
    id: 2,
    sender: "Bob Smith",
    avatar: "/static/images/avatar/2.jpg",
    subject: "Meeting Reminder",
    preview: "Don't forget about our meeting tomorrow at 2 PM.",
    date: "Yesterday",
  },
  {
    id: 3,
    sender: "Charlie Brown",
    avatar: "/static/images/avatar/3.jpg",
    subject: "Question about the design",
    preview: "I have a few questions regarding the new design mockups...",
    date: "Oct 25",
  },
  {
    id: 4,
    sender: "Diana Prince",
    avatar: "/static/images/avatar/4.jpg",
    subject: "Welcome to the team!",
    preview:
      "We're so excited to have you join us. Let me know if you need anything.",
    date: "Oct 24",
  },
  {
    id: 5,
    sender: "Ethan Hunt",
    avatar: "/static/images/avatar/5.jpg",
    subject: "Mission Details",
    preview: "Your mission, should you choose to accept it...",
    date: "Oct 20",
  },
];

const InboxPage: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isDeletionMode, setIsDeletionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleToggleEdit = () => {
    setIsDeletionMode(!isDeletionMode);
    setSelectedIds([]); // Clear selection when toggling mode
  };

  const handleSelect = (id: number) => {
    const currentIndex = selectedIds.indexOf(id);
    const newSelectedIds = [...selectedIds];

    if (currentIndex === -1) {
      newSelectedIds.push(id);
    } else {
      newSelectedIds.splice(currentIndex, 1);
    }

    setSelectedIds(newSelectedIds);
  };

  const handleDelete = () => {
    const newMessages = messages.filter((msg) => !selectedIds.includes(msg.id));
    setMessages(newMessages);
    setSelectedIds([]);
    setIsDeletionMode(false); // Optional: Exit deletion mode after deleting
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Inbox
        </Typography>
        <Box>
          {isDeletionMode && (
            <IconButton
              onClick={handleDelete}
              color="error"
              disabled={selectedIds.length === 0}
              sx={{ mr: 1 }}
            >
              <DeleteIcon />
            </IconButton>
          )}
          <Button
            variant={isDeletionMode ? "contained" : "outlined"}
            startIcon={isDeletionMode ? <DoneIcon /> : <EditIcon />}
            onClick={handleToggleEdit}
          >
            {isDeletionMode ? "Done" : "Edit"}
          </Button>
        </Box>
      </Box>

      <Paper elevation={0} sx={{ bgcolor: "background.paper" }}>
        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          {messages.map((message) => {
            const isSelected = selectedIds.indexOf(message.id) !== -1;

            return (
              <ListItem
                key={message.id}
                disablePadding
                onClick={() =>
                  !isDeletionMode && navigate(`/inbox/${message.id}`)
                }
                sx={{
                  transition: "background-color 0.2s",
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                  cursor: isDeletionMode ? "default" : "pointer",
                }}
                secondaryAction={
                  <Typography variant="caption" color="text.secondary">
                    {message.date}
                  </Typography>
                }
              >
                {isDeletionMode && (
                  <ListItemIcon sx={{ minWidth: 40, pl: 2 }}>
                    <Checkbox
                      edge="start"
                      checked={isSelected}
                      tabIndex={-1}
                      disableRipple
                      onChange={() => handleSelect(message.id)}
                    />
                  </ListItemIcon>
                )}

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    p: 2,
                    pl: isDeletionMode ? 0 : 2, // Adjust padding based on checkbox presence
                  }}
                >
                  <ListItemAvatar>
                    <Avatar alt={message.sender} src={message.avatar} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight="bold">
                        {message.sender}
                      </Typography>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                          fontWeight="medium"
                        >
                          {message.subject}
                        </Typography>
                        {" — " + message.preview}
                      </React.Fragment>
                    }
                    sx={{ pr: 4 }} // Add padding right to avoid overlap with date
                  />
                </Box>
              </ListItem>
            );
          })}
          {messages.length === 0 && (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <Typography color="text.secondary">No messages</Typography>
            </Box>
          )}
        </List>
      </Paper>
    </Container>
  );
};

export default InboxPage;
