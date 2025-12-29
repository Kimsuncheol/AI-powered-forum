"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getChatRoom,
  getMessages,
  sendMessage as sendMessageToRoom,
  markAsRead,
  subscribeToMessages,
} from "../repositories/chatRepository";
import { ChatMessage, NewChatMessage, ChatRoomWithParticipant } from "../types";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useChatRoom(roomId: string | null) {
  const { user } = useAuth();
  const [room, setRoom] = useState<ChatRoomWithParticipant | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load room details
  useEffect(() => {
    async function loadRoom() {
      if (!roomId || !user?.uid) {
        setRoom(null);
        setMessages([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const chatRoom = await getChatRoom(roomId);
        if (!chatRoom) {
          setError("Chat room not found");
          return;
        }

        // Enrich with participant info
        const otherParticipantId = chatRoom.participants.find(
          (p) => p !== user.uid
        );

        let participantName = "Unknown User";
        let participantAvatar: string | undefined;
        let participantEmail: string | undefined;

        if (otherParticipantId) {
          try {
            const userDoc = await getDoc(doc(db, "users", otherParticipantId));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              participantName = userData.displayName || userData.email || "Unknown User";
              participantAvatar = userData.photoURL;
              participantEmail = userData.email;
            }
          } catch {
            // Keep defaults
          }
        }

        setRoom({
          ...chatRoom,
          participantName,
          participantAvatar,
          participantEmail,
        });

        // Initial messages load
        const initialMessages = await getMessages(roomId);
        setMessages(initialMessages);

        // Mark messages as read
        await markAsRead(roomId, user.uid);
      } catch (err) {
        console.error("Failed to load chat room:", err);
        setError("Failed to load chat. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadRoom();
  }, [roomId, user?.uid]);

  // Subscribe to real-time messages
  useEffect(() => {
    if (!roomId || !user?.uid) return;

    const unsubscribe = subscribeToMessages(roomId, (newMessages) => {
      setMessages(newMessages);
      // Mark as read when receiving new messages
      markAsRead(roomId, user.uid);
    });

    return () => unsubscribe();
  }, [roomId, user?.uid]);

  // Send message function
  const sendMessage = useCallback(
    async (message: NewChatMessage) => {
      if (!roomId || !user?.uid || !message.content.trim()) return;

      try {
        setSending(true);
        await sendMessageToRoom(roomId, user.uid, message);
      } catch (err) {
        console.error("Failed to send message:", err);
        setError("Failed to send message. Please try again.");
      } finally {
        setSending(false);
      }
    },
    [roomId, user?.uid]
  );

  return {
    room,
    messages,
    loading,
    sending,
    error,
    sendMessage,
  };
}
