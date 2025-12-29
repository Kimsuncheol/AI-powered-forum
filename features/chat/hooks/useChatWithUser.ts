"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { findChatRoom, getOrCreateChatRoom } from "../repositories/chatRepository";

interface UseChatWithUserResult {
  existingRoomId: string | null;
  loading: boolean;
  actionLoading: boolean;
  startChat: () => Promise<void>;
  openChat: () => void;
}

export function useChatWithUser(
  currentUserId: string | undefined,
  targetUserId: string | undefined
): UseChatWithUserResult {
  const router = useRouter();
  const [existingRoomId, setExistingRoomId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!currentUserId || !targetUserId || currentUserId === targetUserId) {
      setLoading(false);
      return;
    }

    const checkExistingRoom = async () => {
      try {
        setLoading(true);
        const roomId = await findChatRoom(currentUserId, targetUserId);
        setExistingRoomId(roomId);
      } catch (err) {
        console.error("Failed to check existing chat room:", err);
      } finally {
        setLoading(false);
      }
    };

    checkExistingRoom();
  }, [currentUserId, targetUserId]);

  const startChat = useCallback(async () => {
    if (!currentUserId || !targetUserId) return;

    try {
      setActionLoading(true);
      const room = await getOrCreateChatRoom(currentUserId, targetUserId);
      router.push(`/chat/${room.id}`);
    } catch (err) {
      console.error("Failed to start chat:", err);
    } finally {
      setActionLoading(false);
    }
  }, [currentUserId, targetUserId, router]);

  const openChat = useCallback(() => {
    if (existingRoomId) {
      router.push(`/chat/${existingRoomId}`);
    }
  }, [existingRoomId, router]);

  return {
    existingRoomId,
    loading,
    actionLoading,
    startChat,
    openChat,
  };
}
