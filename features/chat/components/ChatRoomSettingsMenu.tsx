"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PushPinIcon from "@mui/icons-material/PushPin";
import { ChatRoomWithParticipant } from "../types";
import { useAuth } from "@/context/AuthContext";
import { doc, updateDoc,deleteField } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface ChatRoomSettingsMenuProps {
  open: boolean;
  onClose: () => void;
  room: ChatRoomWithParticipant;
  showPinOption?: boolean;
  onRoomUpdated?: () => void;
  onRoomLeft?: () => void;
}

export function ChatRoomSettingsMenu({
  open,
  onClose,
  room,
  showPinOption = false,
  onRoomUpdated,
  onRoomLeft,
}: ChatRoomSettingsMenuProps) {
  const { user } = useAuth();
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(room.roomName || "");

  const handleChangeName = async () => {
    if (!user?.uid || !newName.trim()) return;

    try {
      const roomRef = doc(db, "chatRooms", room.id);
      await updateDoc(roomRef, {
        roomName: newName.trim(),
      });
      setEditingName(false);
      onRoomUpdated?.();
      onClose();
    } catch (error) {
      console.error("Failed to update room name:", error);
    }
  };

  const handleTogglePin = async () => {
    if (!user?.uid) return;

    try {
      const roomRef = doc(db, "chatRooms", room.id);
      await updateDoc(roomRef, {
        isPinned: !room.isPinned,
      });
      onRoomUpdated?.();
      onClose();
    } catch (error) {
      console.error("Failed to toggle pin:", error);
    }
  };

  const handleLeaveRoom = async () => {
    if (!user?.uid) return;

    try {
      const roomRef = doc(db, "chatRooms", room.id);
      
      // Remove user from participants
      const updatedParticipants = room.participants.filter(
        (p) => p !== user.uid
      );

      if (updatedParticipants.length === 0) {
        // If no participants left, you might want to delete the room
        // For now, we'll just update it
        await updateDoc(roomRef, {
          participants: updatedParticipants,
        });
      } else {
        await updateDoc(roomRef, {
          participants: updatedParticipants,
        });
      }

      onRoomLeft?.();
      onClose();
    } catch (error) {
      console.error("Failed to leave room:", error);
    }
  };

  if (editingName) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle>Change Chat Name</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Chat Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingName(false)}>Cancel</Button>
          <Button onClick={handleChangeName} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Chat Settings</DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => setEditingName(true)}>
              <ListItemIcon>
                <EditIcon />
              </ListItemIcon>
              <ListItemText primary="Change Chat Name" />
            </ListItemButton>
          </ListItem>

          {showPinOption && (
            <ListItem disablePadding>
              <ListItemButton onClick={handleTogglePin}>
                <ListItemIcon>
                  <PushPinIcon />
                </ListItemIcon>
                <ListItemText
                  primary={room.isPinned ? "Unpin Chat" : "Pin Chat"}
                />
              </ListItemButton>
            </ListItem>
          )}

          <ListItem disablePadding>
            <ListItemButton onClick={handleLeaveRoom}>
              <ListItemIcon>
                <ExitToAppIcon color="error" />
              </ListItemIcon>
              <ListItemText primary="Leave Chat" primaryTypographyProps={{ color: "error" }} />
            </ListItemButton>
          </ListItem>
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
