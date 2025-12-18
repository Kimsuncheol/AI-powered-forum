import { Timestamp } from "firebase/firestore";

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: "user" | "admin";
  createdAt: number; // Milliseconds
  bio?: string;
}

export interface UserActivityStats {
  threadCount: number;
  commentCount: number;
}
