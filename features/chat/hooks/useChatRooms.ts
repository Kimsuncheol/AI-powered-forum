"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { getChatRooms } from "../repositories/chatRepository";
import { ChatRoom, ChatRoomWithParticipant } from "../types";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useChatRooms() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<ChatRoomWithParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRooms = useCallback(async () => {
    if (!user?.uid) {
      setRooms([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const chatRooms = await getChatRooms(user.uid);
      
      // Enrich rooms with participant info
      const enrichedRooms = await Promise.all(
        chatRooms.map(async (room: ChatRoom) => {
          const otherParticipantId = room.participants.find(
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
              // Keep defaults if user fetch fails
            }
          }
          
          return {
            ...room,
            participantName,
            participantAvatar,
            participantEmail,
          } as ChatRoomWithParticipant;
        })
      );
      
      setRooms(enrichedRooms);
    } catch (err) {
      console.error("Failed to load chat rooms:", err);
      setError("Failed to load chats. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  return {
    rooms,
    loading,
    error,
    refresh: loadRooms,
  };
}
