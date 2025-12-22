import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  deleteUser,
} from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  writeBatch,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

/**
 * Delete a user's account and all associated data
 */
export async function deleteUserAccount(
  userId: string,
  password?: string
): Promise<void> {
  const user = auth.currentUser;
  
  if (!user || user.uid !== userId) {
    throw new Error("User not authenticated or mismatch");
  }

  // Re-authenticate if password is provided
  if (password && user.email) {
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);
  }

  try {
    // Delete all user's threads
    await deleteUserThreads(userId);

    // Delete all user's comments
    await deleteUserComments(userId);

    // Delete user profile
    await deleteDoc(doc(db, "users", userId));

    // Delete AI quota
    const quotaRef = doc(db, "aiQuotas", userId);
    await deleteDoc(quotaRef).catch(() => {}); // Ignore if doesn't exist

    // Delete Firebase Auth user
    await deleteUser(user);

    // Clear local storage
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
  } catch (error: any) {
    if (error.code === "auth/requires-recent-login") {
      throw new Error("Please sign in again before deleting your account");
    }
    throw error;
  }
}

/**
 * Delete all threads created by a user
 */
async function deleteUserThreads(userId: string): Promise<void> {
  const threadsQuery = query(
    collection(db, "threads"),
    where("authorId", "==", userId)
  );

  const threadsSnapshot = await getDocs(threadsQuery);
  
  // Use batched writes for efficiency (max 500 per batch)
  const batches: any[][] = [];
  let currentBatch: any[] = [];

  threadsSnapshot.forEach((doc) => {
    currentBatch.push(doc.ref);
    
    if (currentBatch.length === 500) {
      batches.push(currentBatch);
      currentBatch = [];
    }
  });

  if (currentBatch.length > 0) {
    batches.push(currentBatch);
  }

  // Execute all batches
  for (const batchRefs of batches) {
    const batch = writeBatch(db);
    batchRefs.forEach((ref) => batch.delete(ref));
    await batch.commit();
  }
}

/**
 * Delete all comments created by a user
 */
async function deleteUserComments(userId: string): Promise<void> {
  const commentsQuery = query(
    collection(db, "comments"),
    where("authorId", "==", userId)
  );

  const commentsSnapshot = await getDocs(commentsQuery);
  
  // Use batched writes
  const batches: any[][] = [];
  let currentBatch: any[] = [];

  commentsSnapshot.forEach((doc) => {
    currentBatch.push(doc.ref);
    
    if (currentBatch.length === 500) {
      batches.push(currentBatch);
      currentBatch = [];
    }
  });

  if (currentBatch.length > 0) {
    batches.push(currentBatch);
  }

  // Execute all batches
  for (const batchRefs of batches) {
    const batch = writeBatch(db);
    batchRefs.forEach((ref) => batch.delete(ref));
    await batch.commit();
  }
}
