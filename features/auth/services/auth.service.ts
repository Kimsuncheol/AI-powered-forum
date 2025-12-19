import { 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { userProfileRepo } from "@/features/profile/repositories/userProfileRepo";
import { Timestamp } from "firebase/firestore";

export const authService = {
  /**
   * Signs up a new user with email and password, and creates their Firestore profile.
   */
  signUp: async (email: string, password: string) => {
    try {
      // 1. Create Auth User
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const displayName = user.displayName || email.split("@")[0];

      // 2. Create Firestore Profile
      // We use upsert to be safe, though set would work for new users.
      // Default role is 'user'.
      await userProfileRepo.upsertUserProfile(user.uid, {
        email: user.email || email,
        displayName,
        displayNameLower: displayName.toLowerCase(),
        role: "user",
        createdAt: Date.now(),
      });

      return user;
    } catch (error) {
      console.error("Error in authService.signUp:", error);
      throw error;
    }
  },

  /**
   * Signs in with Google and ensures a Firestore profile exists.
   */
  signInWithGoogle: async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      const displayName = user.displayName || "User";

      // 3. Ensure Profile Exists
      // Google users might already have a profile, so we definitely want upsert/merge behavior.
      // We only update fields if they are missing or if we want to sync them. 
      // For now, we'll just ensure the document exists with basic info.
      await userProfileRepo.upsertUserProfile(user.uid, {
        email: user.email || "",
        displayName,
        displayNameLower: displayName.toLowerCase(),
        // We do NOT overwrite role or createdAt if they exist, handled by repo merge logic?
        // Actually, our repo uses { merge: true }, so this is safe for existing fields like 'role'.
        // However, we shouldn't overwrite createdAt if it exists. 
        // Ideally the repo should handle "create only if not exists" or we check existence first.
        // For simplicity in this MVP, we'll write:
      });
      
      // Fine-tuning: If we want to strictly avoid overwriting createdAt, we should ideally check existence.
      // But `upsertUserProfile` just merges. 
      // Let's rely on the fact that `upsertUserProfile` merges.
      // Re-writing 'createdAt' on every login is bad. 
      // We should check if profile exists first?
      // Or better, let's just update 'lastLogin' if we had that field. 
      // For now, let's mostly trust the merge, but realize `createdAt` might get updated if we pass it.
      // FIX: Don't pass createdAt here to avoid overwriting it on every login. Use a separate logic if needed.
      // We only pass email/displayName to keep them in sync.
      
       await userProfileRepo.upsertUserProfile(user.uid, {
        email: user.email || "",
        displayName,
        displayNameLower: displayName.toLowerCase(),
      });

      return user;
    } catch (error) {
      console.error("Error in authService.signInWithGoogle:", error);
      throw error;
    }
  },

  /**
   * Standard Email Sign In (No profile creation needed usually, but could verify).
   */
  signInWithEmail: async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  },

  signOut: async () => {
    return firebaseSignOut(auth);
  }
};
