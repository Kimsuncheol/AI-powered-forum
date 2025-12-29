"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { subscribeToChatRooms } from "../repositories/chatRepository";
import { ChatRoom, ChatRoomWithParticipant } from "../types";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useChatRooms() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<ChatRoomWithParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      setRooms([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToChatRooms(user.uid, async (chatRooms) => {
      try {
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

        // Sort rooms: Pinned first, then by lastMessageAt descending
        const sortedRooms = enrichedRooms.sort((a, b) => {
          // 1. Pinned status
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;

          // 2. Last message time (descending)
          const timeA = a.lastMessageAt?.toMillis() || 0;
          const timeB = b.lastMessageAt?.toMillis() || 0;
          return timeB - timeA;
        });
        
        setRooms(sortedRooms);
      } catch (err) {
        console.error("Failed to process chat rooms:", err);
        setError("Failed to load chats.");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [user?.uid]);

  return {
    rooms,
    loading,
    error,
    refresh: () => {}, // No-op since it's real-time now
  };
}
