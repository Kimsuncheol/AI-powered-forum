import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Outlet } from "react-router-dom";

interface Follower {
  id: number;
  name: string;
  avatar: string;
  status: "active" | "inactive";
}

const initialFollowers: Follower[] = [
  {
    id: 1,
    name: "Alice Johnson",
    avatar: "/static/images/avatar/1.jpg",
    status: "active",
  },
  {
    id: 2,
    name: "Bob Smith",
    avatar: "/static/images/avatar/2.jpg",
    status: "inactive",
  },
  {
    id: 3,
    name: "Charlie Brown",
    avatar: "/static/images/avatar/3.jpg",
    status: "active",
  },
  {
    id: 4,
    name: "Diana Prince",
    avatar: "/static/images/avatar/4.jpg",
    status: "active",
  },
  {
    id: 5,
    name: "Ethan Hunt",
    avatar: "/static/images/avatar/5.jpg",
    status: "inactive",
  },
];

const ChatLayout: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tabValue, setTabValue] = useState(0); // 0: All, 1: Active, 2: Inactive

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const filteredFollowers = initialFollowers.filter((follower) => {
    const matchesSearch = follower.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    let matchesTab = true;
    if (tabValue === 1) matchesTab = follower.status === "active";
    if (tabValue === 2) matchesTab = follower.status === "inactive";
    return matchesSearch && matchesTab;
  });

  return (
    <Box
      sx={{
        display: "flex",
        height: "calc(100vh - 64px)",
        bgcolor: "background.default",
      }}
    >
      {/* Sidebar - 30% width */}
      <Paper
        elevation={0}
        sx={{
          width: "30%",
          borderRight: "1px solid",
          borderColor: "divider",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            placeholder="Search followers..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="All" />
          <Tab label="Active" />
          <Tab label="Inactive" />
        </Tabs>

        <List sx={{ overflow: "auto", flexGrow: 1 }}>
          {filteredFollowers.map((follower) => (
            <React.Fragment key={follower.id}>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemAvatar>
                    <Avatar src={follower.avatar} alt={follower.name} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={follower.name}
                    secondary={
                      <Typography
                        variant="caption"
                        color={
                          follower.status === "active"
                            ? "success.main"
                            : "text.secondary"
                        }
                      >
                        {follower.status === "active" ? "Active" : "Inactive"}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
          {filteredFollowers.length === 0 && (
            <Box sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                No followers found
              </Typography>
            </Box>
          )}
        </List>
      </Paper>

      {/* Main Content Area - 70% width */}
      <Box
        sx={{
          width: "70%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default ChatLayout;
