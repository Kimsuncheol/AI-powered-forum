import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { BookmarkedThread, BookmarkInput } from "../types";

const BOOKMARKS_COLLECTION = "bookmarks";
const USER_BOOKMARKS_SUBCOLLECTION = "bookmarks";

/**
 * Get all bookmarks for a user
 */
export async function getBookmarks(userId: string): Promise<BookmarkedThread[]> {
  const userBookmarksRef = collection(
    db,
    BOOKMARKS_COLLECTION,
    userId,
    USER_BOOKMARKS_SUBCOLLECTION
  );
  
  const q = query(userBookmarksRef, orderBy("createdAt", "desc"));

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as BookmarkedThread[];
}

/**
 * Add a bookmark
 */
export async function addBookmark(
  userId: string,
  input: BookmarkInput
): Promise<BookmarkedThread> {
  const bookmarkDocRef = doc(
    db,
    BOOKMARKS_COLLECTION,
    userId,
    USER_BOOKMARKS_SUBCOLLECTION,
    input.threadId
  );

  const bookmarkData = {
    threadId: input.threadId,
    userId,
    threadTitle: input.threadTitle,
    threadAuthorId: input.threadAuthorId,
    createdAt: serverTimestamp(),
  };

  await setDoc(bookmarkDocRef, bookmarkData);

  return {
    id: input.threadId,
    ...bookmarkData,
    createdAt: Timestamp.now(),
  };
}

/**
 * Remove a bookmark
 */
export async function removeBookmark(
  userId: string,
  threadId: string
): Promise<void> {
  const bookmarkDocRef = doc(
    db,
    BOOKMARKS_COLLECTION,
    userId,
    USER_BOOKMARKS_SUBCOLLECTION,
    threadId
  );
  await deleteDoc(bookmarkDocRef);
}

/**
 * Check if a thread is bookmarked by a user
 */
export async function isBookmarked(
  userId: string,
  threadId: string
): Promise<boolean> {
  const bookmarkDocRef = doc(
    db,
    BOOKMARKS_COLLECTION,
    userId,
    USER_BOOKMARKS_SUBCOLLECTION,
    threadId
  );
  const docSnap = await getDoc(bookmarkDocRef);
  return docSnap.exists();
}

/**
 * Toggle bookmark status
 */
export async function toggleBookmark(
  userId: string,
  input: BookmarkInput
): Promise<boolean> {
  const currentlyBookmarked = await isBookmarked(userId, input.threadId);

  if (currentlyBookmarked) {
    await removeBookmark(userId, input.threadId);
    return false;
  } else {
    await addBookmark(userId, input);
    return true;
  }
}

