import {
  doc,
  getDoc,
  serverTimestamp,
  increment,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

const THREAD_LIKES_COLLECTION = "threadLikes";
const THREADS_COLLECTION = "threads";

/**
 * Toggle like on a thread
 * @param threadId - ID of the thread to like/unlike
 * @param userId - ID of the user performing the action
 * @returns Promise<boolean> - true if liked, false if unliked
 */
export async function toggleLike(
  threadId: string,
  userId: string
): Promise<boolean> {
  const likeDocId = `${threadId}_${userId}`;
  const likeDocRef = doc(db, THREAD_LIKES_COLLECTION, likeDocId);
  const threadDocRef = doc(db, THREADS_COLLECTION, threadId);

  // Check if like already exists
  const likeSnap = await getDoc(likeDocRef);
  const isLiked = likeSnap.exists();

  const batch = writeBatch(db);

  if (isLiked) {
    // Unlike: delete like document and decrement count
    batch.delete(likeDocRef);
    batch.update(threadDocRef, {
      likesCount: increment(-1),
    });
  } else {
    // Like: create like document and increment count
    batch.set(likeDocRef, {
      threadId,
      userId,
      createdAt: serverTimestamp(),
    });
    batch.update(threadDocRef, {
      likesCount: increment(1),
    });
  }

  await batch.commit();
  return !isLiked; // Return new state
}

/**
 * Check if user has liked a thread
 * @param threadId - ID of the thread
 * @param userId - ID of the user
 * @returns Promise<boolean> - true if user has liked the thread
 */
export async function getUserLike(
  threadId: string,
  userId: string
): Promise<boolean> {
  const likeDocId = `${threadId}_${userId}`;
  const likeDocRef = doc(db, THREAD_LIKES_COLLECTION, likeDocId);
  const likeSnap = await getDoc(likeDocRef);
  return likeSnap.exists();
}
