import { Timestamp } from "firebase/firestore";

/**
 * Base ChatRoom type representing a chat room in Firestore
 */
export interface ChatRoom {
  id: string;
  participants: string[]; // Array of user IDs
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastMessageAt?: Timestamp;
  lastMessage?: string;
  roomName?: string; // Optional custom room name
  isPinned?: boolean;
  alertsEnabled?: boolean;
  unreadCount?: { [userId: string]: number };
}

/**
 * Extended ChatRoom with participant information
 * Used when displaying chat rooms in the UI
 */
export interface ChatRoomWithParticipant extends ChatRoom {
  participantName: string;
  participantAvatar?: string;
  participantEmail?: string;
}

/**
 * Chat message type
 */
export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  content: string;
  createdAt: Timestamp;
  readBy?: string[]; // Array of user IDs who have read the message
  reactions?: { [userId: string]: string }; // User ID to emoji mapping
  isEdited?: boolean;
  isDeleted?: boolean;
}

/**
 * New message type for creating messages
 */
export interface NewChatMessage {
  content: string;
}
