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
  deleteDoc,
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
 * Subscribe to chat rooms for a user (real-time)
 */
export function subscribeToChatRooms(
  userId: string,
  callback: (rooms: ChatRoom[]) => void
): Unsubscribe {
  const q = query(
    collection(db, CHAT_ROOMS_COLLECTION),
    where("participants", "array-contains", userId),
    orderBy("lastMessageAt", "desc")
  );
  
  return onSnapshot(q, (snapshot) => {
    const rooms = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ChatRoom[];
    callback(rooms);
  });
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
 * Find an existing chat room between two users (without creating)
 */
export async function findChatRoom(
  userId: string,
  targetUserId: string
): Promise<string | null> {
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
      return doc.id;
    }
  }
  
  return null;
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
  
  for (const docSnap of snapshot.docs) {
    const roomData = docSnap.data();
    if (
      roomData.participants?.length === 2 &&
      roomData.participants.includes(targetUserId)
    ) {
      return { ...roomData, id: docSnap.id } as ChatRoom;
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

/**
 * Edit a message
 */
export async function editMessage(
  roomId: string,
  messageId: string,
  newContent: string
): Promise<void> {
  const messageRef = doc(
    db,
    CHAT_ROOMS_COLLECTION,
    roomId,
    MESSAGES_SUBCOLLECTION,
    messageId
  );
  
  await updateDoc(messageRef, {
    content: newContent,
    editedAt: serverTimestamp(),
  });
  
  // Update room's last message if this was the last message
  await updateDoc(doc(db, CHAT_ROOMS_COLLECTION, roomId), {
    lastMessage: newContent,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Delete a message
 */
export async function deleteMessage(
  roomId: string,
  messageId: string
): Promise<void> {
  const messageRef = doc(
    db,
    CHAT_ROOMS_COLLECTION,
    roomId,
    MESSAGES_SUBCOLLECTION,
    messageId
  );
  
  await deleteDoc(messageRef);
}

/**
 * Add a reaction to a message
 */
export async function addReaction(
  roomId: string,
  messageId: string,
  emoji: string,
  userId: string
): Promise<void> {
  const messageRef = doc(
    db,
    CHAT_ROOMS_COLLECTION,
    roomId,
    MESSAGES_SUBCOLLECTION,
    messageId
  );
  
  const messageDoc = await getDoc(messageRef);
  if (!messageDoc.exists()) return;
  
  const data = messageDoc.data();
  const reactions = data.reactions || [];
  
  // Find existing reaction with this emoji
  const existingReactionIndex = reactions.findIndex(
    (r: { emoji: string }) => r.emoji === emoji
  );
  
  if (existingReactionIndex >= 0) {
    // Add user to existing reaction if not already there
    const userIds = reactions[existingReactionIndex].userIds || [];
    if (!userIds.includes(userId)) {
      reactions[existingReactionIndex].userIds = [...userIds, userId];
    }
  } else {
    // Create new reaction
    reactions.push({ emoji, userIds: [userId] });
  }
  
  await updateDoc(messageRef, { reactions });
}

/**
 * Remove a reaction from a message
 */
export async function removeReaction(
  roomId: string,
  messageId: string,
  emoji: string,
  userId: string
): Promise<void> {
  const messageRef = doc(
    db,
    CHAT_ROOMS_COLLECTION,
    roomId,
    MESSAGES_SUBCOLLECTION,
    messageId
  );
  
  const messageDoc = await getDoc(messageRef);
  if (!messageDoc.exists()) return;
  
  const data = messageDoc.data();
  const reactions = data.reactions || [];
  
  // Find reaction with this emoji
  const reactionIndex = reactions.findIndex(
    (r: { emoji: string }) => r.emoji === emoji
  );
  
  if (reactionIndex >= 0) {
    const userIds = reactions[reactionIndex].userIds.filter(
      (id: string) => id !== userId
    );
    
    if (userIds.length === 0) {
      // Remove reaction entirely if no users left
      reactions.splice(reactionIndex, 1);
    } else {
      reactions[reactionIndex].userIds = userIds;
    }
    
    await updateDoc(messageRef, { reactions });
  }
}

/**
 * Rename a chat room
 */
export async function renameChatRoom(
  roomId: string,
  newName: string
): Promise<void> {
  const roomRef = doc(db, CHAT_ROOMS_COLLECTION, roomId);
  await updateDoc(roomRef, {
    roomName: newName,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Leave a chat room (remove user from participants)
 */
export async function leaveChatRoom(
  roomId: string,
  userId: string
): Promise<void> {
  const roomRef = doc(db, CHAT_ROOMS_COLLECTION, roomId);
  const roomDoc = await getDoc(roomRef);
  
  if (!roomDoc.exists()) return;
  
  const data = roomDoc.data();
  const newParticipants = data.participants.filter((id: string) => id !== userId);
  
  if (newParticipants.length === 0) {
    // Delete room if no participants left
    await deleteDoc(roomRef);
  } else {
    await updateDoc(roomRef, {
      participants: newParticipants,
      updatedAt: serverTimestamp(),
    });
  }
}

/**
 * Toggle pin status on a chat room
 */
export async function togglePinChatRoom(
  roomId: string,
  isPinned: boolean
): Promise<void> {
  const roomRef = doc(db, CHAT_ROOMS_COLLECTION, roomId);
  await updateDoc(roomRef, {
    isPinned,
    updatedAt: serverTimestamp(),
  });
}
