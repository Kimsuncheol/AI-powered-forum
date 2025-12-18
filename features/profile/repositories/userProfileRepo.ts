import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { UserProfile } from "../types";

const USERS_COLLECTION = "users";

export const userProfileRepo = {
  /**
   * Fetches a user profile by UID.
   * Returns null if the document does not exist.
   */
  getUserProfile: async (uid: string): Promise<UserProfile | null> => {
    try {
      const docRef = doc(db, USERS_COLLECTION, uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw new Error("Failed to fetch user profile");
    }
  },

  /**
   * Creates or updates a user profile.
   * Merges with existing data.
   */
  upsertUserProfile: async (uid: string, data: Partial<UserProfile>): Promise<void> => {
    try {
      const docRef = doc(db, USERS_COLLECTION, uid);
      
      // Clean undefined values to adhere to Firestore requirements if necessary,
      // but setDoc with merge handles mostly fine.
      // We manually add updatedAt if we wanted to track it.
      
      await setDoc(docRef, { ...data, uid }, { merge: true });
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw new Error("Failed to update user profile");
    }
  },
};
