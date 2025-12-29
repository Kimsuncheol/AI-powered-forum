import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp,
  arrayUnion,
  onSnapshot,
  Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ChatRoom, ChatMessage, NewChatMessage } from "../types";

const CHAT_ROOMS_COLLECTION = "chatRooms";
const MESSAGES_SUBCOLLECTION = "messages";

/**
 * Get all chat rooms for a user
 */
export async function getChatRooms(userId: string): Promise<ChatRoom[]> {
  const q = query(
    collection(db, CHAT_ROOMS_COLLECTION),
    where("participants", "array-contains", userId),
    orderBy("lastMessageAt", "desc")
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as ChatRoom[];
}

/**
 * Get a single chat room by ID
 */
export async function getChatRoom(roomId: string): Promise<ChatRoom | null> {
  const docRef = doc(db, CHAT_ROOMS_COLLECTION, roomId);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    return null;
  }
  
  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as ChatRoom;
}

/**
 * Find an existing chat room between two users or create a new one
 */
export async function getOrCreateChatRoom(
  userId: string,
  targetUserId: string
): Promise<ChatRoom> {
  // Check if a room already exists between these users
  const q = query(
    collection(db, CHAT_ROOMS_COLLECTION),
    where("participants", "array-contains", userId)
  );
  
  const snapshot = await getDocs(q);
  
  for (const doc of snapshot.docs) {
    const room = doc.data() as ChatRoom;
    if (
      room.participants.length === 2 &&
      room.participants.includes(targetUserId)
    ) {
      return { id: doc.id, ...room };
    }
  }
  
  // Create new room
  const newRoom = {
    participants: [userId, targetUserId],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  
  const docRef = await addDoc(collection(db, CHAT_ROOMS_COLLECTION), newRoom);
  
  return {
    id: docRef.id,
    participants: [userId, targetUserId],
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

/**
 * Create a new chat room
 */
export async function createChatRoom(participants: string[]): Promise<ChatRoom> {
  const newRoom = {
    participants,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  
  const docRef = await addDoc(collection(db, CHAT_ROOMS_COLLECTION), newRoom);
  
  return {
    id: docRef.id,
    participants,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

/**
 * Get messages for a chat room (newest first)
 */
export async function getMessages(
  roomId: string,
  messageLimit = 50
): Promise<ChatMessage[]> {
  const q = query(
    collection(db, CHAT_ROOMS_COLLECTION, roomId, MESSAGES_SUBCOLLECTION),
    orderBy("createdAt", "desc"),
    limit(messageLimit)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .reverse() as ChatMessage[];
}

/**
 * Subscribe to messages for a chat room (real-time)
 */
export function subscribeToMessages(
  roomId: string,
  callback: (messages: ChatMessage[]) => void,
  messageLimit = 50
): Unsubscribe {
  const q = query(
    collection(db, CHAT_ROOMS_COLLECTION, roomId, MESSAGES_SUBCOLLECTION),
    orderBy("createdAt", "desc"),
    limit(messageLimit)
  );
  
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .reverse() as ChatMessage[];
    callback(messages);
  });
}

/**
 * Send a message to a chat room
 */
export async function sendMessage(
  roomId: string,
  senderId: string,
  message: NewChatMessage
): Promise<ChatMessage> {
  const newMessage = {
    roomId,
    senderId,
    content: message.content,
    createdAt: serverTimestamp(),
    readBy: [senderId],
  };
  
  // Add message to subcollection
  const docRef = await addDoc(
    collection(db, CHAT_ROOMS_COLLECTION, roomId, MESSAGES_SUBCOLLECTION),
    newMessage
  );
  
  // Update room's last message info
  await updateDoc(doc(db, CHAT_ROOMS_COLLECTION, roomId), {
    lastMessage: message.content,
    lastMessageAt: serverTimestamp(),
    lastMessageSenderId: senderId,
    updatedAt: serverTimestamp(),
  });
  
  return {
    id: docRef.id,
    roomId,
    senderId,
    content: message.content,
    createdAt: Timestamp.now(),
    readBy: [senderId],
  };
}

/**
 * Mark messages as read by a user
 */
export async function markAsRead(
  roomId: string,
  userId: string
): Promise<void> {
  const q = query(
    collection(db, CHAT_ROOMS_COLLECTION, roomId, MESSAGES_SUBCOLLECTION),
    orderBy("createdAt", "desc"),
    limit(50)
  );
  
  const snapshot = await getDocs(q);
  
  const updatePromises = snapshot.docs
    .filter((doc) => {
      const data = doc.data();
      return !data.readBy?.includes(userId);
    })
    .map((msgDoc) =>
      updateDoc(
        doc(db, CHAT_ROOMS_COLLECTION, roomId, MESSAGES_SUBCOLLECTION, msgDoc.id),
        {
          readBy: arrayUnion(userId),
        }
      )
    );
  
  await Promise.all(updatePromises);
}
