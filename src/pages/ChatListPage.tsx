import React from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Box,
  AvatarGroup,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

interface ChatRoom {
  id: string;
  type: "dm" | "group";
  name: string; // For DM: User name, For Group: Group name or list of names
  avatars: string[];
  lastMessage: string;
  timestamp: string;
}

const mockChatRooms: ChatRoom[] = [
  {
    id: "1",
    type: "dm",
    name: "Alice Johnson",
    avatars: ["/static/images/avatar/1.jpg"],
    lastMessage: "Hey, are we still on for lunch?",
    timestamp: "10:30 AM",
  },
  {
    id: "2",
    type: "group",
    name: "Project Team",
    avatars: [
      "/static/images/avatar/2.jpg",
      "/static/images/avatar/3.jpg",
      "/static/images/avatar/4.jpg",
    ],
    lastMessage: "Bob: I uploaded the new designs.",
    timestamp: "9:15 AM",
  },
  {
    id: "3",
    type: "dm",
    name: "Charlie Brown",
    avatars: ["/static/images/avatar/3.jpg"],
    lastMessage: "Thanks for the help!",
    timestamp: "Yesterday",
  },
];

const ChatListPage: React.FC = () => {
  const navigate = useNavigate();

  const handleRoomClick = (id: string) => {
    navigate(`/chat/${id}`);
  };

  return (
    <Box sx={{ height: "100%", overflow: "auto" }}>
      <Typography
        variant="h6"
        sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}
      >
        Messages
      </Typography>
      <List>
        {mockChatRooms.map((room) => (
          <React.Fragment key={room.id}>
            <ListItem disablePadding alignItems="flex-start">
              <ListItemButton
                onClick={() => handleRoomClick(room.id)}
                alignItems="flex-start"
              >
                <ListItemAvatar>
                  {room.type === "dm" ? (
                    <Avatar src={room.avatars[0]} alt={room.name} />
                  ) : (
                    <AvatarGroup
                      max={3}
                      spacing="small"
                      sx={{ justifyContent: "flex-end" }}
                    >
                      {room.avatars.map((avatar, index) => (
                        <Avatar
                          key={index}
                          src={avatar}
                          alt={`Member ${index}`}
                          sx={{ width: 24, height: 24 }}
                        />
                      ))}
                    </AvatarGroup>
                  )}
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="subtitle2" fontWeight="bold">
                        {room.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {room.timestamp}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      noWrap
                      sx={{ display: "block" }}
                    >
                      {room.lastMessage}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
            <Divider component="li" />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default ChatListPage;
