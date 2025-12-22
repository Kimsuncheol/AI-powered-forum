import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface ExportedData {
  profile: any;
  threads: any[];
  comments: any[];
  aiQuota: any;
  exportedAt: string;
}

/**
 * Export all user data
 */
export async function exportUserData(userId: string): Promise<ExportedData> {
  try {
    // Fetch profile
    const profileDoc = await getDoc(doc(db, "users", userId));
    const profile = profileDoc.exists() ? profileDoc.data() : null;

    // Fetch threads
    const threadsQuery = query(
      collection(db, "threads"),
      where("authorId", "==", userId)
    );
    const threadsSnapshot = await getDocs(threadsQuery);
    const threads = threadsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Fetch comments
    const commentsQuery = query(
      collection(db, "comments"),
      where("authorId", "==", userId)
    );
    const commentsSnapshot = await getDocs(commentsQuery);
    const comments = commentsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Fetch AI quota
    const quotaDoc = await getDoc(doc(db, "aiQuotas", userId));
    const aiQuota = quotaDoc.exists() ? quotaDoc.data() : null;

    return {
      profile,
      threads,
      comments,
      aiQuota,
      exportedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error exporting user data:", error);
    throw new Error("Failed to export data");
  }
}
