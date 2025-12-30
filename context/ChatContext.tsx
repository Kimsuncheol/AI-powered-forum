"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface ChatContextType {
  isChatOpen: boolean;
  selectedRoomId: string | null;
  openChat: () => void;
  openChatWithRoom: (roomId: string) => void;
  closeChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const openChat = () => {
    setSelectedRoomId(null);
    setIsChatOpen(true);
  };

  const openChatWithRoom = (roomId: string) => {
    setSelectedRoomId(roomId);
    setIsChatOpen(true);
  };

  const closeChat = () => {
    setIsChatOpen(false);
    // Keep selectedRoomId until next open to preserve state
  };

  return (
    <ChatContext.Provider
      value={{
        isChatOpen,
        selectedRoomId,
        openChat,
        openChatWithRoom,
        closeChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
