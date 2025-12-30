import {
  collection,
  addDoc,
  doc,
  getDoc,
  serverTimestamp,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ThreadCreateInput, Thread } from "../types";
import { buildTitleTokens, normalizeTitleForSearch } from "../search/utils/titleSearch";

const THREADS_COLLECTION = "threads";

/**
 * Gets a single thread by ID.
 * 
 * @param threadId - The ID of the thread to fetch
 * @returns The thread data or null if not found
 */
export async function getThread(threadId: string): Promise<Thread | null> {
  try {
    const docRef = doc(db, THREADS_COLLECTION, threadId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as Thread;
  } catch (error) {
    console.error("Error fetching thread:", error);
    return null;
  }
}

/**
 * Creates a new thread in Firestore.
 * 
 * @param input - The thread creation data (title, body, etc.)
 * @param authorId - The ID of the user creating the thread
 * @returns Object containing the new thread's ID
 */
export async function createThread(
  input: ThreadCreateInput,
  authorId: string
): Promise<{ id: string }> {
  // 1. Validate Input
  if (!input.title || input.title.trim().length < 3) {
    throw new Error("Title must be at least 3 characters long.");
  }
  // Body validation: required for text/markdown, optional for link/video/audio
  if (!['link', 'video', 'audio'].includes(input.type || 'text') && (!input.body || input.body.trim().length === 0)) {
    throw new Error("Body content is required.");
  }
  if (input.type === 'link' && (!input.linkUrl || input.linkUrl.trim().length === 0)) {
    throw new Error("Link URL is required.");
  }
  if ((input.type === 'video' || input.type === 'audio') && (!input.mediaUrl || input.mediaUrl.trim().length === 0)) {
    throw new Error("Media URL is required.");
  }
  if (!input.categoryId) {
    throw new Error("Category is required.");
  }
  if (!authorId) {
    throw new Error("Author ID is required.");
  }

  // 2. Prepare Data
  const titleLower = normalizeTitleForSearch(input.title);
  const titleTokens = buildTitleTokens(input.title);
  const threadData = {
    title: input.title.trim(),
    titleLower,
    titleTokens,
    body: input.body.trim(),
    categoryId: input.categoryId,
    tagIds: input.tagIds || [],
    authorId,
    type: input.type || 'text',
    linkUrl: input.linkUrl || null,
    mediaUrl: input.mediaUrl || null,
    imageUrls: input.imageUrls || [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    // 3. Write to Firestore
    const docRef = await addDoc(collection(db, THREADS_COLLECTION), threadData);
    return { id: docRef.id };
  } catch (error) {
    console.error("Error creating thread:", error);
    throw new Error("Failed to create thread. Please try again later.");
  }
}

/**
 * Fetches recent threads.
 * 
 * @param limitCount - The maximum number of threads to fetch (default: 20)
 * @returns List of threads
 */
export async function getRecentThreads(limitCount: number = 20): Promise<Thread[]> {
  try {
    const q = query(
      collection(db, THREADS_COLLECTION),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Thread));
  } catch (error) {
    console.error("Error fetching recent threads:", error);
    return [];
  }
}

