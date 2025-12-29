"use client";

import { useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  editMessage,
  deleteMessage,
  addReaction,
} from "../repositories/chatRepository";

interface UseMessageActionsResult {
  handleEdit: (messageId: string, newContent: string, roomId: string) => Promise<void>;
  handleDelete: (messageId: string, roomId: string) => Promise<void>;
  handleReaction: (messageId: string, emoji: string, roomId: string) => Promise<void>;
  handleCopy: (content: string) => void;
}

export function useMessageActions(): UseMessageActionsResult {
  const { user } = useAuth();

  const handleEdit = useCallback(
    async (messageId: string, newContent: string, roomId: string) => {
      if (!user?.uid) return;
      try {
        await editMessage(roomId, messageId, newContent);
      } catch (err) {
        console.error("Failed to edit message:", err);
      }
    },
    [user?.uid]
  );

  const handleDelete = useCallback(
    async (messageId: string, roomId: string) => {
      if (!user?.uid) return;
      try {
        await deleteMessage(roomId, messageId);
      } catch (err) {
        console.error("Failed to delete message:", err);
      }
    },
    [user?.uid]
  );

  const handleReaction = useCallback(
    async (messageId: string, emoji: string, roomId: string) => {
      if (!user?.uid) return;
      try {
        await addReaction(roomId, messageId, emoji, user.uid);
      } catch (err) {
        console.error("Failed to add reaction:", err);
      }
    },
    [user]
  );

  const handleCopy = useCallback((content: string) => {
    navigator.clipboard.writeText(content);
  }, []);

  return {
    handleEdit,
    handleDelete,
    handleReaction,
    handleCopy,
  };
}
