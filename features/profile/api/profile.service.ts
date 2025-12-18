import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  orderBy,
  limit,
} from "firebase/firestore";
import { UserProfile } from "../types";
import { Thread } from "@/features/thread/types"; // Reuse Thread type

export const profileService = {
  getUserProfile: async (uid: string): Promise<UserProfile | null> => {
    // In a real app, we'd fetch from a 'users' collection.
    // For now, we'll return a mock profile augmented with auth data passed from the UI potentially,
    // or if we strictly need to fetch, we can check if the doc exists.
    
    // Let's assume we have a users collection for roles/bio.
    // If not, we return a basic structure.
    try {
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      }
      
      return null;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  },

  getUserThreads: async (uid: string): Promise<Thread[]> => {
    try {
      const threadsRef = collection(db, "threads");
      const q = query(
        threadsRef,
        where("authorId", "==", uid), // Ideally authorId matches uid
        orderBy("createdAt", "desc"),
        limit(20)
      );
      
      const snapshot = await getDocs(q);
      // We need to map manually if we want to be strict, similar to repo
      // Reusing logic would be best, but simple mapping is fine here.
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Thread[];
    } catch (error) {
      console.error("Error fetching user threads:", error);
      return [];
    }
  },

  getUserComments: async (uid: string) => {
    // Placeholder
    return [];
  }
};
