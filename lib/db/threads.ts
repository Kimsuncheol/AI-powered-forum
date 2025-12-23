import { db } from "@/lib/firebase";
import {
  collection,
  query,
  getDocs,
  orderBy,
  limit,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
  addDoc,
  Timestamp,
  doc,
  getDoc,
} from "firebase/firestore";

export interface LocationData {
  address: string;
  lat: number;
  lng: number;
  name?: string;
  placeId?: string;
}

export interface Thread {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: number; // Stored as number (millis) for easier serialization
  tags: string[];
  likes: number;
  commentsCount: number;
  location?: LocationData;
  type?: 'text' | 'markdown' | 'link' | 'video' | 'audio';
  linkUrl?: string;
  mediaUrl?: string;
  imageUrls?: string[];
  isNSFW?: boolean;
  likesCount?: number;
}

export const THREADS_COLLECTION = "threads";
const PAGE_SIZE = 10;

export async function getThreads(
  lastDoc?: QueryDocumentSnapshot<DocumentData>,
  sortBy: "latest" | "popular" = "latest"
) {
  const threadsRef = collection(db, THREADS_COLLECTION);
  let q = query(
    threadsRef,
    orderBy(sortBy === "latest" ? "createdAt" : "likes", "desc"),
    limit(PAGE_SIZE)
  );

  if (lastDoc) {
    q = query(q, startAfter(lastDoc));
  }

  const snapshot = await getDocs(q);
  const threads: Thread[] = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      // Map 'body' field from Firestore to 'content' for display
      content: data.body || data.content || "",
      authorId: data.authorId,
      authorName: data.authorName || "",
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toMillis() : data.createdAt,
      tags: data.tagIds || data.tags || [],
      likes: data.likes || 0,
      commentsCount: data.commentsCount || 0,
      likesCount: data.likesCount || 0,
      location: data.location,
      type: data.type || 'text',
      linkUrl: data.linkUrl,
      mediaUrl: data.mediaUrl,
      imageUrls: data.imageUrls,
      isNSFW: data.isNSFW || false,
    } as Thread;
  });

  return {
    threads,
    lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
  };
}

export async function getThread(id: string): Promise<Thread | null> {
  const docRef = doc(db, THREADS_COLLECTION, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      title: data.title,
      // Map 'body' field from Firestore to 'content' for display
      content: data.body || data.content || "",
      authorId: data.authorId,
      authorName: data.authorName || "",
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toMillis() : data.createdAt,
      tags: data.tagIds || data.tags || [],
      likes: data.likes || 0,
      commentsCount: data.commentsCount || 0,
      likesCount: data.likesCount || 0,
      location: data.location,
      type: data.type || 'text',
      linkUrl: data.linkUrl,
      mediaUrl: data.mediaUrl,
      imageUrls: data.imageUrls,
      isNSFW: data.isNSFW || false,
    } as Thread;
  }
  return null;
}

export interface Comment {
  id: string;
  threadId: string;
  content: string;
  authorName: string;
  createdAt: number;
}

export async function getComments(threadId: string): Promise<Comment[]> {
  // Mock comments for now
  return [
    {
      id: "1",
      threadId,
      content: "This is a really interesting topic!",
      authorName: "Mock User 1",
      createdAt: Date.now() - 3600000,
    },
    {
      id: "2",
      threadId,
      content: "I agree, thanks for sharing.",
      authorName: "Mock User 2",
      createdAt: Date.now() - 1800000,
    },
  ];
}

export async function seedMockThreads() {
  const mockThreads = [
    {
      title: "Welcome to the AI Forum!",
      content: "This is a place to discuss all things AI. Feel free to share your thoughts and projects.",
      authorId: "admin",
      authorName: "Admin",
      tags: ["announcement", "welcome"],
      likes: 10,
      commentsCount: 2,
    },
    {
      title: "GPT-5 Predictions",
      content: "What do you think we can expect from the next generation of LLMs? Will it be AGI?",
      authorId: "user1",
      authorName: "AI_Enthusiast",
      tags: ["discussion", "gpt-5", "speculation"],
      likes: 5,
      commentsCount: 15,
    },
    {
      title: "Help with React & Firebase",
      content: "I'm building a forum app and stuck on Firestore pagination. Any tips?",
      authorId: "user2",
      authorName: "DevBeginner",
      tags: ["help", "react", "firebase"],
      likes: 2,
      commentsCount: 3,
    },
    // Add more if needed
  ];

  const threadsRef = collection(db, THREADS_COLLECTION);
  for (const thread of mockThreads) {
    await addDoc(threadsRef, {
      ...thread,
      createdAt: Timestamp.now().toMillis(),
    });
  }
}
