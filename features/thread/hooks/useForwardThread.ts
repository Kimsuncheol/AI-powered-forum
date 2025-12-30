"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { getChatRooms, sendMessage } from "@/features/chat/repositories/chatRepository";
import { ChatRoom } from "@/features/chat/types";

interface UseForwardThreadReturn {
  chatRooms: ChatRoom[];
  isLoading: boolean;
  error: string | null;
  fetchChatRooms: () => Promise<void>;
  forwardThread: (roomId: string, threadId: string, threadTitle: string) => Promise<boolean>;
}

export function useForwardThread(): UseForwardThreadReturn {
  const { user } = useAuth();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChatRooms = useCallback(async () => {
    if (!user) {
      setError("You must be logged in to forward threads");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const rooms = await getChatRooms(user.uid);
      setChatRooms(rooms);
    } catch (err) {
      console.error("Error fetching chat rooms:", err);
      setError("Failed to load chat rooms");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const forwardThread = useCallback(
    async (roomId: string, threadId: string, threadTitle: string): Promise<boolean> => {
      if (!user) {
        setError("You must be logged in to forward threads");
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        const threadUrl = `${window.location.origin}/thread/${threadId}`;
        const messageContent = `📌 Shared Thread: ${threadTitle}\n${threadUrl}`;

        await sendMessage(roomId, user.uid, { content: messageContent });
        return true;
      } catch (err) {
        console.error("Error forwarding thread:", err);
        setError("Failed to forward thread");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [user]
  );

  return {
    chatRooms,
    isLoading,
    error,
    fetchChatRooms,
    forwardThread,
  };
}
