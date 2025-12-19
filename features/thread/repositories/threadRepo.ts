import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ThreadCreateInput } from "../types";
import { buildTitleTokens, normalizeTitleForSearch } from "../search/utils/titleSearch";

const THREADS_COLLECTION = "threads";

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
  if (!input.body || input.body.trim().length === 0) {
    throw new Error("Body content is required.");
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
