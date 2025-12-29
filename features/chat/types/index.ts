import { Timestamp } from "firebase/firestore";

// Chat room interface
export interface ChatRoom {
  id: string;
  participants: string[]; // UIDs of participants
  lastMessage?: string;
  lastMessageAt?: Timestamp;
  lastMessageSenderId?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Individual chat message
export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  content: string;
  createdAt: Timestamp;
  readBy: string[]; // UIDs who have read the message
}

// Enriched room data with participant info (for UI)
export interface ChatRoomWithParticipant extends ChatRoom {
  participantName?: string;
  participantAvatar?: string;
  participantEmail?: string;
  unreadCount?: number;
}

// Message input data (without id and createdAt)
export interface NewChatMessage {
  content: string;
}
